#!/usr/bin/env node

// ================== GLOBAL SAFETY ==================
process.on("uncaughtException", (err) => {
  console.error("[FATAL] Uncaught exception:", err);
  process.exit(1);
});
process.on("unhandledRejection", (reason) => {
  console.error("[FATAL] Unhandled rejection:", reason);
  process.exit(1);
});

// ================== IMPORTS ==================
const fs = require("fs");
const path = require("path");
const dns = require("dns").promises;
const tls = require("tls");
const cheerio = require("cheerio");
const chalk = require("chalk");
const crypto = require("crypto");
const { ProxyAgent } = require("proxy-agent");

// Optional Puppeteer
let puppeteer;
let globalBrowser = null;
let browserHealthInterval = null;
let browserLaunchLock = false;
let proxyActive = false;
let proxyConsecutiveFailures = 0;
const PROXY_FAILURE_THRESHOLD = 3;
try {
  puppeteer = require("puppeteer-extra");
  const StealthPlugin = require("puppeteer-extra-plugin-stealth");
  puppeteer.use(StealthPlugin());
} catch (e) {
  puppeteer = null;
}

// ================== BROWSER HEALTH MANAGEMENT ==================
async function isBrowserHealthy() {
  if (!globalBrowser) return false;
  try {
    const versionPromise = globalBrowser.version();
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Health check timeout")), 5000));
    await Promise.race([versionPromise, timeoutPromise]);
    return true;
  } catch {
    return false;
  }
}

async function killBrowser() {
  if (!globalBrowser) return;
  try { await globalBrowser.close(); } catch { }
  globalBrowser = null;
}

async function getHealthyBrowser() {
  if (shuttingDown) return null;
  if (globalBrowser && await isBrowserHealthy()) return globalBrowser;
  // Browser is dead or missing — kill zombie if exists, then relaunch
  if (globalBrowser) {
    await killBrowser();
  }
  if (browserLaunchLock) {
    // Another call is already launching — wait briefly and return whatever exists
    await new Promise(r => setTimeout(r, 2000));
    return globalBrowser;
  }
  browserLaunchLock = true;
  try {
    const launchPromise = puppeteer.launch({
      headless: "new",
      handleSIGINT: false,
      handleSIGTERM: false,
      handleSIGHUP: false,
      dumpio: false,
      env: { ...process.env, PUPPETEER_NO_SANDBOX: "1" },
      args: proxyActive ? [`--proxy-server=${flags.proxy}`] : [],
    });
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Browser launch timeout")), 30000));
    globalBrowser = await Promise.race([launchPromise, timeoutPromise]);
    return globalBrowser;
  } catch (err) {
    globalBrowser = null;
    return null;
  } finally {
    browserLaunchLock = false;
  }
}

function startBrowserHealthMonitor() {
  if (browserHealthInterval) return;
  browserHealthInterval = setInterval(async () => {
    if (globalBrowser && !await isBrowserHealthy()) {
      await killBrowser();
    }
  }, 30000);
  // Don't let the interval prevent Node from exiting
  if (browserHealthInterval.unref) browserHealthInterval.unref();
}

// ================== PROXY HEALTH MANAGEMENT ==================
async function testProxy(proxyUrl) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch("https://httpbin.org/ip", {
      signal: controller.signal,
      agent: new ProxyAgent(proxyUrl),
    });
    clearTimeout(timer);
    return res.ok;
  } catch {
    return false;
  }
}

function trackProxyFailure() {
  proxyConsecutiveFailures++;
  if (proxyConsecutiveFailures >= PROXY_FAILURE_THRESHOLD && proxyActive) {
    proxyActive = false;
    console.log(chalk.yellow(`\n[⚠] Proxy failed ${PROXY_FAILURE_THRESHOLD} times consecutively — falling back to direct connection`));
  }
}

function trackProxySuccess() {
  proxyConsecutiveFailures = 0;
}

// ================== ARGUMENTS ==================
const rawArgs = process.argv.slice(2);
const positional = rawArgs.filter((a) => !a.startsWith("--"));

let input = positional[0] === "scan" ? positional[1] : positional[0];

const flags = {
  deep: rawArgs.includes("--deep"),
  threads: Math.max(1, parseInt(rawArgs.find((a) => a.startsWith("--threads="))?.split("=")[1], 10) || 20),
  output: rawArgs.find((a) => a.startsWith("--output="))?.split("=")[1] || null,
  aggressive: rawArgs.includes("--aggressive"),
  maxBytes: Math.max(250000, parseInt(rawArgs.find((a) => a.startsWith("--max-bytes="))?.split("=")[1], 10) || 4000000),
  js: !rawArgs.includes("--no-js"),
  auth: rawArgs.find((a) => a.startsWith("--auth="))?.split("=")[1] || null,
  cookie: rawArgs.find((a) => a.startsWith("--cookie="))?.split("=")[1] || null,
  proxy: rawArgs.find((a) => a.startsWith("--proxy="))?.split("=")[1] || null,
  delay: parseInt(rawArgs.find((a) => a.startsWith("--delay="))?.split("=")[1], 10) || 500,
  jitter: parseInt(rawArgs.find((a) => a.startsWith("--jitter="))?.split("=")[1], 10) || 300,
  resume: rawArgs.includes("--resume"),
  html: rawArgs.find((a) => a.startsWith("--html="))?.split("=")[1] || null,
  showFull: rawArgs.includes("--show-full") || true,
  userAgent: rawArgs.find((a) => a.startsWith("--user-agent="))?.split("=")[1] || null,
  subdomains: !rawArgs.includes("--no-subdomains"),
  historical: rawArgs.includes("--historical"),
  onlyCritical: rawArgs.includes("--only-critical"),
  noLow: !rawArgs.includes("--with-low"),
  includeMedium: !rawArgs.includes("--no-medium"),
  selfTest: rawArgs.includes("--self-test"),
};

// ================== SELF-TEST MODE (ENHANCED) ==================
if (flags.selfTest) {
  console.log(chalk.blue("\n[🧪] Running self-test mode...\n"));
  const tests = [
    {
      name: "URL normalization", fn: () => {
        const testUrl = "https://example.com/path?a=1&b=2#hash";
        const normalized = normalizeUrl(testUrl);
        return normalized === "https://example.com/path?a=1&b=2";
      }
    },
    {
      name: "Tech detection (Next.js)", fn: () => {
        const headers = { "content-type": "text/html" };
        const body = '<html><body><script>__NEXT_DATA__</script></body></html>';
        const techMap = detectTechAdvanced(headers, body, "https://example.com");
        return techMap.has("Next.js") && techMap.get("Next.js").confidence > 90;
      }
    },
    {
      name: "Intelligence extraction (env vars)", fn: () => {
        const js = "process.env.NEXT_PUBLIC_API_URL = 'https://api.com'";
        const blobs = [{ kind: "js", text: js, source: "test.js" }];
        const intel = extractClientIntelligence(blobs);
        return intel.env.has("NEXT_PUBLIC_API_URL");
      }
    },
    {
      name: "Secret detection (OpenAI key)", fn: () => {
        const text = "sk-proj-12345678901234567890123456789012345678901234567890";
        const findings = new Map();
        scanTextForSecrets(text, "test", findings);
        return findings.size > 0 && [...findings.values()][0].kind === "openai_key";
      }
    },
  ];
  let allPass = true;
  for (const t of tests) {
    try {
      const pass = t.fn();
      console.log(`${pass ? "✅" : "❌"} ${t.name}`);
      if (!pass) allPass = false;
    } catch (e) {
      console.log(`❌ ${t.name} (error: ${e.message})`);
      allPass = false;
    }
  }
  if (allPass) console.log(chalk.green("\n✅ All tests passed."));
  else console.log(chalk.red("\n❌ Some tests failed."));
  process.exit(0);
}

// ================== AGGRESSIVE MODE WARNING ==================
if (flags.aggressive) {
  console.log(chalk.bold.yellow("\n⚠️ Aggressive mode activated – scan may take longer and perform deep analysis\n"));
}

// ================== USER-AGENT ROTATION ==================
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/119.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/118.0",
];

function getUserAgent() {
  if (flags.userAgent) return flags.userAgent;
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

// ================== RATE LIMITING & DELAY ==================
let lastRequestTime = 0;
async function rateLimit() {
  if (flags.aggressive) {
    const wait = Math.max(100, flags.delay * 0.5 + Math.random() * flags.jitter * 0.5);
    const now = Date.now();
    const elapsed = now - lastRequestTime;
    if (elapsed < wait) {
      await new Promise((r) => setTimeout(r, wait - elapsed));
    }
    lastRequestTime = Date.now();
  } else {
    const now = Date.now();
    const wait = flags.delay + Math.random() * flags.jitter;
    const elapsed = now - lastRequestTime;
    if (elapsed < wait) {
      await new Promise((r) => setTimeout(r, wait - elapsed));
    }
    lastRequestTime = Date.now();
  }
}

async function lightDelay() {
  const wait = 300 + Math.random() * 200;
  await new Promise((r) => setTimeout(r, wait));
}

function banner() {
  console.log(chalk.bold.cyan(`
██████╗ ███████╗ ██████╗ ██████╗ ███╗   ██╗██╗██╗  ██╗
██╔══██╗██╔════╝██╔════╝██╔═══██╗████╗  ██║██║╚██╗██╔╝
██████╔╝█████╗  ██║     ██║   ██║██╔██╗ ██║██║ ╚███╔╝ 
██╔══██╗██╔══╝  ██║     ██║   ██║██║╚██╗██║██║ ██╔██╗ 
██║  ██║███████╗╚██████╗╚██████╔╝██║ ╚████║██║██╔╝ ██╗
╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝╚═╝  ╚═╝
`));
  console.log(chalk.bold.white("Reconix ") + chalk.bold.green("Leak Scanner ") + chalk.bold.red("• Threat Intelligence Suite"));
  console.log(chalk.gray("────────────────────────────────────────────"));
  console.log(chalk.cyan("🔍 Deep Exposure Intelligence") + chalk.gray("  •  ") + chalk.magenta("⚡ High-Signal Recon Engine"));
  console.log(chalk.gray("Developer: ") + chalk.bold.blue("Aquib"));
  console.log("\n" + chalk.bgRed.white.bold(" ⚠ AUTHORIZED USE ONLY ") + " " + chalk.redBright("Unauthorized scanning is illegal & punishable"));
  console.log("\n");
}

function usage() {
  banner();
  console.log(chalk.bold.yellow("📌 Usage:\n"));
  console.log(chalk.white("  reconix <url> [options]"));
  console.log(chalk.white("  reconix scan <url> [options]\n"));
  console.log(chalk.bold.cyan("🌐 Discovery"));
  console.log(chalk.gray("────────────────────────────────────"));
  console.log(chalk.green("  --subdomains") + chalk.gray("       Discover subdomains via crt.sh (default: ON)"));
  console.log(chalk.green("  --historical") + chalk.gray("       Fetch archived URLs (Wayback Machine)"));
  console.log(chalk.bold.cyan("\n🔎 Filtering"));
  console.log(chalk.gray("────────────────────────────────────"));
  console.log(chalk.green("  --only-critical") + chalk.gray("    Show only high-confidence secrets"));
  console.log(chalk.green("  --no-low") + chalk.gray("           Hide low-confidence findings"));
  console.log(chalk.green("  --include-medium") + chalk.gray("  Include medium-confidence findings (default: ON)"));
  console.log(chalk.bold.cyan("\n⚙️ Scanning"));
  console.log(chalk.gray("────────────────────────────────────"));
  console.log(chalk.green("  --deep") + chalk.gray("             Increase crawl depth"));
  console.log(chalk.green("  --threads=<n>") + chalk.gray("      Concurrent requests (default: 20)"));
  console.log(chalk.green("  --delay=<ms>") + chalk.gray("       Base delay (default: 500)"));
  console.log(chalk.green("  --jitter=<ms>") + chalk.gray("      Random delay variation (default: 300)"));
  console.log(chalk.green("  --resume") + chalk.gray("           Resume previous scan state"));
  console.log(chalk.bold.cyan("\n🧠 Advanced"));
  console.log(chalk.gray("────────────────────────────────────"));
  console.log(chalk.green("  --js") + chalk.gray("               Enable headless browser (Puppeteer)"));
  console.log(chalk.green("  --auth=<user:pass>") + chalk.gray("  Basic/Bearer authentication"));
  console.log(chalk.green("  --cookie=<str>") + chalk.gray("      Custom Cookie header"));
  console.log(chalk.green("  --proxy=<host:port>") + chalk.gray("  Use proxy (HTTP/SOCKS)"));
  console.log(chalk.green("  --user-agent=<str>") + chalk.gray("  Custom User-Agent"));
  console.log(chalk.bold.cyan("\n📄 Output"));
  console.log(chalk.gray("────────────────────────────────────"));
  console.log(chalk.green("  --output=<file>") + chalk.gray("      Save JSON report"));
  console.log(chalk.green("  --html=<file>") + chalk.gray("        Generate HTML report"));
  console.log(chalk.green("  --show-full") + chalk.gray("        Show full secret values"));
  console.log(chalk.bold.cyan("\n🔥 Modes"));
  console.log(chalk.gray("────────────────────────────────────"));
  console.log(chalk.red("  --aggressive") + chalk.gray("       Deep full-scope scan (slow but powerful)"));
  console.log(chalk.bold.cyan("\n🧪 Testing"));
  console.log(chalk.gray("────────────────────────────────────"));
  console.log(chalk.green("  --self-test") + chalk.gray("        Run internal self-test and exit"));
  console.log(chalk.bold.cyan("\n❓ Help"));
  console.log(chalk.gray("────────────────────────────────────"));
  console.log(chalk.green("  --help") + chalk.gray("            Show this help menu\n"));
  console.log(chalk.bold.magenta("🚀 Examples"));
  console.log(chalk.gray("────────────────────────────────────"));
  console.log(chalk.white("  reconix example.com"));
  console.log(chalk.white("  reconix example.com --aggressive"));
  console.log(chalk.white("  reconix example.com --only-critical"));
  console.log(chalk.white("  reconix example.com --html=report.html\n"));
}

// ================== INPUT NORMALIZATION ==================
function normalizeTarget(raw) {
  const trimmed = String(raw || "").trim();
  if (!trimmed) return null;
  try {
    const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const u = new URL(withScheme);
    u.hash = "";
    return u.href;
  } catch {
    return null;
  }
}

if (!input || rawArgs.includes("--help")) {
  usage();
  process.exit(0);
}

const targetUrl = normalizeTarget(input);
if (!targetUrl) {
  usage();
  process.exit(0);
}

const target = new URL(targetUrl);
const rootHost = target.hostname.toLowerCase();
const scopeHost = rootHost.replace(/^www\./i, "");

// ================== GLOBAL DATA MODEL (SINGLE SOURCE OF TRUTH) ==================
const ReconStore = {
  urls: new Map(),          // normalized URL -> { status, type, depth, sources: [] }
  endpoints: new Map(),     // normalized URL -> { method, params, source, confidence }
  secrets: new Map(),       // normalized value -> finding object
  technologies: new Map(),  // normalized name -> { category, confidence, evidence: Set, sources: Set }
  subdomains: new Set(),
  findings: [],             // final processed findings (after all steps)
  meta: {
    startTime: null,
    endTime: null,
    scanDuration: 0,
    totalRequests: 0,
    totalBlobs: 0,
  },
  intelligence: {
    auth: null,
    apis: { user: [], admin: [], internal: [] },
    services: new Set(),
    env: new Set(),
    flags: new Set(),
    endpointsByCategory: {},
  },
};

// ================== NORMALIZATION ENGINE ==================
function normalizeUrl(url) {
  try {
    const u = new URL(url);
    u.hash = "";
    const params = new URLSearchParams(u.search);
    const sorted = [...params.entries()].sort();
    u.search = sorted.map(([k, v]) => `${k}=${v}`).join("&");
    return u.href.toLowerCase();
  } catch {
    return null;
  }
}

function normalizeEndpoint(endpoint) {
  // Remove dynamic IDs (e.g., /user/123 -> /user/:id)
  return endpoint.replace(/\/[0-9a-f]{8,}/gi, "/:id")
    .replace(/\/[0-9]+/g, "/:num")
    .replace(/\/[a-f0-9-]{36}/g, "/:uuid");
}

// ================== GLOBAL DEDUP SYSTEM ==================
function addUnique(map, key, value) {
  if (!map.has(key)) {
    map.set(key, value);
  } else {
    const existing = map.get(key);
    // Merge sources and evidence
    if (value.sources) {
      existing.sources = existing.sources || new Set();
      value.sources.forEach(s => existing.sources.add(s));
    }
    if (value.evidence) {
      existing.evidence = existing.evidence || new Set();
      value.evidence.forEach(e => existing.evidence.add(e));
    }
    if (value.confidence > (existing.confidence || 0)) {
      existing.confidence = value.confidence;
    }
    map.set(key, { ...existing, ...value });
  }
}

// ================== UTILITY FUNCTIONS ==================
function truncate(str, len = 80) {
  if (flags.showFull) return String(str ?? "");
  const s = String(str ?? "");
  return s.length <= len ? s : `${s.slice(0, len)}...`;
}

function entropy(str) {
  if (!str || str.length < 2) return 0;
  const map = {};
  for (const c of str) map[c] = (map[c] || 0) + 1;
  return Object.values(map)
    .map((f) => f / str.length)
    .reduce((sum, p) => sum - p * Math.log2(p), 0);
}

function charClasses(str) {
  let classes = 0;
  if (/[a-z]/.test(str)) classes++;
  if (/[A-Z]/.test(str)) classes++;
  if (/[0-9]/.test(str)) classes++;
  if (/[^A-Za-z0-9]/.test(str)) classes++;
  return classes;
}

function isMostlyPrintable(str) {
  if (!str) return false;
  let printable = 0;
  for (const ch of str) {
    const code = ch.charCodeAt(0);
    if (code === 9 || code === 10 || code === 13 || (code >= 32 && code <= 126)) printable++;
  }
  return printable / str.length > 0.85;
}

function isAllowedUrl(raw, rootScopeHost) {
  try {
    const u = new URL(raw);
    if (!/^https?:$/i.test(u.protocol)) return false;
    const h = u.hostname.toLowerCase();
    const scope = rootScopeHost.toLowerCase();
    return h === scope || h.endsWith(`.${scope}`);
  } catch {
    return false;
  }
}

function detectKind(url, contentType, body = "") {
  const ct = String(contentType || "").toLowerCase();
  const lowerUrl = String(url || "").toLowerCase();
  const sample = String(body || "").trim();
  if (ct.includes("text/html") || /\.(html?|xhtml)(\?|#|$)/i.test(lowerUrl)) return "html";
  if (ct.includes("javascript") || ct.includes("ecmascript") || /\.(mjs|cjs|js)(\?|#|$)/i.test(lowerUrl)) return "js";
  if (ct.includes("text/css") || /\.css(\?|#|$)/i.test(lowerUrl)) return "css";
  if (ct.includes("json") || /\.json(\?|#|$)/i.test(lowerUrl)) return "json";
  if (ct.includes("xml") || /\.xml(\?|#|$)/i.test(lowerUrl)) return "xml";
  if (/\.(map)(\?|#|$)/i.test(lowerUrl) || ct.includes("source map")) return "map";
  if (ct.includes("text/plain") || /\.(txt|log|md|ini|conf|env)(\?|#|$)/i.test(lowerUrl)) return "text";
  if (sample.startsWith("<")) return "html";
  return "text";
}

function renderProgress(label, current, total) {
  const width = 22;
  const safeTotal = Math.max(1, total);
  const ratio = Math.min(1, current / safeTotal);
  const filled = Math.round(ratio * width);
  const bar = "█".repeat(filled) + "░".repeat(width - filled);
  process.stdout.write(`\r${label} [${bar}] ${current}/${safeTotal}`);
  if (current >= safeTotal) process.stdout.write("\n");
}

async function mapLimit(items, limit, iteratee) {
  const out = new Array(items.length);
  let nextIndex = 0;
  const workerCount = Math.max(1, Math.min(limit, items.length || 1));
  async function worker() {
    while (true) {
      const i = nextIndex++;
      if (i >= items.length) break;
      try {
        out[i] = await iteratee(items[i], i);
      } catch {
        out[i] = null;
      }
    }
  }
  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return out;
}

function headersToText(headers) {
  try {
    return Object.entries(headers || {})
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
  } catch {
    return "";
  }
}

function extractUrlsFromText(text, baseUrl, rootScopeHost, limit = 80) {
  const urls = [];
  const seen = new Set();
  const candidates = String(text || "").match(/(?:https?:\/\/|\/\/|\/)[^\s"'`<>()\[\]{}\\]+/g) || [];
  for (const raw of candidates) {
    if (urls.length >= limit) break;
    let abs = null;
    try { abs = new URL(raw, baseUrl).href; } catch { continue; }
    if (!isAllowedUrl(abs, rootScopeHost)) continue;
    const key = normalizeUrl(abs);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    urls.push(key);
  }
  return urls;
}

function extractSourceMapReference(text) {
  const re = /sourceMappingURL=([^\s"'`]+)/g;
  let last = null;
  let m;
  while ((m = re.exec(String(text || ""))) !== null) last = m[1];
  return last;
}

function decodeDataJsonRef(ref) {
  if (!ref) return null;
  const base64Match = ref.match(/^data:application\/json(?:;charset=[^;,]+)?;base64,(.+)$/i);
  if (base64Match) {
    try { return Buffer.from(base64Match[1], "base64").toString("utf8"); } catch { return null; }
  }
  const plainMatch = ref.match(/^data:application\/json(?:;charset=[^;,]+)?,(.+)$/i);
  if (plainMatch) {
    try { return decodeURIComponent(plainMatch[1]); } catch { return plainMatch[1]; }
  }
  return null;
}

function extractHtmlArtifacts(html, pageUrl, rootScopeHost) {
  const $ = cheerio.load(String(html || ""));
  const blobs = [];
  const urls = new Set();
  const baseHref = $("base[href]").attr("href");
  let effectiveBase = pageUrl;
  if (baseHref) {
    try { effectiveBase = new URL(baseHref, pageUrl).href; } catch { effectiveBase = pageUrl; }
  }
  const pushUrl = (candidate) => {
    if (!candidate) return;
    try {
      const abs = new URL(candidate, effectiveBase).href;
      if (!isAllowedUrl(abs, rootScopeHost)) return;
      const key = normalizeUrl(abs);
      if (key) urls.add(key);
    } catch { }
  };
  const urlAttrs = [
    ["a[href]", "href"], ["link[href]", "href"], ["script[src]", "src"],
    ["iframe[src]", "src"], ["img[src]", "src"], ["source[src]", "src"],
    ["video[src]", "src"], ["audio[src]", "src"], ["form[action]", "action"],
    ["object[data]", "data"],
  ];
  for (const [selector, attr] of urlAttrs) {
    $(selector).each((_, el) => pushUrl($(el).attr(attr)));
  }
  $("link").each((_, el) => {
    const rel = String($(el).attr("rel") || "").toLowerCase();
    const href = $(el).attr("href");
    if (!href) return;
    if (rel.includes("stylesheet") || rel.includes("preload") || rel.includes("modulepreload") ||
      rel.includes("prefetch") || rel.includes("manifest") || rel.includes("icon")) {
      pushUrl(href);
    }
  });
  $("meta[http-equiv='refresh'], meta[http-equiv='Refresh']").each((_, el) => {
    const content = String($(el).attr("content") || "");
    const m = content.match(/url\s*=\s*(.+)$/i);
    if (m && m[1]) pushUrl(m[1].replace(/^['"]|['"]$/g, ""));
  });
  $("script:not([src])").each((idx, el) => {
    const inline = String($(el).html() || "").trim();
    if (inline) {
      blobs.push({ source: `${pageUrl}::inline-script[${idx + 1}]`, kind: "inline-script", text: inline, headers: {}, status: 200, url: pageUrl });
    }
  });
  $("style").each((idx, el) => {
    const inline = String($(el).html() || "").trim();
    if (inline) {
      blobs.push({ source: `${pageUrl}::inline-style[${idx + 1}]`, kind: "inline-style", text: inline, headers: {}, status: 200, url: pageUrl });
    }
  });
  const bodyText = String(html || "");
  extractUrlsFromText(bodyText, effectiveBase, rootScopeHost, 50).forEach((u) => urls.add(u));
  return { urls: [...urls], blobs, baseUrl: effectiveBase };
}

function extractSitemapUrls(xmlText, xmlUrl, rootScopeHost) {
  const out = new Set();
  const re = /<loc>([^<]+)<\/loc>/gi;
  let m;
  while ((m = re.exec(String(xmlText || ""))) !== null) {
    try {
      const abs = new URL(m[1].trim(), xmlUrl).href;
      if (isAllowedUrl(abs, rootScopeHost)) out.add(normalizeUrl(abs));
    } catch { }
  }
  return [...out].filter(Boolean);
}

function extractManifestUrls(jsonText, manifestUrl, rootScopeHost) {
  const out = new Set();
  try {
    const obj = JSON.parse(String(jsonText || "{}"));
    const walk = (node) => {
      if (!node) return;
      if (typeof node === "string") {
        try { const abs = new URL(node, manifestUrl).href; if (isAllowedUrl(abs, rootScopeHost)) out.add(normalizeUrl(abs)); } catch { }
        return;
      }
      if (Array.isArray(node)) { for (const item of node) walk(item); return; }
      if (typeof node === "object") { for (const v of Object.values(node)) walk(v); }
    };
    walk(obj);
  } catch { }
  return [...out].filter(Boolean);
}

function sourceMapBlobsFromJson(mapText, mapUrl, rootScopeHost, enqueue) {
  const blobs = [];
  try {
    const map = JSON.parse(String(mapText || "{}"));
    if (Array.isArray(map.sourcesContent)) {
      map.sourcesContent.forEach((content, idx) => {
        if (typeof content === "string" && content.trim()) {
          blobs.push({ source: `${mapUrl}::sourcesContent[${idx}]`, kind: "source-content", text: content, headers: {}, status: 200, url: mapUrl });
        }
      });
    }
    if (Array.isArray(map.sources)) {
      for (const src of map.sources) {
        if (typeof src !== "string" || !src.trim()) continue;
        if (/^(webpack|vite|ng|node|internal):/i.test(src)) continue;
        try { const abs = new URL(src, mapUrl).href; if (isAllowedUrl(abs, rootScopeHost)) enqueue(abs, 1, mapUrl); } catch { }
      }
    }
    if (typeof map.file === "string" && map.file.trim()) {
      try { const abs = new URL(map.file, mapUrl).href; if (isAllowedUrl(abs, rootScopeHost)) enqueue(abs, 1, mapUrl); } catch { }
    }
  } catch { }
  return blobs;
}

function extractParams(url, html, pageUrl) {
  const params = new Set();
  try {
    const parsed = new URL(url);
    for (const [key, value] of parsed.searchParams) {
      params.add(JSON.stringify({ key, value, source: "query", url }));
    }
  } catch { }
  if (html) {
    const $ = cheerio.load(html);
    $("form").each((_, form) => {
      const action = $(form).attr("action") || "";
      const method = ($(form).attr("method") || "GET").toUpperCase();
      $(form).find("input, textarea, select").each((_, input) => {
        const name = $(input).attr("name");
        if (name) {
          params.add(JSON.stringify({ key: name, source: "form", method, action, page: pageUrl }));
        }
      });
    });
  }
  return [...params].map(p => JSON.parse(p));
}

// ================== AUTHENTICATION & NETWORK ==================
function buildAuthHeaders() {
  const headers = {};
  if (flags.auth) {
    if (flags.auth.startsWith("Bearer:")) {
      headers["Authorization"] = `Bearer ${flags.auth.slice(7)}`;
    } else {
      headers["Authorization"] = `Basic ${Buffer.from(flags.auth).toString("base64")}`;
    }
  }
  if (flags.cookie) headers["Cookie"] = flags.cookie;
  return headers;
}

async function safeFetchMeta(url, opts = {}) {
  const maxRetries = flags.aggressive ? 3 : 2;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    await rateLimit();
    const timeoutMs = opts.timeoutMs || (flags.aggressive ? 15000 : 12000);
    const maxBytes = Math.max(250000, opts.maxBytes || flags.maxBytes);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const fetchOpts = {
        method: "GET", redirect: "follow",
        headers: { "User-Agent": getUserAgent(), "Cache-Control": "no-cache", Pragma: "no-cache", ...buildAuthHeaders(), ...(opts.headers || {}) },
        signal: controller.signal,
      };
      if (proxyActive) fetchOpts.agent = new ProxyAgent(flags.proxy);
      const res = await fetch(url, fetchOpts);
      const headers = {};
      for (const [k, v] of res.headers.entries()) headers[k.toLowerCase()] = String(v);
      const contentType = String(headers["content-type"] || "").toLowerCase();
      const contentLength = parseInt(headers["content-length"] || "0", 10) || 0;
      const textLike = /text|javascript|ecmascript|json|xml|svg|yaml|yml|csv|html|css|manifest|x-www-form-urlencoded/.test(contentType) ||
        /\.(html?|xhtml|js|mjs|cjs|css|json|map|txt|xml|svg|yml|yaml|md|ini|conf|log)(\?|#|$)/i.test(url);
      const smallUnknown = !textLike && (contentLength === 0 || contentLength < 250000);
      let body = "";
      if (textLike || smallUnknown) {
        try { body = await res.text(); if (body.length > maxBytes) body = body.slice(0, maxBytes); } catch { body = ""; }
      }
      if (res.status === 429 && headers["retry-after"]) {
        const retryAfter = parseInt(headers["retry-after"], 10);
        if (!isNaN(retryAfter)) await new Promise(r => setTimeout(r, retryAfter * 1000));
        else await new Promise(r => setTimeout(r, 2000));
      }
      if (res.status >= 500 && attempt < maxRetries) throw new Error("Server error");
      if (proxyActive) trackProxySuccess();
      return { url, finalUrl: res.url || url, status: res.status || 0, headers, contentType, body };
    } catch (err) {
      if (proxyActive) trackProxyFailure();
      if (attempt < maxRetries) await new Promise(r => setTimeout(r, 1000 * attempt));
      continue;
    } finally {
      clearTimeout(timer);
    }
  }
  return null;
}

const BROWSER_FATAL_ERRORS = ["Target closed", "Protocol error", "Session closed", "browser has disconnected", "Navigation failed"];

function isBrowserFatalError(err) {
  const msg = String(err && err.message || err || "");
  return BROWSER_FATAL_ERRORS.some(fe => msg.includes(fe));
}

async function fetchWithBrowser(url) {
  if (!flags.js || !puppeteer) return null;
  const maxRetries = 2;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    let page = null;
    try {
      const browser = await getHealthyBrowser();
      if (!browser) return null;
      page = await browser.newPage();
      await page.setUserAgent(getUserAgent());
      if (flags.auth && flags.auth.startsWith("Bearer:")) await page.setExtraHTTPHeaders({ Authorization: `Bearer ${flags.auth.slice(7)}` });
      else if (flags.auth) { const [user, pass] = flags.auth.split(":"); await page.authenticate({ username: user, password: pass }); }
      if (flags.cookie) {
        const cookies = flags.cookie.split(";").map(c => { const [name, value] = c.trim().split("="); return { name, value, domain: target.hostname }; });
        await page.setCookie(...cookies);
      }
      // Network-level fingerprinting: capture all outgoing requests
      const capturedNetworkUrls = [];
      page.on("request", req => {
        try { capturedNetworkUrls.push(req.url()); } catch { }
      });
      const response = await page.goto(url, { waitUntil: "networkidle2", timeout: 15000 });
      const body = await page.content();
      const headers = response ? response.headers() : {};
      const finalUrl = page.url();
      const status = response ? response.status() : 200;
      // Process captured network requests for tech fingerprinting
      for (const netUrl of capturedNetworkUrls) {
        const matches = matchNetworkRequest(netUrl);
        for (const m of matches) {
          if (ReconStore && ReconStore.technologies) {
            const techKey = m.name;
            if (!ReconStore.technologies.has(techKey)) {
              ReconStore.technologies.set(techKey, { name: m.name, category: m.category, confidence: m.confidence, evidence: new Set(), sources: new Set() });
            }
            const tech = ReconStore.technologies.get(techKey);
            tech.confidence = Math.min(100, Math.max(tech.confidence, m.confidence));
            tech.evidence.add(`network: ${new URL(netUrl).hostname}`);
            tech.sources.add("network");
          }
        }
      }
      await page.close().catch(() => { });
      return { url, finalUrl, status, headers, contentType: headers["content-type"] || "text/html", body };
    } catch (err) {
      if (page) await page.close().catch(() => { });
      if (isBrowserFatalError(err)) {
        // Browser is dead — kill it so next attempt gets a fresh one
        await killBrowser();
      }
      if (attempt < maxRetries) await new Promise(r => setTimeout(r, 2000));
    }
  }
  return null;
}

process.once("SIGINT", async () => {
  console.log("\n\n[!] Interrupted by user");
  await cleanup();
  process.exit(0);
});

process.once("SIGTERM", async () => {
  console.log("\n\n[!] Terminated");
  await cleanup();
  process.exit(0);
});

// ================== DNS / SSL / REDIRECT ==================
async function getRedirectChain(startUrl) {
  const chain = [];
  let current = startUrl;
  for (let i = 0; i < 10; i++) {
    try {
      const res = await fetch(current, { redirect: "manual" });
      const headers = {};
      for (const [k, v] of res.headers.entries()) headers[k.toLowerCase()] = String(v);
      chain.push({ url: current, status: res.status || 0 });
      const loc = res.headers.get("location");
      if (!loc) break;
      const next = loc.startsWith("http") ? loc : new URL(loc, current).href;
      current = next;
    } catch { break; }
  }
  return chain;
}

async function getDnsSummary(hostname) {
  const out = { a: [], aaaa: [], ns: [], mx: [], txt: [] };
  try { out.a = await dns.resolve4(hostname); } catch { }
  try { out.aaaa = await dns.resolve6(hostname); } catch { }
  try { out.ns = await dns.resolveNs(hostname); } catch { }
  try { out.mx = (await dns.resolveMx(hostname)).map((r) => `${r.exchange} (${r.priority})`); } catch { }
  try { const txt = await dns.resolveTxt(hostname); out.txt = txt.map((entry) => entry.join("")); } catch { }
  return out;
}

function getSslInfo(hostname) {
  return new Promise((resolve) => {
    try {
      const socket = tls.connect(443, hostname, { servername: hostname, rejectUnauthorized: false }, () => {
        try {
          const cert = socket.getPeerCertificate();
          resolve({ issuer: cert?.issuer?.O || cert?.issuer?.CN || "Unknown", subject: cert?.subject?.CN || cert?.subject?.O || "Unknown", valid_from: cert?.valid_from || "Unknown", valid_to: cert?.valid_to || "Unknown", authorized: !!socket.authorized });
        } catch { resolve({ issuer: "Unknown", subject: "Unknown", valid_from: "Unknown", valid_to: "Unknown", authorized: false }); }
        socket.end();
      });
      socket.on("error", () => resolve({ issuer: "Unavailable", subject: "Unavailable", valid_from: "Unavailable", valid_to: "Unavailable", authorized: false }));
    } catch { resolve({ issuer: "Unavailable", subject: "Unavailable", valid_from: "Unavailable", valid_to: "Unavailable", authorized: false }); }
  });
}

// ================== SUBDOMAIN DISCOVERY (crt.sh) ==================
async function discoverSubdomains(domain) {
  if (!flags.subdomains) return [];
  console.log(chalk.yellow("[•] Discovering subdomains via crt.sh..."));
  const url = `https://crt.sh/?q=%.${domain}&output=json`;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Invalid response");
      const data = await res.json();
      const names = new Set();
      for (const entry of data) {
        const name = entry.name_value;
        if (name) {
          const parts = name.split("\n");
          for (const part of parts) {
            const clean = part.trim().toLowerCase();
            if (clean.endsWith(domain) && !clean.startsWith("*.")) names.add(clean);
          }
        }
      }
      const validated = [];
      for (const sub of names) {
        try { await dns.resolve4(sub); validated.push(sub); } catch { }
      }
      console.log(chalk.green(`[+] Found ${validated.length} valid subdomains`));
      return validated;
    } catch (err) {
      if (attempt < 3) {
        await new Promise(r => setTimeout(r, 2000));
      } else {
        console.log(chalk.red("[-] Failed to fetch subdomains from crt.sh"));
        return [];
      }
    }
  }
}

// ================== HISTORICAL SCANNING ==================
async function fetchHistoricalUrls(domain) {
  if (!flags.historical) return [];
  console.log(chalk.yellow("[•] Fetching historical URLs from Wayback Machine..."));
  const url = `https://web.archive.org/cdx/search/cdx?url=*.${domain}/*&output=json&fl=timestamp,original&limit=5000&collapse=urlkey`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!data || data.length < 2) return [];
    const urls = new Set();
    for (let i = 1; i < data.length; i++) {
      const original = data[i][1];
      if (original && isAllowedUrl(original, domain)) urls.add(normalizeUrl(original));
    }
    console.log(chalk.green(`[+] Retrieved ${urls.size} historical URLs`));
    return [...urls];
  } catch (err) {
    console.log(chalk.red("[-] Failed to fetch historical data"));
    return [];
  }
}

async function getLatestArchiveTimestamp(url) {
  const cdxUrl = `https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(url)}&output=json&fl=timestamp&limit=1`;
  try {
    const res = await fetch(cdxUrl);
    const data = await res.json();
    if (data && data.length >= 2) {
      return data[1][0];
    }
  } catch { }
  return null;
}

async function fetchArchivedContent(url) {
  const timestamp = await getLatestArchiveTimestamp(url);
  if (!timestamp) return null;
  const archiveUrl = `https://web.archive.org/web/${timestamp}/${url}`;
  return await safeFetchMeta(archiveUrl, { timeoutMs: 8000, maxBytes: 2000000 });
}

// ================== ADVANCED JAVASCRIPT EXTRACTION ==================
function extractJsEndpoints(jsContent, baseUrl) {
  const endpoints = new Set();
  const patterns = [
    /fetch\s*\(\s*['"`]([^'"`]+)['"`]/g,
    /axios\s*\.\s*(?:get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/g,
    /\.(?:get|post|put|delete)\s*\(\s*['"`]([^'"`]+)['"`]/g,
    /XMLHttpRequest\s*\(\s*\)\s*\.\s*open\s*\(\s*['"`][^'"`]+['"`]\s*,\s*['"`]([^'"`]+)['"`]/g,
    /new\s+WebSocket\s*\(\s*['"`]([^'"`]+)['"`]/g,
    /url\s*:\s*['"`]([^'"`]+)['"`]/g,
    /api\s*:\s*['"`]([^'"`]+)['"`]/g,
    /endpoint\s*:\s*['"`]([^'"`]+)['"`]/g,
    /href\s*=\s*['"`]([^'"`]+)['"`]/g,
    /src\s*=\s*['"`]([^'"`]+)['"`]/g,
    /action\s*=\s*['"`]([^'"`]+)['"`]/g,
  ];
  for (const pattern of patterns) {
    let match;
    const re = new RegExp(pattern);
    while ((match = re.exec(jsContent)) !== null) {
      let endpoint = match[1];
      try {
        const abs = new URL(endpoint, baseUrl).href;
        if (isAllowedUrl(abs, scopeHost)) endpoints.add(normalizeUrl(abs));
      } catch { }
    }
  }
  const base64Matches = jsContent.match(/\b(?:[A-Za-z0-9+/]{40,}={0,2})\b/g) || [];
  for (const b64 of base64Matches) {
    try {
      const decoded = Buffer.from(b64, "base64").toString("utf8");
      const urlMatches = decoded.match(/https?:\/\/[^\s"'`<>]+/g) || [];
      for (const u of urlMatches) {
        try {
          const abs = new URL(u, baseUrl).href;
          if (isAllowedUrl(abs, scopeHost)) endpoints.add(normalizeUrl(abs));
        } catch { }
      }
    } catch { }
  }
  return [...endpoints];
}

// ================== ENVIRONMENT VARIABLE DETECTION ==================
function detectInlineEnv(text, source) {
  const findings = [];
  const windowEnvRe = /window\.(?:ENV|env|environment)\s*=\s*({[\s\S]*?});/gi;
  let match;
  while ((match = windowEnvRe.exec(text)) !== null) {
    try {
      const obj = JSON.parse(match[1]);
      if (typeof obj === 'object' && obj !== null) {
        for (const [k, v] of Object.entries(obj)) {
          if (typeof v === 'string' && v.length > 0) {
            findings.push({ key: k, value: v, source });
          }
        }
      }
    } catch {
      const keyValueRe = /['"]?([a-zA-Z_][a-zA-Z0-9_]*)['"]?\s*:\s*(['"])([^'"]*)\2/g;
      let kvMatch;
      const objStr = match[1];
      while ((kvMatch = keyValueRe.exec(objStr)) !== null) {
        const key = kvMatch[1];
        const value = kvMatch[3];
        if (key && value && value.length > 0) {
          findings.push({ key, value, source });
        }
      }
    }
  }
  const processEnvRe = /process\.env\.([A-Z_][A-Z0-9_]*)\s*=\s*['"`]([^'"`]+)['"`]/gi;
  while ((match = processEnvRe.exec(text)) !== null) {
    findings.push({ key: match[1], value: match[2], source });
  }
  const nextDataRe = /__NEXT_DATA__\s*=\s*({[\s\S]*?});/;
  const nextMatch = nextDataRe.exec(text);
  if (nextMatch) {
    try {
      const data = JSON.parse(nextMatch[1]);
      if (data.props && data.props.pageProps) {
        const walk = (obj, path = '') => {
          if (typeof obj === 'string' && obj.match(/^(sk-|ghp_|AIza|AKIA)/i)) {
            findings.push({ key: path, value: obj, source });
          } else if (typeof obj === 'object' && obj !== null) {
            for (const [k, v] of Object.entries(obj)) walk(v, path ? `${path}.${k}` : k);
          }
        };
        walk(data);
      }
    } catch { }
  }
  return findings;
}

// ================== CORS, GRAPHQL, TECH CHECKS ==================
async function checkCors(url) {
  const origin = "https://evil.com";
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { Origin: origin, "User-Agent": getUserAgent() },
      redirect: "follow",
    });
    const acao = res.headers.get("access-control-allow-origin");
    if (acao === "*" || acao === origin) {
      return { vulnerable: true, acao };
    }
  } catch { }
  return { vulnerable: false };
}

async function checkGraphQLIntrospection(url) {
  const query = `{"query":"{__schema{types{name}}}"}`;
  try {
    const res = await fetch(url, {
      method: "POST", // GraphQL standard
      headers: { "Content-Type": "application/json", "User-Agent": getUserAgent() },
      body: query,
    });
    const data = await res.json();
    if (data && data.data && data.data.__schema) {
      return { exposed: true };
    }
  } catch { }
  return { exposed: false };
}

async function checkSupabaseRest(baseUrl) {
  const url = new URL("/rest/v1/", baseUrl).href;
  try {
    const res = await fetch(url, { headers: { "User-Agent": getUserAgent() } });
    if (res.status === 200) {
      // Typically returns OpenAPI spec or table list if anon read is permitted
      const data = await res.json();
      if (data && data.info || data.openapi || Array.isArray(data)) {
        return { exposed: true };
      }
    }
  } catch { }
  return { exposed: false };
}

async function checkAuthRoutes(endpoints) {
  // Test a known admin/internal endpoint with and without token to verify protection
  const results = [];
  const sensitivePaths = endpoints.filter(e => e.type === "ADMIN" || e.type === "INTERNAL_API").slice(0, 3);

  for (const ep of sensitivePaths) {
    try {
      // Test without auth
      const noAuthRes = await fetch(ep.url, { headers: { "User-Agent": getUserAgent() } });
      const requiresAuth = noAuthRes.status === 401 || noAuthRes.status === 403;
      results.push({ url: ep.url, protected: requiresAuth, status: noAuthRes.status });
    } catch { }
  }
  return results;
}

async function checkWordPressUserEnumeration(baseUrl) {
  const url = new URL("/wp-json/wp/v2/users", baseUrl).href;
  try {
    const res = await fetch(url, { headers: { "User-Agent": getUserAgent() } });
    if (res.status === 200) {
      const users = await res.json();
      if (Array.isArray(users) && users.length > 0) {
        return { exposed: true, count: users.length };
      }
    }
  } catch { }
  return { exposed: false };
}

async function checkNextJsEnvLeak(baseUrl) {
  const chunksUrl = new URL("/_next/static/chunks/", baseUrl).href;
  try {
    const res = await fetch(chunksUrl, { headers: { "User-Agent": getUserAgent() } });
    if (res.status === 200) {
      const html = await res.text();
      const jsLinks = html.match(/href="([^"]+\.js)"/g) || [];
      for (const link of jsLinks) {
        const jsUrl = new URL(link.slice(6, -1), chunksUrl).href;
        const jsRes = await fetch(jsUrl, { headers: { "User-Agent": getUserAgent() } });
        if (jsRes.status === 200) {
          const js = await jsRes.text();
          if (js.includes("process.env") || js.includes("NEXT_PUBLIC_")) {
            return { exposed: true, url: jsUrl };
          }
        }
      }
    }
  } catch { }
  return { exposed: false };
}

// --- FINGERPRINT DATABASE (150+ technologies) ---
const FINGERPRINTS = [
  // ═══════════════ FRONTEND FRAMEWORKS ═══════════════
  {
    name: "React", category: "Frontend", patterns: {
      js: [{ v: "__REACT_DEVTOOLS_GLOBAL_HOOK__", c: 90 }, { v: "ReactDOM", c: 85 }, { v: "react-dom", c: 80 }, { v: "createElement", c: 40 }, { v: "jsx-runtime", c: 85 }, { v: "react.production.min", c: 90 }, { v: "__SECRET_INTERNALS_DO_NOT_USE", c: 95 }],
      html: [{ v: "data-reactroot", c: 90 }, { v: "_reactRootContainer", c: 90 }, { v: "data-reactid", c: 85 }]
    }
  },
  {
    name: "Vue.js", category: "Frontend", patterns: {
      js: [{ v: "Vue.createApp", c: 90 }, { v: "__VUE__", c: 95 }, { v: "createApp", c: 50 }, { v: "vue.runtime", c: 85 }, { v: "vue.global.prod", c: 90 }, { v: "__vue_app__", c: 90 }],
      html: [{ v: "data-v-", c: 80 }, { v: "v-cloak", c: 85 }, { v: "v-if=", c: 70 }, { v: "id=\"app\"", c: 30 }]
    }
  },
  {
    name: "Angular", category: "Frontend", patterns: {
      js: [{ v: "@angular/core", c: 95 }, { v: "platform-browser", c: 80 }, { v: "angular.module", c: 85 }, { v: "zone.js", c: 75 }, { v: "ng-probe-token", c: 90 }],
      html: [{ v: "ng-version", c: 95 }, { v: "ng-app", c: 85 }, { v: "_nghost-", c: 90 }, { v: "_ngcontent-", c: 85 }, { v: "ng-reflect-", c: 90 }]
    }
  },
  {
    name: "Next.js", category: "Frontend", patterns: {
      js: [{ v: "_next/router", c: 90 }, { v: "next/link", c: 85 }, { v: "next/head", c: 85 }, { v: "__NEXT_LOADED_PAGES__", c: 95 }, { v: "next/dist", c: 90 }],
      html: [{ v: "__NEXT_DATA__", c: 95 }, { v: "/_next/static", c: 90 }],
      headers: [{ v: "x-nextjs-cache", c: 95 }, { v: "x-nextjs-matched-path", c: 95 }],
      paths: [{ v: "/_next/", c: 85 }, { v: "/_next/static/chunks", c: 90 }]
    }
  },
  {
    name: "Nuxt.js", category: "Frontend", patterns: {
      js: [{ v: "__NUXT__", c: 95 }, { v: "nuxt/dist", c: 90 }, { v: "$nuxt", c: 85 }, { v: "nuxt.config", c: 80 }],
      html: [{ v: "__NUXT__", c: 95 }, { v: "/_nuxt/", c: 90 }, { v: "data-n-head", c: 85 }],
      paths: [{ v: "/_nuxt/", c: 90 }]
    }
  },
  {
    name: "Svelte", category: "Frontend", patterns: {
      js: [{ v: "svelte/internal", c: 95 }, { v: "$$invalidate", c: 85 }, { v: "svelte-", c: 70 }, { v: "create_fragment", c: 60 }],
      html: [{ v: "svelte-", c: 75 }, { v: "__svelte", c: 90 }]
    }
  },
  {
    name: "SvelteKit", category: "Frontend", patterns: {
      js: [{ v: "__sveltekit", c: 95 }, { v: "svelte-kit", c: 90 }],
      html: [{ v: "data-sveltekit", c: 95 }],
      paths: [{ v: "/_app/", c: 75 }]
    }
  },
  {
    name: "SolidJS", category: "Frontend", patterns: {
      js: [{ v: "solid-js", c: 95 }, { v: "createSignal", c: 50 }, { v: "createEffect", c: 50 }, { v: "solid-js/web", c: 95 }]
    }
  },
  {
    name: "Alpine.js", category: "Frontend", patterns: {
      js: [{ v: "Alpine.start", c: 90 }, { v: "alpine.js", c: 80 }],
      html: [{ v: "x-data=", c: 85 }, { v: "x-bind:", c: 80 }, { v: "x-on:", c: 80 }, { v: "@click.prevent", c: 70 }]
    }
  },
  {
    name: "Remix", category: "Frontend", patterns: {
      js: [{ v: "@remix-run", c: 95 }, { v: "remix-run/react", c: 95 }],
      html: [{ v: "__remixContext", c: 95 }, { v: "window.__remixManifest", c: 95 }]
    }
  },
  {
    name: "Astro", category: "Frontend", patterns: {
      html: [{ v: "astro-island", c: 95 }, { v: "astro-slot", c: 90 }, { v: "client:load", c: 80 }, { v: "is:inline", c: 70 }]
    }
  },
  {
    name: "Gatsby", category: "Frontend", patterns: {
      js: [{ v: "gatsby-browser", c: 90 }, { v: "gatsby-link", c: 85 }],
      html: [{ v: "___gatsby", c: 95 }, { v: "gatsby-image", c: 85 }, { v: "gatsby-focus-wrapper", c: 90 }],
      paths: [{ v: "/page-data/", c: 85 }]
    }
  },
  {
    name: "Preact", category: "Frontend", patterns: {
      js: [{ v: "preact", c: 75 }, { v: "preact/hooks", c: 90 }, { v: "preact/compat", c: 90 }],
      html: [{ v: "__preact_", c: 90 }]
    }
  },
  {
    name: "Ember.js", category: "Frontend", patterns: {
      js: [{ v: "Ember.Application", c: 90 }, { v: "@ember", c: 85 }],
      html: [{ v: "ember-application", c: 90 }, { v: "data-ember-action", c: 90 }]
    }
  },
  {
    name: "Backbone.js", category: "Frontend", patterns: {
      js: [{ v: "Backbone.Model", c: 90 }, { v: "Backbone.View", c: 90 }, { v: "Backbone.Router", c: 90 }]
    }
  },
  {
    name: "Lit", category: "Frontend", patterns: {
      js: [{ v: "lit-element", c: 90 }, { v: "lit-html", c: 90 }, { v: "@lit/", c: 85 }]
    }
  },
  {
    name: "Qwik", category: "Frontend", patterns: {
      js: [{ v: "qwik", c: 75 }, { v: "@builder.io/qwik", c: 95 }],
      html: [{ v: "q:container", c: 95 }, { v: "qwik/json", c: 90 }]
    }
  },
  // ═══════════════ ROUTING ═══════════════
  {
    name: "React Router", category: "Routing", patterns: {
      js: [{ v: "react-router", c: 90 }, { v: "react-router-dom", c: 95 }, { v: "BrowserRouter", c: 80 }, { v: "createBrowserRouter", c: 85 }]
    }
  },
  {
    name: "Vue Router", category: "Routing", patterns: {
      js: [{ v: "vue-router", c: 95 }, { v: "createRouter", c: 50 }, { v: "createWebHistory", c: 80 }]
    }
  },
  // ═══════════════ BUILD TOOLS ═══════════════
  {
    name: "Vite", category: "Build Tool", patterns: {
      js: [{ v: "vite/modulepreload", c: 90 }, { v: "/@vite/", c: 95 }, { v: "import.meta.glob", c: 80 }, { v: "vite/client", c: 95 }, { v: "__vite_ssr", c: 95 }],
      html: [{ v: "/@vite/client", c: 95 }, { v: "type=\"module\" crossorigin", c: 60 }],
      paths: [{ v: "/@vite/", c: 95 }]
    }
  },
  {
    name: "Webpack", category: "Build Tool", patterns: {
      js: [{ v: "webpackJsonp", c: 90 }, { v: "__webpack_require__", c: 95 }, { v: "webpackChunk", c: 90 }, { v: "webpack/runtime", c: 85 }, { v: "__webpack_modules__", c: 95 }]
    }
  },
  {
    name: "Parcel", category: "Build Tool", patterns: {
      js: [{ v: "parcelRequire", c: 95 }, { v: "parcel-bundler", c: 90 }]
    }
  },
  {
    name: "Rollup", category: "Build Tool", patterns: {
      js: [{ v: "rollupPluginBabelHelpers", c: 85 }, { v: "Rollup", c: 50 }]
    }
  },
  {
    name: "esbuild", category: "Build Tool", patterns: {
      js: [{ v: "esbuild", c: 70 }],
      headers: [{ v: "x-esbuild", c: 90 }]
    }
  },
  {
    name: "Turbopack", category: "Build Tool", patterns: {
      js: [{ v: "turbopack", c: 90 }, { v: "__turbopack__", c: 95 }]
    }
  },
  // ═══════════════ ANALYTICS ═══════════════
  {
    name: "Google Analytics GA4", category: "Analytics", patterns: {
      js: [{ v: "gtag(", c: 80 }, { v: "G-", c: 50 }, { v: "google-analytics.com/g/collect", c: 95 }],
      html: [{ v: "googletagmanager.com/gtag", c: 95 }, { v: "gtag('config'", c: 90 }],
      network: [{ v: "google-analytics.com", c: 90 }, { v: "analytics.google.com", c: 90 }]
    }
  },
  {
    name: "Google Tag Manager", category: "Analytics", patterns: {
      js: [{ v: "googletagmanager.com/gtm", c: 95 }, { v: "GTM-", c: 75 }],
      html: [{ v: "googletagmanager.com/gtm.js", c: 95 }, { v: "Google Tag Manager", c: 90 }, { v: "GTM-", c: 70 }],
      network: [{ v: "googletagmanager.com", c: 95 }]
    }
  },
  {
    name: "Hotjar", category: "Analytics", patterns: {
      js: [{ v: "_hjSettings", c: 95 }, { v: "hotjar.com", c: 90 }, { v: "hj.q", c: 85 }],
      html: [{ v: "static.hotjar.com", c: 95 }],
      network: [{ v: "hotjar.com", c: 95 }]
    }
  },
  {
    name: "Mixpanel", category: "Analytics", patterns: {
      js: [{ v: "mixpanel.init", c: 95 }, { v: "mixpanel.track", c: 90 }, { v: "cdn.mxpnl.com", c: 90 }],
      network: [{ v: "api.mixpanel.com", c: 95 }, { v: "cdn.mxpnl.com", c: 95 }]
    }
  },
  {
    name: "Segment", category: "Analytics", patterns: {
      js: [{ v: "analytics.identify", c: 80 }, { v: "analytics.track", c: 70 }, { v: "cdn.segment.com", c: 95 }, { v: "analytics.page", c: 70 }],
      html: [{ v: "cdn.segment.com/analytics.js", c: 95 }],
      network: [{ v: "cdn.segment.com", c: 95 }, { v: "api.segment.io", c: 95 }]
    }
  },
  {
    name: "Amplitude", category: "Analytics", patterns: {
      js: [{ v: "amplitude.getInstance", c: 95 }, { v: "cdn.amplitude.com", c: 90 }],
      network: [{ v: "amplitude.com", c: 90 }]
    }
  },
  {
    name: "Plausible", category: "Analytics", patterns: {
      html: [{ v: "plausible.io/js", c: 95 }],
      network: [{ v: "plausible.io", c: 95 }]
    }
  },
  {
    name: "PostHog", category: "Analytics", patterns: {
      js: [{ v: "posthog.init", c: 95 }, { v: "posthog-js", c: 90 }],
      network: [{ v: "app.posthog.com", c: 95 }, { v: "us.posthog.com", c: 95 }]
    }
  },
  {
    name: "Heap", category: "Analytics", patterns: {
      js: [{ v: "heap.track", c: 90 }, { v: "heapanalytics.com", c: 95 }],
      network: [{ v: "heapanalytics.com", c: 95 }]
    }
  },
  {
    name: "FullStory", category: "Analytics", patterns: {
      js: [{ v: "fullstory.com/s/fs.js", c: 95 }, { v: "_fs_host", c: 90 }],
      network: [{ v: "fullstory.com", c: 95 }]
    }
  },
  {
    name: "Microsoft Clarity", category: "Analytics", patterns: {
      js: [{ v: "clarity.ms", c: 95 }, { v: "clarity(", c: 70 }],
      html: [{ v: "clarity.ms/tag", c: 95 }],
      network: [{ v: "clarity.ms", c: 95 }]
    }
  },
  {
    name: "Facebook Pixel", category: "Analytics", patterns: {
      js: [{ v: "fbq(", c: 80 }, { v: "facebook.com/tr", c: 90 }, { v: "fbevents.js", c: 95 }],
      html: [{ v: "connect.facebook.net/en_US/fbevents.js", c: 95 }],
      network: [{ v: "connect.facebook.net", c: 85 }]
    }
  },
  // ═══════════════ HOSTING / CDN ═══════════════
  {
    name: "Vercel", category: "Hosting", patterns: {
      headers: [{ v: "x-vercel-id", c: 95 }, { v: "x-vercel-cache", c: 95 }],
      cookies: [{ v: "__vercel", c: 90 }]
    }
  },
  {
    name: "Netlify", category: "Hosting", patterns: {
      headers: [{ v: "x-nf-request-id", c: 95 }, { v: "netlify", c: 90 }],
      cookies: [{ v: "nf_", c: 80 }]
    }
  },
  {
    name: "Cloudflare", category: "CDN", patterns: {
      headers: [{ v: "cf-ray", c: 95 }, { v: "cf-cache-status", c: 90 }, { v: "cloudflare", c: 90 }],
      cookies: [{ v: "__cf_bm", c: 90 }, { v: "__cfduid", c: 85 }, { v: "cf_clearance", c: 90 }]
    }
  },
  {
    name: "Cloudflare Pages", category: "Hosting", patterns: {
      headers: [{ v: "cf-ray", c: 60 }],
      paths: [{ v: "/cdn-cgi/", c: 80 }]
    }
  },
  {
    name: "AWS CloudFront", category: "CDN", patterns: {
      headers: [{ v: "x-amz-cf-id", c: 95 }, { v: "x-amz-cf-pop", c: 95 }, { v: "x-cache", c: 50 }]
    }
  },
  {
    name: "Fastly", category: "CDN", patterns: {
      headers: [{ v: "x-served-by", c: 60 }, { v: "fastly", c: 90 }, { v: "x-fastly-request-id", c: 95 }]
    }
  },
  {
    name: "Akamai", category: "CDN", patterns: {
      headers: [{ v: "x-akamai-transformed", c: 95 }, { v: "akamai", c: 85 }]
    }
  },
  {
    name: "GitHub Pages", category: "Hosting", patterns: {
      headers: [{ v: "x-github-request-id", c: 95 }],
      paths: [{ v: "github.io", c: 85 }]
    }
  },
  {
    name: "Firebase Hosting", category: "Hosting", patterns: {
      headers: [{ v: "x-firebase-hosting", c: 95 }],
      paths: [{ v: "firebaseapp.com", c: 85 }, { v: "web.app", c: 60 }]
    }
  },
  {
    name: "Render", category: "Hosting", patterns: {
      headers: [{ v: "x-render-origin-server", c: 95 }]
    }
  },
  {
    name: "Railway", category: "Hosting", patterns: {
      headers: [{ v: "x-railway-", c: 95 }]
    }
  },
  {
    name: "Fly.io", category: "Hosting", patterns: {
      headers: [{ v: "fly-request-id", c: 95 }]
    }
  },
  // ═══════════════ WEB SERVERS ═══════════════
  {
    name: "nginx", category: "Web Server", patterns: {
      headers: [{ v: "nginx", c: 90 }]
    }
  },
  {
    name: "Apache", category: "Web Server", patterns: {
      headers: [{ v: "apache", c: 90 }]
    }
  },
  {
    name: "Caddy", category: "Web Server", patterns: {
      headers: [{ v: "caddy", c: 90 }]
    }
  },
  {
    name: "IIS", category: "Web Server", patterns: {
      headers: [{ v: "iis", c: 90 }, { v: "asp.net", c: 85 }]
    }
  },
  // ═══════════════ BACKEND / CMS ═══════════════
  {
    name: "WordPress", category: "CMS", patterns: {
      html: [{ v: "wp-content", c: 90 }, { v: "wp-includes", c: 90 }, { v: "wp-json", c: 85 }, { v: "wordpress", c: 70 }],
      paths: [{ v: "/wp-json/", c: 95 }, { v: "/wp-admin/", c: 95 }, { v: "/wp-content/", c: 90 }, { v: "/wp-login.php", c: 95 }],
      headers: [{ v: "x-wp-", c: 90 }],
      cookies: [{ v: "wordpress_", c: 90 }, { v: "wp-settings", c: 85 }]
    }
  },
  {
    name: "Ghost", category: "CMS", patterns: {
      html: [{ v: "ghost-url", c: 90 }, { v: "content=\"Ghost", c: 90 }],
      headers: [{ v: "x-ghost-", c: 95 }],
      paths: [{ v: "/ghost/api/", c: 95 }]
    }
  },
  {
    name: "Drupal", category: "CMS", patterns: {
      html: [{ v: "Drupal.settings", c: 95 }, { v: "drupal.js", c: 90 }],
      headers: [{ v: "x-drupal-", c: 95 }, { v: "x-generator: Drupal", c: 95 }],
      paths: [{ v: "/sites/default/files", c: 85 }]
    }
  },
  {
    name: "Shopify", category: "E-commerce", patterns: {
      html: [{ v: "shopify-section", c: 90 }, { v: "cdn.shopify.com", c: 95 }, { v: "Shopify.theme", c: 95 }],
      headers: [{ v: "x-shopify-stage", c: 95 }, { v: "x-shopid", c: 95 }],
      cookies: [{ v: "_shopify", c: 90 }],
      network: [{ v: "cdn.shopify.com", c: 95 }]
    }
  },
  {
    name: "Squarespace", category: "CMS", patterns: {
      html: [{ v: "squarespace.com", c: 85 }, { v: "static.squarespace.com", c: 95 }],
      network: [{ v: "static.squarespace.com", c: 95 }]
    }
  },
  {
    name: "Wix", category: "CMS", patterns: {
      html: [{ v: "wix.com", c: 70 }, { v: "X-Wix-", c: 90 }],
      headers: [{ v: "x-wix-", c: 95 }],
      network: [{ v: "static.wixstatic.com", c: 95 }, { v: "parastorage.com", c: 90 }]
    }
  },
  {
    name: "Express", category: "Backend", patterns: {
      headers: [{ v: "x-powered-by: express", c: 95 }],
      cookies: [{ v: "connect.sid", c: 85 }]
    }
  },
  {
    name: "PHP", category: "Backend", patterns: {
      headers: [{ v: "x-powered-by: php", c: 95 }],
      cookies: [{ v: "PHPSESSID", c: 90 }]
    }
  },
  {
    name: "ASP.NET", category: "Backend", patterns: {
      headers: [{ v: "x-powered-by: asp.net", c: 95 }, { v: "x-aspnet-version", c: 95 }],
      cookies: [{ v: ".AspNetCore.", c: 90 }, { v: "ASP.NET_SessionId", c: 95 }]
    }
  },
  {
    name: "Django", category: "Backend", patterns: {
      cookies: [{ v: "csrftoken", c: 75 }, { v: "django", c: 80 }],
      headers: [{ v: "x-frame-options: SAMEORIGIN", c: 30 }],
      html: [{ v: "csrfmiddlewaretoken", c: 90 }]
    }
  },
  {
    name: "Ruby on Rails", category: "Backend", patterns: {
      cookies: [{ v: "_session_id", c: 50 }],
      headers: [{ v: "x-request-id", c: 30 }, { v: "x-runtime", c: 80 }],
      html: [{ v: "csrf-token", c: 50 }, { v: "data-turbo", c: 80 }]
    }
  },
  {
    name: "Laravel", category: "Backend", patterns: {
      cookies: [{ v: "laravel_session", c: 95 }, { v: "XSRF-TOKEN", c: 60 }],
      html: [{ v: "laravel", c: 60 }]
    }
  },
  // ═══════════════ BACKEND SERVICES ═══════════════
  {
    name: "Firebase", category: "Backend Service", patterns: {
      js: [{ v: "firebase/app", c: 90 }, { v: "firebaseConfig", c: 85 }, { v: "__FIREBASE_DEFAULTS__", c: 95 }, { v: "initializeApp", c: 50 }, { v: "firebaseio.com", c: 90 }],
      html: [{ v: "firebase", c: 50 }],
      network: [{ v: "firebaseio.com", c: 95 }, { v: "firebaseapp.com", c: 85 }, { v: "googleapis.com/identitytoolkit", c: 95 }]
    }
  },
  {
    name: "Supabase", category: "Backend Service", patterns: {
      js: [{ v: "supabase.co", c: 95 }, { v: "@supabase/supabase-js", c: 95 }, { v: "createClient", c: 40 }, { v: "supabase.auth", c: 90 }],
      network: [{ v: "supabase.co", c: 95 }]
    }
  },
  {
    name: "Appwrite", category: "Backend Service", patterns: {
      js: [{ v: "appwrite", c: 75 }, { v: "appwrite.io", c: 90 }],
      network: [{ v: "appwrite.io", c: 95 }, { v: "cloud.appwrite.io", c: 95 }]
    }
  },
  {
    name: "Sanity", category: "Backend Service", patterns: {
      js: [{ v: "sanity.io", c: 85 }, { v: "@sanity/client", c: 95 }],
      network: [{ v: "cdn.sanity.io", c: 95 }, { v: "api.sanity.io", c: 95 }]
    }
  },
  {
    name: "Contentful", category: "Backend Service", patterns: {
      js: [{ v: "contentful", c: 70 }],
      network: [{ v: "cdn.contentful.com", c: 95 }, { v: "images.ctfassets.net", c: 90 }]
    }
  },
  {
    name: "Prismic", category: "Backend Service", patterns: {
      js: [{ v: "prismic.io", c: 85 }, { v: "@prismicio", c: 95 }],
      network: [{ v: "prismic.io", c: 95 }]
    }
  },
  // ═══════════════ AUTH ═══════════════
  {
    name: "Auth0", category: "Auth", patterns: {
      js: [{ v: "auth0-js", c: 95 }, { v: "@auth0/auth0-react", c: 95 }, { v: "auth0.com", c: 85 }],
      network: [{ v: ".auth0.com", c: 95 }]
    }
  },
  {
    name: "Clerk", category: "Auth", patterns: {
      js: [{ v: "@clerk/clerk-js", c: 95 }, { v: "clerk.dev", c: 85 }, { v: "clerk.com", c: 85 }, { v: "ClerkProvider", c: 90 }, { v: "__clerk", c: 90 }],
      html: [{ v: "clerk.com", c: 75 }],
      cookies: [{ v: "__clerk", c: 90 }, { v: "__client_uat", c: 85 }],
      network: [{ v: "clerk.com", c: 90 }, { v: "clerk.dev", c: 90 }]
    }
  },
  {
    name: "Firebase Auth", category: "Auth", patterns: {
      js: [{ v: "firebase/auth", c: 95 }, { v: "signInWithPopup", c: 70 }, { v: "signInWithEmailAndPassword", c: 85 }, { v: "GoogleAuthProvider", c: 75 }]
    }
  },
  {
    name: "Supabase Auth", category: "Auth", patterns: {
      js: [{ v: "supabase.auth.signIn", c: 95 }, { v: "supabase.auth.signUp", c: 95 }, { v: "supabase.auth.onAuthStateChange", c: 90 }, { v: "gotrue", c: 80 }]
    }
  },
  {
    name: "NextAuth.js", category: "Auth", patterns: {
      js: [{ v: "next-auth", c: 95 }, { v: "NextAuth", c: 85 }],
      paths: [{ v: "/api/auth/", c: 80 }, { v: "/api/auth/signin", c: 90 }],
      cookies: [{ v: "next-auth.session-token", c: 95 }, { v: "__Secure-next-auth", c: 95 }]
    }
  },
  {
    name: "Okta", category: "Auth", patterns: {
      js: [{ v: "@okta/okta-auth-js", c: 95 }, { v: "okta.com", c: 80 }],
      network: [{ v: ".okta.com", c: 95 }]
    }
  },
  {
    name: "Keycloak", category: "Auth", patterns: {
      js: [{ v: "keycloak.js", c: 90 }, { v: "keycloak-js", c: 95 }],
      paths: [{ v: "/auth/realms/", c: 90 }]
    }
  },
  // ═══════════════ UI LIBRARIES ═══════════════
  {
    name: "Tailwind CSS", category: "UI", patterns: {
      html: [{ v: "tailwindcss", c: 85 }],
      js: [{ v: "tailwindcss", c: 85 }, { v: "tailwind.config", c: 90 }]
    }
  },
  {
    name: "Bootstrap", category: "UI", patterns: {
      html: [{ v: "bootstrap.min.css", c: 90 }, { v: "bootstrap.bundle", c: 85 }, { v: "class=\"btn btn-", c: 75 }],
      js: [{ v: "bootstrap.min.js", c: 90 }, { v: "bootstrap.bundle.min.js", c: 90 }]
    }
  },
  {
    name: "Material UI", category: "UI", patterns: {
      js: [{ v: "@mui/material", c: 95 }, { v: "MuiButton", c: 85 }, { v: "makeStyles", c: 50 }, { v: "Mui", c: 40 }],
      html: [{ v: "MuiButton", c: 85 }, { v: "MuiPaper", c: 80 }, { v: "css-", c: 30 }]
    }
  },
  {
    name: "Chakra UI", category: "UI", patterns: {
      js: [{ v: "@chakra-ui", c: 95 }, { v: "chakra-ui", c: 90 }],
      html: [{ v: "chakra-", c: 80 }]
    }
  },
  {
    name: "Radix UI", category: "UI", patterns: {
      js: [{ v: "@radix-ui", c: 95 }],
      html: [{ v: "radix-", c: 75 }, { v: "data-radix", c: 90 }]
    }
  },
  {
    name: "shadcn/ui", category: "UI", patterns: {
      html: [{ v: "data-slot=", c: 60 }],
      js: [{ v: "shadcn", c: 80 }]
    }
  },
  {
    name: "Ant Design", category: "UI", patterns: {
      js: [{ v: "antd", c: 85 }],
      html: [{ v: "ant-btn", c: 90 }, { v: "ant-layout", c: 85 }, { v: "ant-", c: 70 }]
    }
  },
  {
    name: "Mantine", category: "UI", patterns: {
      js: [{ v: "@mantine", c: 95 }],
      html: [{ v: "mantine-", c: 85 }]
    }
  },
  {
    name: "Bulma", category: "UI", patterns: {
      html: [{ v: "bulma.min.css", c: 95 }, { v: "bulma.css", c: 90 }, { v: "class=\"hero is-", c: 80 }]
    }
  },
  {
    name: "Foundation", category: "UI", patterns: {
      html: [{ v: "foundation.min.css", c: 95 }],
      js: [{ v: "foundation.min.js", c: 95 }]
    }
  },
  {
    name: "jQuery", category: "Library", patterns: {
      js: [{ v: "jQuery", c: 80 }, { v: "jquery.min.js", c: 90 }, { v: "$.ajax", c: 70 }],
      html: [{ v: "jquery.min.js", c: 90 }, { v: "jquery-", c: 80 }]
    }
  },
  // ═══════════════ PAYMENT ═══════════════
  {
    name: "Stripe", category: "Payment", patterns: {
      js: [{ v: "Stripe(", c: 85 }, { v: "stripe.com", c: 80 }, { v: "elements()", c: 60 }, { v: "pk_live_", c: 90 }, { v: "pk_test_", c: 85 }],
      html: [{ v: "js.stripe.com", c: 95 }],
      network: [{ v: "js.stripe.com", c: 95 }, { v: "api.stripe.com", c: 95 }]
    }
  },
  {
    name: "PayPal", category: "Payment", patterns: {
      js: [{ v: "paypal.Buttons", c: 90 }, { v: "paypal-sdk", c: 85 }],
      html: [{ v: "paypal.com/sdk/js", c: 95 }],
      network: [{ v: "paypal.com", c: 90 }]
    }
  },
  {
    name: "Razorpay", category: "Payment", patterns: {
      js: [{ v: "Razorpay", c: 90 }, { v: "checkout.razorpay.com", c: 95 }],
      html: [{ v: "checkout.razorpay.com", c: 95 }],
      network: [{ v: "razorpay.com", c: 95 }]
    }
  },
  {
    name: "Square", category: "Payment", patterns: {
      js: [{ v: "squareup.com", c: 85 }, { v: "square.js", c: 80 }],
      network: [{ v: "squareup.com", c: 90 }]
    }
  },
  // ═══════════════ CHAT / SUPPORT ═══════════════
  {
    name: "Intercom", category: "Support", patterns: {
      js: [{ v: "Intercom(", c: 90 }, { v: "intercomSettings", c: 95 }, { v: "widget.intercom.io", c: 95 }],
      html: [{ v: "widget.intercom.io", c: 95 }],
      network: [{ v: "intercom.io", c: 95 }]
    }
  },
  {
    name: "Crisp", category: "Support", patterns: {
      js: [{ v: "$crisp", c: 95 }, { v: "crisp.chat", c: 90 }],
      html: [{ v: "client.crisp.chat", c: 95 }],
      network: [{ v: "crisp.chat", c: 95 }]
    }
  },
  {
    name: "Zendesk", category: "Support", patterns: {
      js: [{ v: "zE(", c: 75 }, { v: "zendeskWidget", c: 90 }, { v: "static.zdassets.com", c: 95 }],
      html: [{ v: "static.zdassets.com", c: 95 }],
      network: [{ v: "zdassets.com", c: 95 }, { v: "zendesk.com", c: 85 }]
    }
  },
  {
    name: "Drift", category: "Support", patterns: {
      js: [{ v: "drift.com", c: 90 }, { v: "driftt.com", c: 90 }],
      html: [{ v: "js.driftt.com", c: 95 }],
      network: [{ v: "driftt.com", c: 95 }]
    }
  },
  {
    name: "Tawk.to", category: "Support", patterns: {
      js: [{ v: "tawk.to", c: 90 }, { v: "Tawk_API", c: 95 }],
      html: [{ v: "embed.tawk.to", c: 95 }],
      network: [{ v: "tawk.to", c: 95 }]
    }
  },
  {
    name: "HubSpot", category: "CRM", patterns: {
      js: [{ v: "hs-scripts.com", c: 90 }, { v: "HubSpot", c: 80 }, { v: "hbspt.forms.create", c: 95 }],
      html: [{ v: "js.hs-scripts.com", c: 95 }, { v: "js.hsforms.net", c: 90 }],
      network: [{ v: "hs-scripts.com", c: 95 }, { v: "hubspot.com", c: 85 }],
      cookies: [{ v: "__hstc", c: 90 }, { v: "hubspotutk", c: 90 }]
    }
  },
  // ═══════════════ ICON LIBRARIES ═══════════════
  {
    name: "Lucide", category: "Icons", patterns: {
      js: [{ v: "lucide-react", c: 95 }, { v: "lucide", c: 70 }]
    }
  },
  {
    name: "Font Awesome", category: "Icons", patterns: {
      html: [{ v: "font-awesome", c: 90 }, { v: "fontawesome", c: 85 }, { v: "fa-solid", c: 80 }, { v: "fa fa-", c: 80 }],
      js: [{ v: "fontawesome", c: 85 }],
      network: [{ v: "fontawesome.com", c: 90 }, { v: "use.fontawesome.com", c: 95 }]
    }
  },
  {
    name: "Heroicons", category: "Icons", patterns: {
      js: [{ v: "@heroicons/react", c: 95 }, { v: "heroicons", c: 75 }]
    }
  },
  {
    name: "Material Icons", category: "Icons", patterns: {
      html: [{ v: "material-icons", c: 90 }, { v: "fonts.googleapis.com/icon", c: 90 }]
    }
  },
  // ═══════════════ STATE MANAGEMENT ═══════════════
  {
    name: "Redux", category: "State", patterns: {
      js: [{ v: "redux", c: 70 }, { v: "createStore", c: 50 }, { v: "__REDUX_DEVTOOLS_EXTENSION__", c: 95 }, { v: "@reduxjs/toolkit", c: 95 }]
    }
  },
  {
    name: "Zustand", category: "State", patterns: {
      js: [{ v: "zustand", c: 85 }, { v: "create()(", c: 50 }]
    }
  },
  {
    name: "MobX", category: "State", patterns: {
      js: [{ v: "mobx", c: 75 }, { v: "makeObservable", c: 80 }, { v: "makeAutoObservable", c: 85 }]
    }
  },
  {
    name: "Recoil", category: "State", patterns: {
      js: [{ v: "recoil", c: 75 }, { v: "RecoilRoot", c: 95 }, { v: "atom(", c: 40 }]
    }
  },
  {
    name: "TanStack Query", category: "Data Fetching", patterns: {
      js: [{ v: "@tanstack/react-query", c: 95 }, { v: "QueryClient", c: 70 }, { v: "react-query", c: 85 }]
    }
  },
  // ═══════════════ GRAPHQL ═══════════════
  {
    name: "Apollo GraphQL", category: "GraphQL", patterns: {
      js: [{ v: "ApolloClient", c: 90 }, { v: "InMemoryCache", c: 75 }, { v: "@apollo/client", c: 95 }, { v: "__APOLLO_STATE__", c: 95 }],
      html: [{ v: "__APOLLO_STATE__", c: 95 }],
      paths: [{ v: "/graphql", c: 75 }]
    }
  },
  {
    name: "GraphQL", category: "API", patterns: {
      paths: [{ v: "/graphql", c: 80 }, { v: "/gql", c: 70 }],
      js: [{ v: "graphql", c: 50 }, { v: "gql`", c: 80 }]
    }
  },
  // ═══════════════ HTTP CLIENT ═══════════════
  {
    name: "Axios", category: "HTTP", patterns: {
      js: [{ v: "axios.create", c: 90 }, { v: "axios.interceptors", c: 90 }, { v: "axios.get", c: 75 }, { v: "axios.post", c: 75 }]
    }
  },
  // ═══════════════ ANIMATION ═══════════════
  {
    name: "Framer Motion", category: "Animation", patterns: {
      js: [{ v: "framer-motion", c: 95 }, { v: "motion.div", c: 80 }, { v: "AnimatePresence", c: 85 }]
    }
  },
  {
    name: "GSAP", category: "Animation", patterns: {
      js: [{ v: "gsap", c: 80 }, { v: "TweenMax", c: 85 }, { v: "ScrollTrigger", c: 75 }]
    }
  },
  {
    name: "Lottie", category: "Animation", patterns: {
      js: [{ v: "lottie-web", c: 90 }, { v: "lottie-player", c: 90 }, { v: "bodymovin", c: 85 }]
    }
  },
  // ═══════════════ MONITORING / ERROR ═══════════════
  {
    name: "Sentry", category: "Monitoring", patterns: {
      js: [{ v: "Sentry.init", c: 95 }, { v: "@sentry/browser", c: 95 }, { v: "sentry-cdn", c: 90 }],
      network: [{ v: "sentry.io", c: 95 }]
    }
  },
  {
    name: "Datadog", category: "Monitoring", patterns: {
      js: [{ v: "datadoghq.com", c: 90 }, { v: "DD_RUM", c: 95 }],
      network: [{ v: "datadoghq.com", c: 95 }]
    }
  },
  {
    name: "LogRocket", category: "Monitoring", patterns: {
      js: [{ v: "LogRocket.init", c: 95 }, { v: "logrocket", c: 80 }],
      network: [{ v: "logrocket.com", c: 95 }]
    }
  },
  {
    name: "New Relic", category: "Monitoring", patterns: {
      js: [{ v: "NREUM", c: 95 }, { v: "newrelic", c: 75 }],
      network: [{ v: "nr-data.net", c: 95 }, { v: "bam.nr-data.net", c: 95 }]
    }
  },
  // ═══════════════ FONTS ═══════════════
  {
    name: "Google Fonts", category: "Fonts", patterns: {
      html: [{ v: "fonts.googleapis.com", c: 90 }, { v: "fonts.gstatic.com", c: 85 }],
      network: [{ v: "fonts.googleapis.com", c: 90 }, { v: "fonts.gstatic.com", c: 85 }]
    }
  },
  {
    name: "Adobe Fonts", category: "Fonts", patterns: {
      html: [{ v: "use.typekit.net", c: 95 }],
      network: [{ v: "use.typekit.net", c: 95 }]
    }
  },
  // ═══════════════ MISC ═══════════════
  {
    name: "PWA", category: "Progressive Web App", patterns: {
      html: [{ v: "manifest.json", c: 70 }, { v: "service-worker", c: 75 }],
      js: [{ v: "serviceWorker.register", c: 85 }, { v: "workbox", c: 80 }],
      paths: [{ v: "/manifest.json", c: 65 }, { v: "/sw.js", c: 75 }]
    }
  },
  {
    name: "OpenAPI", category: "API Docs", patterns: {
      paths: [{ v: "/swagger", c: 80 }, { v: "/openapi", c: 80 }, { v: "/swagger.json", c: 90 }]
    }
  },
  {
    name: "Socket.io", category: "Realtime", patterns: {
      js: [{ v: "socket.io", c: 90 }, { v: "io.connect", c: 70 }],
      paths: [{ v: "/socket.io/", c: 90 }]
    }
  },
  {
    name: "reCAPTCHA", category: "Security", patterns: {
      html: [{ v: "google.com/recaptcha", c: 95 }, { v: "g-recaptcha", c: 90 }],
      js: [{ v: "grecaptcha", c: 90 }],
      network: [{ v: "google.com/recaptcha", c: 95 }]
    }
  },
  {
    name: "hCaptcha", category: "Security", patterns: {
      html: [{ v: "hcaptcha.com", c: 95 }, { v: "h-captcha", c: 90 }],
      network: [{ v: "hcaptcha.com", c: 95 }]
    }
  },
  {
    name: "Cloudflare Turnstile", category: "Security", patterns: {
      html: [{ v: "challenges.cloudflare.com/turnstile", c: 95 }, { v: "cf-turnstile", c: 90 }],
      network: [{ v: "challenges.cloudflare.com", c: 90 }]
    }
  },
  {
    name: "TypeScript", category: "Language", patterns: {
      js: [{ v: "__decorate", c: 60 }, { v: "tslib", c: 80 }, { v: "__esDecorate", c: 75 }]
    }
  },
  {
    name: "Three.js", category: "3D", patterns: {
      js: [{ v: "THREE.Scene", c: 95 }, { v: "THREE.WebGLRenderer", c: 95 }, { v: "three.module", c: 90 }]
    }
  },
  {
    name: "D3.js", category: "Visualization", patterns: {
      js: [{ v: "d3.select", c: 90 }, { v: "d3.scale", c: 85 }, { v: "d3-selection", c: 90 }]
    }
  },
  {
    name: "Chart.js", category: "Visualization", patterns: {
      js: [{ v: "Chart.register", c: 90 }, { v: "chart.js", c: 80 }]
    }
  },
  {
    name: "Mapbox", category: "Maps", patterns: {
      js: [{ v: "mapboxgl", c: 90 }, { v: "mapbox-gl", c: 90 }],
      network: [{ v: "api.mapbox.com", c: 95 }]
    }
  },
  {
    name: "Leaflet", category: "Maps", patterns: {
      js: [{ v: "L.map", c: 80 }, { v: "leaflet", c: 75 }],
      html: [{ v: "leaflet.css", c: 90 }]
    }
  },
  {
    name: "Cloudinary", category: "Media", patterns: {
      network: [{ v: "res.cloudinary.com", c: 95 }],
      html: [{ v: "res.cloudinary.com", c: 90 }]
    }
  },
  {
    name: "Imgix", category: "Media", patterns: {
      network: [{ v: ".imgix.net", c: 90 }],
      html: [{ v: ".imgix.net", c: 85 }]
    }
  },
  { name: "Let's Encrypt", category: "SSL", tls: true },
  {
    name: "REST API", category: "API", patterns: {
      paths: [{ v: "/api/", c: 55 }, { v: "/api/v1", c: 65 }, { v: "/api/v2", c: 65 }]
    }
  },
  // ═══════════════ ADVANCED EXTENSIONS (APPENDED) ═══════════════

  // ═══ A/B TESTING & EXPERIMENTATION ═══
  {
    name: "Optimizely", category: "Experimentation", patterns: {
      js: [{ v: "optimizely", c: 90 }],
      network: [{ v: "optimizely.com", c: 95 }]
    }
  },
  {
    name: "VWO", category: "Experimentation", patterns: {
      js: [{ v: "_vwo_code", c: 95 }],
      network: [{ v: "visualwebsiteoptimizer.com", c: 95 }]
    }
  },

  // ═══ CONSENT / COOKIE MANAGEMENT ═══
  {
    name: "OneTrust", category: "Consent", patterns: {
      js: [{ v: "OneTrust", c: 95 }],
      network: [{ v: "onetrust.com", c: 95 }]
    }
  },
  {
    name: "Cookiebot", category: "Consent", patterns: {
      js: [{ v: "Cookiebot", c: 95 }],
      network: [{ v: "consent.cookiebot.com", c: 95 }]
    }
  },

  // ═══ DEV / DEBUG TOOLS LEAKED IN PROD ═══
  {
    name: "Redux DevTools", category: "DevTool", patterns: {
      js: [{ v: "__REDUX_DEVTOOLS_EXTENSION__", c: 95 }]
    }
  },
  {
    name: "React DevTools", category: "DevTool", patterns: {
      js: [{ v: "__REACT_DEVTOOLS_GLOBAL_HOOK__", c: 95 }]
    }
  },

  // ═══ ADDITIONAL BACKEND FRAMEWORKS ═══
  {
    name: "FastAPI", category: "Backend", patterns: {
      headers: [{ v: "uvicorn", c: 90 }],
      paths: [{ v: "/docs", c: 70 }]
    }
  },
  {
    name: "Flask", category: "Backend", patterns: {
      headers: [{ v: "Werkzeug", c: 95 }],
      cookies: [{ v: "session=", c: 60 }]
    }
  },
  {
    name: "Spring Boot", category: "Backend", patterns: {
      headers: [{ v: "Spring", c: 85 }],
      paths: [{ v: "/actuator", c: 80 }]
    }
  },

  // ═══ ADDITIONAL AUTH SYSTEMS ═══
  {
    name: "Firebase Identity Toolkit", category: "Auth", patterns: {
      network: [{ v: "identitytoolkit.googleapis.com", c: 95 }]
    }
  },
  {
    name: "Magic.link", category: "Auth", patterns: {
      js: [{ v: "magic-sdk", c: 95 }],
      network: [{ v: "magic.link", c: 95 }]
    }
  },

  // ═══ ADDITIONAL CDNs / EDGE ═══
  {
    name: "BunnyCDN", category: "CDN", patterns: {
      headers: [{ v: "bunnycdn", c: 95 }]
    }
  },
  {
    name: "jsDelivr", category: "CDN", patterns: {
      network: [{ v: "cdn.jsdelivr.net", c: 95 }]
    }
  },
  {
    name: "UNPKG", category: "CDN", patterns: {
      network: [{ v: "unpkg.com", c: 95 }]
    }
  },

  // ═══ DATABASE / BACKEND SDKS ═══
  {
    name: "MongoDB Atlas", category: "Database", patterns: {
      network: [{ v: "mongodb.net", c: 95 }]
    }
  },
  {
    name: "PlanetScale", category: "Database", patterns: {
      network: [{ v: "psdb.cloud", c: 95 }]
    }
  },

  // ═══ PERFORMANCE / MONITORING ═══
  {
    name: "Google Optimize", category: "Experimentation", patterns: {
      network: [{ v: "optimize.google.com", c: 95 }]
    }
  },
  {
    name: "SpeedCurve", category: "Monitoring", patterns: {
      network: [{ v: "speedcurve.com", c: 95 }]
    }
  },

  // ═══ MARKETING / CRM ADDITIONS ═══
  {
    name: "Mailchimp", category: "Marketing", patterns: {
      network: [{ v: "list-manage.com", c: 95 }]
    }
  },
  {
    name: "ActiveCampaign", category: "Marketing", patterns: {
      network: [{ v: "activecampaign.com", c: 95 }]
    }
  },

  // ═══ ADDITIONAL UI / COMPONENT SYSTEMS ═══
  {
    name: "PrimeReact", category: "UI", patterns: {
      js: [{ v: "primereact", c: 95 }]
    }
  },
  {
    name: "Semantic UI", category: "UI", patterns: {
      html: [{ v: "semantic-ui", c: 90 }]
    }
  },

  // ═══ ADDITIONAL CHART / VISUALIZATION ═══
  {
    name: "ECharts", category: "Visualization", patterns: {
      js: [{ v: "echarts", c: 95 }]
    }
  },
  {
    name: "Highcharts", category: "Visualization", patterns: {
      js: [{ v: "Highcharts", c: 95 }]
    }
  },

  // ═══ ADDITIONAL REALTIME / SOCKET ═══
  {
    name: "SockJS", category: "Realtime", patterns: {
      js: [{ v: "sockjs", c: 95 }]
    }
  },
  {
    name: "Pusher", category: "Realtime", patterns: {
      js: [{ v: "Pusher", c: 95 }],
      network: [{ v: "pusher.com", c: 95 }]
    }
  },

  // ═══ ADDITIONAL SECURITY / BOT PROTECTION ═══
  {
    name: "Arkose Labs", category: "Security", patterns: {
      network: [{ v: "arkoselabs.com", c: 95 }]
    }
  },
  {
    name: "PerimeterX", category: "Security", patterns: {
      network: [{ v: "perimeterx.net", c: 95 }]
    }
  },

  // ═══ ADDITIONAL MEDIA / VIDEO ═══
  {
    name: "Vimeo", category: "Media", patterns: {
      network: [{ v: "vimeo.com", c: 95 }]
    }
  },
  {
    name: "YouTube Embed", category: "Media", patterns: {
      html: [{ v: "youtube.com/embed", c: 95 }]
    }
  }
];

// Build strong signals set from high-confidence patterns
const STRONG_SIGNALS = new Set();
for (const fp of FINGERPRINTS) {
  if (!fp.patterns) continue;
  for (const layer of Object.values(fp.patterns)) {
    for (const p of layer) {
      if (p.c >= 90) STRONG_SIGNALS.add(p.v);
    }
  }
}

// --- NETWORK DOMAIN → TECHNOLOGY MAP ---
const NETWORK_FINGERPRINTS = new Map();
for (const fp of FINGERPRINTS) {
  if (fp.patterns && fp.patterns.network) {
    for (const p of fp.patterns.network) {
      NETWORK_FINGERPRINTS.set(p.v, { name: fp.name, category: fp.category, confidence: p.c });
    }
  }
}

// ═══════════════ MULTI-LAYER DETECTION ENGINE ═══════════════
function detectTechAdvanced(headers, body, url, discoveredPaths = [], cookies = [], sslInfo = null, dnsInfo = null) {
  const results = new Map();

  function addTech(name, category, confidence, evidence, source = "generic") {
    if (!results.has(name)) {
      results.set(name, { name, category, confidence, evidence: new Set(), sources: new Set() });
    }
    const tech = results.get(name);
    tech.confidence = Math.min(100, Math.max(tech.confidence, confidence));
    tech.evidence.add(evidence);
    tech.sources.add(source);
  }

  // Normalize inputs
  const headersLower = {};
  for (const [k, val] of Object.entries(headers)) headersLower[k.toLowerCase()] = String(val).toLowerCase();
  const headerValues = Object.values(headersLower).join(" ");
  const bodyStr = String(body || "");
  const lowerBody = bodyStr.toLowerCase();
  const isHtml = bodyStr.trim().startsWith("<") || /<!DOCTYPE/i.test(bodyStr);
  const isJs = /\.(js|mjs|cjs)$/i.test(url) || (headers["content-type"] && headers["content-type"].includes("javascript"));
  const urlLower = (url || "").toLowerCase();

  // Collect cookie strings
  const setCookie = headers["set-cookie"] ? (Array.isArray(headers["set-cookie"]) ? headers["set-cookie"] : [headers["set-cookie"]]) : [];
  const allCookieStr = [...setCookie, ...cookies].join(" ").toLowerCase();

  // Collect all paths for path matching
  const allPaths = [urlLower, ...(discoveredPaths || []).map(p => p.toLowerCase())];

  // === LAYER 1: FINGERPRINT DATABASE SCAN ===
  for (const fp of FINGERPRINTS) {
    if (!fp.patterns) continue;

    // HTML patterns (only on HTML content)
    if (fp.patterns.html && isHtml) {
      for (const p of fp.patterns.html) {
        if (bodyStr.includes(p.v) || lowerBody.includes(p.v.toLowerCase())) {
          addTech(fp.name, fp.category, p.c, `html: ${p.v}`, "html");
        }
      }
    }

    // JS patterns (on JS content OR any body that looks like JS)
    if (fp.patterns.js && (isJs || bodyStr.includes("function") || bodyStr.includes("import ") || bodyStr.includes("require("))) {
      for (const p of fp.patterns.js) {
        if (bodyStr.includes(p.v)) {
          addTech(fp.name, fp.category, p.c, `js: ${p.v}`, "js");
        }
      }
    }

    // Also scan HTML body for JS patterns (inline scripts, embedded bundles)
    if (fp.patterns.js && isHtml) {
      for (const p of fp.patterns.js) {
        if (bodyStr.includes(p.v)) {
          addTech(fp.name, fp.category, Math.min(p.c, p.c - 5), `inline: ${p.v}`, "html");
        }
      }
    }

    // Header patterns
    if (fp.patterns.headers) {
      for (const p of fp.patterns.headers) {
        const pLower = p.v.toLowerCase();
        // Check both header keys and header values
        if (headersLower[pLower] !== undefined || headerValues.includes(pLower)) {
          addTech(fp.name, fp.category, p.c, `header: ${p.v}`, "header");
        }
      }
    }

    // Cookie patterns
    if (fp.patterns.cookies) {
      for (const p of fp.patterns.cookies) {
        if (allCookieStr.includes(p.v.toLowerCase())) {
          addTech(fp.name, fp.category, p.c, `cookie: ${p.v}`, "cookie");
        }
      }
    }

    // Path / network patterns
    if (fp.patterns.paths) {
      for (const p of fp.patterns.paths) {
        const pLower = p.v.toLowerCase();
        if (allPaths.some(path => path.includes(pLower))) {
          addTech(fp.name, fp.category, p.c, `path: ${p.v}`, "path");
        }
      }
    }

    // Network patterns (matched against URL itself)
    if (fp.patterns.network) {
      for (const p of fp.patterns.network) {
        if (urlLower.includes(p.v.toLowerCase())) {
          addTech(fp.name, fp.category, p.c, `network: ${p.v}`, "network");
        }
      }
    }
  }

  // === LAYER 2: TLS / CERTIFICATE ===
  if (sslInfo && sslInfo.issuer) {
    if (sslInfo.issuer.includes("Cloudflare")) addTech("Cloudflare", "CDN", 85, "Cloudflare certificate issuer", "tls");
    if (sslInfo.issuer.includes("Amazon")) addTech("AWS", "Cloud", 75, "Amazon certificate issuer", "tls");
    if (sslInfo.issuer.includes("Let's Encrypt")) addTech("Let's Encrypt", "SSL", 70, "Let's Encrypt certificate", "tls");
  }

  // === LAYER 3: DNS IP RANGE ===
  if (dnsInfo && dnsInfo.a && dnsInfo.a.length) {
    const ip = dnsInfo.a[0];
    if (ip.startsWith("104.16.") || ip.startsWith("104.17.") || ip.startsWith("104.18.") || ip.startsWith("104.19.") || ip.startsWith("104.20.") || ip.startsWith("104.21.") || ip.startsWith("104.22.") || ip.startsWith("104.23.") || ip.startsWith("104.24.") || ip.startsWith("104.25.") || ip.startsWith("104.26.") || ip.startsWith("104.27.") || ip.startsWith("104.28.")) addTech("Cloudflare", "CDN", 80, "IP range matches Cloudflare", "dns");
    if (ip.startsWith("76.76.21.") || ip.startsWith("76.223.")) addTech("Vercel", "Hosting", 80, "IP range matches Vercel", "dns");
  }

  // === CONFLICT RESOLUTION ===
  const conflicts = [["WordPress", "Shopify"], ["Next.js", "Nuxt.js"], ["Next.js", "SvelteKit"], ["Angular", "React"]];
  for (const [a, b] of conflicts) {
    if (results.has(a) && results.has(b)) {
      const ca = results.get(a).confidence + results.get(a).evidence.size * 5;
      const cb = results.get(b).confidence + results.get(b).evidence.size * 5;
      if (ca > cb) results.delete(b);
      else if (cb > ca) results.delete(a);
    }
  }

  // === CONFIDENCE BOOST RULE ===
  // If 2+ distinct specific signals exist (js, header, network, cookie, tls, dns), it's confirmed
  for (const [name, tech] of results.entries()) {
    const uniqueSources = new Set([...tech.sources].filter(s => s !== "generic"));
    if (uniqueSources.size >= 2) {
      tech.confidence = 100;
    }
  }

  return results;
}

// Network request fingerprinting (used with Puppeteer-captured requests)
function matchNetworkRequest(requestUrl) {
  const urlLower = requestUrl.toLowerCase();
  const matched = [];
  for (const [domain, tech] of NETWORK_FINGERPRINTS) {
    if (urlLower.includes(domain.toLowerCase())) {
      matched.push(tech);
    }
  }
  return matched;
}

// Legacy detectTech for compatibility
function detectTech(headers, body, url, discoveredPaths = [], cookies = [], sslInfo = null, dnsInfo = null) {
  const techMap = detectTechAdvanced(headers, body, url, discoveredPaths, cookies, sslInfo, dnsInfo);
  return [...techMap.values()].map(t => t.name);
}


// ================== CLIENT EXPOSURE INTELLIGENCE ENGINE ==================
function extractClientIntelligence(blobs) {
  const intelligence = {
    auth: null,
    apis: { user: [], admin: [], internal: [] },
    services: new Set(),
    env: new Set(),
    flags: new Set(),
    endpointsByCategory: {},
  };
  const PATTERNS = {
    api: /\/api\/[a-zA-Z0-9/*-]+/g,
    env: /(NEXT_PUBLIC_[A-Z0-9_]+|REACT_APP_[A-Z0-9_]+)/g,
    firebase: /firebase|firestore|authDomain/g,
    stripe: /pk_live_|sk_live_/g,
    supabase: /supabase\.co/g,
    auth: /(Authorization|Bearer|token)/gi,
    login: /\/login|\/auth\/login|\/signin/g,
    storage: /localStorage|sessionStorage/g,
  };
  // Memory-safe: collect chunks in array, enforce size limit, join once
  const jsChunks = [];
  let totalSize = 0;
  const MAX_JS_BYTES = 50 * 1024 * 1024; // 50MB hard limit
  for (const blob of blobs) {
    if (blob.kind === "js" || blob.kind === "inline-script" || blob.kind === "source-content") {
      if (!blob.text || blob.text.length === 0) continue; // skip empty blobs
      const blobSize = Buffer.byteLength(blob.text, "utf8");
      if (totalSize + blobSize > MAX_JS_BYTES) {
        console.log(chalk.yellow(`[⚠] JS intelligence extraction truncated at ${Math.round(totalSize / (1024 * 1024))}MB (${jsChunks.length} chunks) — limit: ${MAX_JS_BYTES / (1024 * 1024)}MB`));
        break;
      }
      jsChunks.push(blob.text);
      totalSize += blobSize;
    }
  }
  const allJs = jsChunks.join("\n");
  const apiMatches = allJs.match(PATTERNS.api) || [];
  const uniqueApis = [...new Set(apiMatches)];
  intelligence.apis.user = uniqueApis.filter(u => u.includes("/user") || u.includes("/profile")).map(normalizeEndpoint);
  intelligence.apis.admin = uniqueApis.filter(u => u.includes("/admin") || u.includes("/dashboard")).map(normalizeEndpoint);
  intelligence.apis.internal = uniqueApis.filter(u => u.includes("/internal") || u.includes("/private")).map(normalizeEndpoint);
  const envMatches = allJs.match(PATTERNS.env) || [];
  intelligence.env = new Set(envMatches);
  if (PATTERNS.firebase.test(allJs)) intelligence.services.add("Firebase");
  if (PATTERNS.stripe.test(allJs)) intelligence.services.add("Stripe");
  if (PATTERNS.supabase.test(allJs)) intelligence.services.add("Supabase");
  const loginEndpoints = uniqueApis.filter(u => /(?:\/login|\/auth\/login|\/signin)/i.test(u)).map(normalizeEndpoint);
  const hasStorage = PATTERNS.storage.test(allJs);
  const hasAuthHeader = PATTERNS.auth.test(allJs);
  if (loginEndpoints.length > 0 || hasAuthHeader) {
    intelligence.auth = {
      login: loginEndpoints.length > 0 ? loginEndpoints.join(", ") : null,
      storage: hasStorage ? "localStorage/sessionStorage" : null,
      header: hasAuthHeader ? "Authorization / Bearer" : null,
    };
  }
  const flagPatterns = /(isAdmin|isLoggedIn|debug|internal|flag_)/gi;
  const flagMatches = allJs.match(flagPatterns) || [];
  intelligence.flags = new Set(flagMatches);
  return intelligence;
}

// ================== SECRET RULES ==================
const SECRET_RULES = [
  { kind: "private_key_block", label: "Private Key Block", severity: 6, confidence: "high", regex: /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]{40,}?-----END [A-Z ]*PRIVATE KEY-----/g },
  { kind: "aws_access_key_id", label: "AWS Access Key ID", severity: 5, confidence: "high", regex: /\bAKIA[0-9A-Z]{16}\b/g },
  { kind: "aws_session_token", label: "AWS Session Token", severity: 5, confidence: "high", regex: /\b(?:x-amz-security-token|aws[_-]?session[_-]?token)\b\s*[:=]\s*['"`]?([A-Za-z0-9\/+=._-]{16,})['"`]?/gi, captureGroup: 1 },
  { kind: "google_api_key", label: "Google API Key", severity: 5, confidence: "high", regex: /\bAIza[0-9A-Za-z\-_]{35}\b/g },
  { kind: "github_token", label: "GitHub Token", severity: 5, confidence: "high", regex: /\bgh[pousr]_[A-Za-z0-9_]{20,255}\b/g },
  { kind: "slack_token", label: "Slack Token", severity: 5, confidence: "high", regex: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g },
  { kind: "stripe_secret", label: "Stripe Secret Key", severity: 5, confidence: "high", regex: /\bsk_(?:live|test)_[A-Za-z0-9]{16,}\b/g },
  { kind: "stripe_restricted", label: "Stripe Restricted Key", severity: 5, confidence: "high", regex: /\brk_(?:live|test)_[A-Za-z0-9]{16,}\b/g },
  { kind: "openai_key", label: "OpenAI API Key", severity: 5, confidence: "high", regex: /\b(sk-(?:proj-)?[A-Za-z0-9_-]{20,})\b/g, captureGroup: 1 },
  { kind: "discord_token", label: "Discord Token", severity: 5, confidence: "high", regex: /\b[MN][A-Za-z\d]{23}\.[A-Za-z\d_-]{6}\.[A-Za-z\d_-]{27}\b/g },
  { kind: "twilio_sid", label: "Twilio Account SID", severity: 4, confidence: "medium", regex: /\bAC[0-9a-fA-F]{32}\b/g },
  { kind: "jwt", label: "JWT", severity: 3, confidence: "medium", regex: /\beyJ[a-zA-Z0-9_-]{8,}\.[a-zA-Z0-9._-]{8,}\.[a-zA-Z0-9._-]{8,}\b/g },
  { kind: "basic_auth_url", label: "Credentialed URL", severity: 5, confidence: "high", regex: /\b[a-z][a-z0-9+.-]*:\/\/[^/\s:@]+:[^@\s]+@[^/\s]+/gi },
  { kind: "db_uri", label: "Credentialed DB URI", severity: 5, confidence: "high", regex: /\b(?:mongodb(?:\+srv)?|postgres(?:ql)?|mysql|redis):\/\/[^/\s]+:[^@\s]+@[^/\s]+/gi },
  { kind: "basic_auth_header", label: "Basic Auth Header", severity: 5, confidence: "medium", regex: /\bauthorization\b\s*:\s*basic\s+([A-Za-z0-9+/=]{8,})/gi, captureGroup: 1 },
  { kind: "context_secret", label: "Contextual Secret", severity: 4, confidence: "medium", regex: /\b(?:api[_-]?key|apikey|client[_-]?secret|clientSecret|access[_-]?token|accessToken|refresh[_-]?token|refreshToken|secret|token|password|passwd|private[_-]?key|x-api-key|x-api-token|authorization)\b\s*[:=]\s*['"`]?([A-Za-z0-9\/+=._:-]{8,256})['"`]?/gi, captureGroup: 1 },
  { kind: "aws_context_secret", label: "AWS Secret Key", severity: 5, confidence: "high", regex: /\baws[_-]?secret[_-]?access[_-]?key\b\s*[:=]\s*['"`]?([A-Za-z0-9\/+=._-]{16,})['"`]?/gi, captureGroup: 1 },
  { kind: "api_token_context", label: "API Token", severity: 4, confidence: "medium", regex: /\b(?:api[_-]?token|access[_-]?token|refresh[_-]?token|bearer|token)\b\s*[:=]\s*['"`]?([A-Za-z0-9\/+=._-]{12,256})['"`]?/gi, captureGroup: 1 },
  { kind: "webhook_url", label: "Webhook URL", severity: 4, confidence: "medium", regex: /https:\/\/hooks\.slack\.com\/services\/T[A-Z0-9]{8,}\/B[A-Z0-9]{8,}\/[A-Za-z0-9]{20,}/g },
  { kind: "firebase_credential", label: "Firebase Credential", severity: 4, confidence: "medium", regex: /(?:apiKey|authDomain|databaseURL|projectId|storageBucket|messagingSenderId|appId)\s*[:=]\s*['"`]([^'"`]{10,})['"`]/gi, captureGroup: 1 },
  { kind: "sendgrid_key", label: "SendGrid API Key", severity: 5, confidence: "high", regex: /\bSG\.[A-Za-z0-9_-]{22,}\.[A-Za-z0-9_-]{22,}\b/g },
  { kind: "anthropic_key", label: "Anthropic API Key", severity: 5, confidence: "high", regex: /\b(sk-ant-(?:api[0-9]+-)?[A-Za-z0-9_-]{24,})\b/g, captureGroup: 1 },
  { kind: "mailgun_key", label: "Mailgun API Key", severity: 5, confidence: "high", regex: /\b(key-[a-f0-9]{32})\b/g, captureGroup: 1 },
  { kind: "huggingface_token", label: "HuggingFace Token", severity: 4, confidence: "medium", regex: /\b(hf_[A-Za-z0-9]{20,})\b/g, captureGroup: 1 },
  { kind: "linear_api_key", label: "Linear API Key", severity: 4, confidence: "medium", regex: /\b(lin_api_[a-f0-9]{32})\b/g, captureGroup: 1 },
  { kind: "supabase_service_role", label: "Supabase Service Role Key", severity: 5, confidence: "high", regex: /\beyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9_-]{100,}\.(?:[A-Za-z0-9_-]{43,})\b/g },
];

const JS_NOISE = new Set([
  "render", "displayName", "ForwardRef", "createElement", "useState", "useEffect", "useContext",
  "useReducer", "useCallback", "useMemo", "useRef", "useImperativeHandle", "useLayoutEffect",
  "useDebugValue", "componentDidMount", "componentDidUpdate", "componentWillUnmount",
  "getDerivedStateFromProps", "getSnapshotBeforeUpdate", "shouldComponentUpdate", "constructor",
  "componentDidCatch", "renderToString", "renderToStaticMarkup", "createRoot", "hydrateRoot",
  "findDOMNode", "unmountComponentAtNode", "createPortal", "flushSync", "createRef", "forwardRef",
  "memo", "lazy", "Suspense", "Fragment", "StrictMode", "Profiler", "cloneElement", "isValidElement",
  "Children", "createContext", "useTransition", "useDeferredValue", "useId", "useSyncExternalStore",
  "useInsertionEffect", "c.replace", "t.displayName", "Error.prepareStackTrace", "function", "t.render",
  "e.displayName", "e=t._payload", "t=t._init", "e.render", "ForwardRef", "t._init", "t._payload",
]);

function isLikelyNoise(value) {
  const v = String(value).trim();
  if (v.length < 6) return true;
  if (JS_NOISE.has(v)) return true;

  // Layer 1: Known charset alphabet strings
  if (/^[A-Za-z0-9+\/_-]{50,}$/.test(v) && /ABCDEF/.test(v) && /abcdef/.test(v) && /0123/.test(v)) return true;

  // Layer 2: Sequential alphabet detection (ABCabc012)
  const hasSequentialAlpha = /abcdefgh|ABCDEFGH|01234567|zyxwvut|ZYXWVUT/.test(v);
  if (hasSequentialAlpha && v.length > 20) return true;

  // Layer 3: Human-readable text / natural language
  if (v.includes(" ") && v.split(" ").length > 2) return true;
  if (v.includes("${") || v.includes("{{") || v.startsWith("<")) return true;

  // Layer 4: Code artifact detection — object.property, Object.method, process.env
  if (v.includes("this.") || v.includes("window.") || v.includes("document.") || v.includes("process.env.") || v.includes("Object.")) return true;
  if (/\b(?:default|prototype|constructor|length|map|filter|push|splice|concat|toString|valueOf|apply|call|bind)\b/.test(v) && v.includes(".")) return true;

  // Layer 5: dot-separated identifiers (Class.method, module.exports)
  if (/^[a-zA-Z_$][a-zA-Z0-9_$]*\.[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(v)) return true;
  // Colon-separated minified references (PostgrestTransformBuilder:Fk.default)
  if (/^[a-zA-Z0-9_]+:[a-zA-Z0-9_.]+$/.test(v)) return true;
  // PascalCase:identifier.member pattern (minified JS class mappings)
  if (/^[A-Z][a-zA-Z]+:[A-Z][a-z]/.test(v) && v.includes(".")) return true;

  // Layer 6: camelCase single words (not prefixed with known credential patterns)
  if (v.includes("unstable_") || v.includes("kr.") || /^kr\.[a-zA-Z]+$/.test(v)) return true;
  if (/^[a-z][a-zA-Z0-9]*$/.test(v) && v.length < 30 && !/^(sk-|ghp_|xoxb|AIza|AKIA)/.test(v)) return true;
  // PascalCase words (component names like ForwardRef, TransformBuilder)
  if (/^[A-Z][a-z]+(?:[A-Z][a-z]+)*$/.test(v) && v.length < 30) return true;
  // CSS classes
  if (/^(?:col(?:-md|-lg|-sm|-xs)?-\d+|p-\d+|m-\d+|flex|grid|hidden|block|text-[a-z]+|bg-[a-z]+)$/i.test(v)) return true;

  // Layer 7: Placeholders and documentation URLs
  const lowerV = v.toLowerCase();
  const placeholders = ["your_api_key", "your_key", "insert_key", "secret_key_here", "placeholder", "example", "dummy",
    "test_key", "sample_key", "xxx", "todo", "fixme", "changeme", "replace_me"];
  if (placeholders.some(p => lowerV.includes(p))) return true;
  if (lowerV.includes("my api key") || lowerV.includes("api key is")) return true;
  if (lowerV.startsWith("http://") || lowerV.startsWith("https://") || lowerV.startsWith("www.") || lowerV.startsWith("//")) return true;
  const docs = ["developer.mozilla.org", "help.openai.com", "docs.", "example.", "schema.org", "w3.org",
    "stackoverflow.com", "github.com/", "npmjs.com", "wikipedia.org"];
  if (docs.some(d => lowerV.includes(d))) return true;

  // Layer 8: CSS units and color values
  if (v.includes("px") || v.includes("em") || v.includes("rem") || v.includes("rgba(") || v.startsWith("#")) {
    if (v.length < 20) return true;
  }

  // Layer 9: Structural junk — long uniform strings without credential prefixes
  if (/^[a-zA-Z0-9_-]+$/.test(v) && v.length > 30 && !v.includes("=") && !/^(sk-|gh[pousr]_|xox[baprs]-|AIza|AKIA|eyJ|SG\.|hf_|lin_api_)/.test(v)) {
    // Pure lowercase/uppercase hex-like blob digests (50+ chars)
    if (/^[a-z0-9]+$/i.test(v) && v.length > 50) return true;
    // Check if it's a monotonic charset with no structural diversity
    const uniqueChars = new Set(v).size;
    if (uniqueChars > 40 && v.length < 80) return true; // likely a full charset dump
  }

  // Layer 10: Firebase config value names that are project domains, not secrets
  if (isFirebaseConfigValue(v)) return true;

  return false;
}

// Detects Firebase config values that are public project identifiers, not secrets
function isFirebaseConfigValue(v) {
  // authDomain: "project.firebaseapp.com" — this is public, not a secret
  if (/\.firebaseapp\.com$/.test(v)) return true;
  // storageBucket: "project.appspot.com"
  if (/\.appspot\.com$/.test(v)) return true;
  // projectId: short project name (all lowercase, possibly with hyphens)
  if (/^[a-z][a-z0-9-]{3,30}$/.test(v) && !v.includes("_")) return true;
  // messagingSenderId: pure digits
  if (/^\d{6,20}$/.test(v)) return true;
  // appId: "1:123456:web:abcdef" format
  if (/^\d+:\d+:web:[a-f0-9]+$/.test(v)) return true;
  return false;
}

// Detects public keys that are by-design client-side (not leaked secrets)
function isPublicKeyByDesign(value) {
  // Stripe publishable keys — these are meant to be in client-side code
  if (/^pk_(test|live)_/.test(value)) return true;
  // Clerk publishable keys
  if (/^pk_test_/.test(value) && value.length > 30) return true;
  return false;
}

function addFinding(store, finding) {
  const key = `${finding.kind}|${finding.value}`;
  const existing = store.get(key);
  if (!existing) {
    store.set(key, { ...finding, occurrences: 1, sources: new Set([finding.source]) });
  } else {
    existing.occurrences += 1;
    existing.severity = Math.max(existing.severity, finding.severity);
    if (existing.confidence !== "high" && finding.confidence === "high") existing.confidence = "high";
    existing.sources.add(finding.source);
  }
}

function isLikelySecretCandidate(token, kind) {
  const s = String(token || "").trim();
  if (s.length < 8 || s.length > 256) return false;
  if (!/^[A-Za-z0-9\/+=._:-]+$/.test(s)) return false;
  if (/\s/.test(s)) return false;
  if (/(.)\1{8,}/.test(s)) return false;
  if (isLikelyNoise(s)) return false;

  // Known credential prefixes — fast-path accept (entropy still checked for context types)
  const e = entropy(s);
  if (e < 3.2) return false; // Hard entropy floor

  // Known prefixes bypass class/structure checks
  if (/^(sk-|sk-proj-|gh[pousr]_|xox[baprs]-|AIza|AKIA|eyJ|SG\.|hf_|lin_api_)/.test(s)) return true;

  // Public keys: accept but will be demoted in scanTextForSecrets
  if (isPublicKeyByDesign(s)) return true;

  const classes = charClasses(s);
  if (kind === "context_secret" && classes >= 2 && e >= 4.2) return true;
  if (kind === "api_token_context" && classes >= 2 && e >= 4.5) return true;
  return classes >= 3 && e >= 4.8;
}

function scanBase64Candidates(text, source, store) {
  const candidates = String(text || "").match(/\b(?:[A-Za-z0-9+/]{40,}={0,2})\b/g) || [];
  let count = 0;
  for (const c of candidates) {
    if (count >= 8) break;
    if (c.length % 4 !== 0 && !/=+$/.test(c)) continue;
    let decoded = "";
    try { decoded = Buffer.from(c, "base64").toString("utf8"); } catch { continue; }
    if (!decoded || decoded.length < 20 || !isMostlyPrintable(decoded)) continue;
    const hasSignal = /api[_-]?key|secret|token|password|passwd|authorization|bearer|AKIA|AIza|ghp_|sk-|xox[baprs]-|Basic\s+/i.test(decoded);
    if (!hasSignal && entropy(decoded) < 4.0) continue;
    scanTextForSecrets(decoded, `${source}::base64`, store, { recursive: false });
    count += 1;
  }
}

function scanTextForSecrets(text, source, store, opts = {}) {
  const sample = String(text || "");
  if (!sample.trim()) return;
  const maxScan = Math.min(sample.length, opts.maxChars || 4000000);
  const content = sample.slice(0, maxScan);
  for (const rule of SECRET_RULES) {
    const re = new RegExp(rule.regex.source, rule.regex.flags.includes("g") ? rule.regex.flags : `${rule.regex.flags}g`);
    let m;
    while ((m = re.exec(content)) !== null) {
      const value = rule.captureGroup ? m[rule.captureGroup] : m[0];
      const clean = String(value || "").trim();
      if (!clean) continue;
      if (rule.kind === "context_secret" || rule.kind === "api_token_context" || rule.kind === "aws_context_secret") {
        if (!isLikelySecretCandidate(clean, rule.kind)) continue;
      }
      if (rule.kind === "jwt" && clean.length > 500) continue;
      // Section 5: Demote public keys that are client-side by design
      let kind = rule.kind, label = rule.label, severity = rule.severity, confidence = rule.confidence;
      if (isPublicKeyByDesign(clean)) {
        kind = "public_key";
        label = "Public Key (client-side, not a secret)";
        severity = 2;
        confidence = "low";
      }
      // Section 5: Skip firebase config values that are project identifiers
      if (rule.kind === "firebase_credential" && isFirebaseConfigValue(clean)) continue;
      addFinding(store, {
        kind,
        label,
        value: clean,
        source,
        severity,
        confidence,
        reason: rule.label,
      });
      if (re.lastIndex === m.index) re.lastIndex++;
    }
  }
  const lines = content.split(/\r?\n/);
  const contextRe = /\b(?:api[_-]?key|apikey|client[_-]?secret|clientSecret|access[_-]?token|accessToken|refresh[_-]?token|refreshToken|secret|token|password|passwd|private[_-]?key|authorization|bearer|x-api-key|x-api-token)\b/i;
  for (let i = 0; i < lines.length && i < 6000; i++) {
    const line = lines[i];
    if (!contextRe.test(line)) continue;
    const matches = [...line.matchAll(/(?:[:=]\s*|,\s*|>\s*|:\s*)(['"`]?)([A-Za-z0-9\/+=._:-]{8,256})\1/g)];
    for (const match of matches) {
      const value = String(match[2] || "").trim();
      if (!value) continue;
      if (!isLikelySecretCandidate(value, "context_secret")) continue;
      // Apply public key demotion to context matches too
      let ctxKind = "context_secret", ctxLabel = "Contextual Secret", ctxSeverity = 4, ctxConfidence = "medium";
      if (isPublicKeyByDesign(value)) {
        ctxKind = "public_key";
        ctxLabel = "Public Key (client-side, not a secret)";
        ctxSeverity = 2;
        ctxConfidence = "low";
      }
      addFinding(store, {
        kind: ctxKind,
        label: ctxLabel,
        value,
        source: `${source}:line${i + 1}`,
        severity: ctxSeverity,
        confidence: ctxConfidence,
        reason: "Context keyword matched",
      });
    }
    const authMatch = line.match(/\bauthorization\b\s*:\s*basic\s+([A-Za-z0-9+/=]{8,})/i);
    if (authMatch && authMatch[1]) {
      addFinding(store, {
        kind: "basic_auth_header",
        label: "Basic Auth Header",
        value: authMatch[1],
        source: `${source}:line${i + 1}`,
        severity: 5,
        confidence: "medium",
        reason: "Authorization header",
      });
    }
  }
  if (opts.recursive !== false) {
    scanBase64Candidates(content, source, store);
  }
}

// ================== LIVE KEY VALIDATION (DEEP REASONING) ==================
// Each validator returns: { status, reason, method, confidence }
function valResult(status, reason, method, confidence) {
  return { status, reason, method, confidence };
}

async function validateAWSKey(key) {
  return valResult("UNVERIFIED", "AWS Access Key IDs require a paired Secret Key for verification — cannot validate standalone", "format_check", "medium");
}

async function validateGitHubToken(token) {
  try {
    const res = await fetch("https://api.github.com/user", { headers: { "Authorization": `Bearer ${token}`, "User-Agent": getUserAgent() } });
    if (res.status === 200) return valResult("VALID", "API authenticated successfully — token grants active repository access", "api_call", "high");
    if (res.status === 401) return valResult("INVALID", "API returned 401 Unauthorized — token is revoked or expired", "api_call", "high");
    return valResult("UNVERIFIED", `API returned unexpected status ${res.status}`, "api_call", "low");
  } catch (e) { return valResult("UNVERIFIED", `Network error during validation: ${e.message || "connection failed"}`, "api_call", "low"); }
}

async function validateStripeKey(key) {
  const mode = key.includes("_test_") ? "TEST" : "LIVE";
  try {
    const res = await fetch("https://api.stripe.com/v1/charges?limit=1", { headers: { "Authorization": `Bearer ${key}` } });
    if (res.status === 200) return valResult(`VALID (${mode})`, `Stripe API accepted the key — ${mode === "LIVE" ? "CRITICAL: live payment access granted" : "test mode access granted"}`, "api_call", "high");
    if (res.status === 401) return valResult(`INVALID (${mode})`, "Stripe API rejected the key with 401 — key is revoked, expired, or incorrect", "api_call", "high");
    return valResult(`UNVERIFIED (${mode})`, `Stripe API returned status ${res.status}`, "api_call", "medium");
  } catch (e) { return valResult(`UNVERIFIED (${mode})`, `Network error: ${e.message || "connection failed"}`, "api_call", "low"); }
}

async function validateOpenAIKey(key) {
  if (!key.startsWith("sk-")) return valResult("INVALID", "Key does not match expected 'sk-' prefix format", "format_check", "high");
  try {
    const res = await fetch("https://api.openai.com/v1/models", { headers: { "Authorization": `Bearer ${key}` } });
    if (res.status === 200) return valResult("VALID", "OpenAI API authenticated — key grants model access and can incur charges", "api_call", "high");
    if (res.status === 401) return valResult("INVALID", "Format valid (sk-proj-*) but API returned 401 — key is revoked or unauthorized", "api_call", "high");
    if (res.status === 429) return valResult("VALID (RATE-LIMITED)", "API returned 429 — key is valid but rate-limited, confirming it is active", "api_call", "high");
    return valResult("UNVERIFIED", `API returned unexpected status ${res.status}`, "api_call", "medium");
  } catch (e) { return valResult("UNVERIFIED", `Network error during validation: ${e.message || "connection failed"}`, "api_call", "low"); }
}

async function validateSendGridKey(key) {
  try {
    const res = await fetch("https://api.sendgrid.com/v3/user/profile", { headers: { "Authorization": `Bearer ${key}` } });
    if (res.status === 200) return valResult("VALID", "SendGrid API authenticated — key can send emails on behalf of the account", "api_call", "high");
    if (res.status === 401) return valResult("INVALID", "SendGrid API rejected key with 401 — key is revoked or incorrect", "api_call", "high");
    return valResult("UNVERIFIED", `API returned status ${res.status}`, "api_call", "medium");
  } catch (e) { return valResult("UNVERIFIED", `Network error: ${e.message || "connection failed"}`, "api_call", "low"); }
}

async function validateAnthropicKey(key) {
  try {
    const res = await fetch("https://api.anthropic.com/v1/models", { headers: { "x-api-key": key, "anthropic-version": "2023-06-01" } });
    if (res.status === 200) return valResult("VALID", "Anthropic API authenticated — key grants Claude model access", "api_call", "high");
    if (res.status === 401) return valResult("INVALID", "Anthropic API returned 401 — key is revoked or unauthorized", "api_call", "high");
    return valResult("UNVERIFIED", `API returned status ${res.status}`, "api_call", "medium");
  } catch (e) { return valResult("UNVERIFIED", `Network error: ${e.message || "connection failed"}`, "api_call", "low"); }
}

async function validateHuggingFaceToken(token) {
  try {
    const res = await fetch("https://huggingface.co/api/whoami", { headers: { "Authorization": `Bearer ${token}` } });
    if (res.status === 200) return valResult("VALID", "HuggingFace API authenticated — token grants model and dataset access", "api_call", "high");
    if (res.status === 401) return valResult("INVALID", "HuggingFace API returned 401 — token is revoked", "api_call", "high");
    return valResult("UNVERIFIED", `API returned status ${res.status}`, "api_call", "medium");
  } catch (e) { return valResult("UNVERIFIED", `Network error: ${e.message || "connection failed"}`, "api_call", "low"); }
}

async function validateLinearKey(key) {
  try {
    const res = await fetch("https://api.linear.app/graphql", {
      method: "POST",
      headers: { "Authorization": key, "Content-Type": "application/json" },
      body: JSON.stringify({ query: "{ viewer { id } }" })
    });
    if (res.status === 200) return valResult("VALID", "Linear GraphQL API authenticated — key grants project management access", "api_call", "high");
    if (res.status === 401) return valResult("INVALID", "Linear API returned 401 — key is revoked or incorrect", "api_call", "high");
    return valResult("UNVERIFIED", `API returned status ${res.status}`, "api_call", "medium");
  } catch (e) { return valResult("UNVERIFIED", `Network error: ${e.message || "connection failed"}`, "api_call", "low"); }
}

async function validateSupabaseKey(key) {
  try {
    const parts = key.split('.');
    if (parts.length !== 3) return valResult("INVALID", "JWT structure invalid — expected 3 dot-separated segments", "format_check", "high");
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    const role = payload.role || "unknown";
    const iss = payload.iss || "unknown";
    if (payload.exp && (payload.exp * 1000) < Date.now()) {
      return valResult("EXPIRED", `JWT expired at ${new Date(payload.exp * 1000).toISOString()} — role: ${role}, issuer: ${iss}`, "jwt_decode", "high");
    }
    const projectRef = payload.iss?.replace('https://', '').split('.')[0];
    if (!projectRef) return valResult("VALID FORMAT", `JWT structure valid — role: ${role}, issuer: ${iss}, but project ref not extractable`, "jwt_decode", "medium");
    const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}`, { headers: { "Authorization": `Bearer ${key}` } });
    if (res.status === 200) return valResult("VALID", `Supabase API authenticated — role: ${role}, project: ${projectRef}. ${role === "service_role" ? "CRITICAL: service_role bypasses all RLS" : "anon role — check RLS policies"}`, "api_call", "high");
    if (res.status === 401 || res.status === 403) return valResult("INVALID", `Supabase API rejected key (${res.status}) — role: ${role}, project: ${projectRef}`, "api_call", "high");
    return valResult("UNVERIFIED", `Supabase API returned status ${res.status} — role: ${role}`, "api_call", "medium");
  } catch (e) { return valResult("UNVERIFIED", `Validation error: ${e.message || "decode/network failed"}`, "jwt_decode", "low"); }
}

async function validateJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return valResult("INVALID", "Not a valid JWT — expected 3 dot-separated segments", "format_check", "high");
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    const details = [];
    const iss = payload.iss || null;
    const role = payload.role || payload.permissions || payload.scope || null;
    const exp = payload.exp ? new Date(payload.exp * 1000) : null;
    if (iss) details.push(`Issuer: ${iss}`);
    if (role) details.push(`Role: ${role}`);
    if (exp) details.push(`Expires: ${exp.toISOString().split("T")[0]}`);

    let status, reason;
    if (payload.exp && (payload.exp * 1000) < Date.now()) {
      status = "EXPIRED";
      reason = `JWT expired on ${exp.toISOString().split("T")[0]} — no longer usable for authentication`;
    } else if (payload.exp && (payload.exp * 1000) - Date.now() > 365 * 24 * 60 * 60 * 1000) {
      status = "LONG-LIVED";
      const yearsLeft = Math.round(((payload.exp * 1000) - Date.now()) / (365.25 * 24 * 60 * 60 * 1000));
      reason = `Expiry set to ${exp.toISOString().split("T")[0]} (${yearsLeft}+ years) — indicates weak rotation policy or static service key`;
    } else if (payload.exp) {
      const daysLeft = Math.round(((payload.exp * 1000) - Date.now()) / (24 * 60 * 60 * 1000));
      status = "VALID FORMAT";
      reason = `JWT has ${daysLeft} days until expiry — standard rotation window`;
    } else {
      status = "NO EXPIRY";
      reason = "JWT has no expiry claim — token never expires, which is a security concern";
    }

    return valResult(status, `${reason}. ${details.join(" | ")}`, "jwt_decode", "high");
  } catch (e) { return valResult("INVALID", `Failed to decode JWT payload: ${e.message || "malformed token"}`, "format_check", "high"); }
}

async function validateFirebaseCredential(key) {
  if (key.includes(".firebaseio.com")) {
    return valResult("VALID TARGET", "URL points to a Firebase Realtime Database — test /.json for unauthenticated access", "pattern_check", "high");
  }
  if (key.includes("AIza")) {
    try {
      const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${key}`, { method: "POST", body: JSON.stringify({ returnSecureToken: true }) });
      if (res.status === 200) return valResult("VALID", "Firebase/Google API key accepted — allows anonymous account creation", "api_call", "high");
      if (res.status === 400) return valResult("RESTRICTED", "API key exists but request rejected — key may have restrictions configured", "api_call", "medium");
      if (res.status === 403) return valResult("INVALID", "API key rejected with 403 — key is disabled or domain-restricted", "api_call", "high");
      return valResult("UNVERIFIED", `Identity Toolkit returned status ${res.status}`, "api_call", "medium");
    } catch (e) { return valResult("UNVERIFIED", `Network error: ${e.message || "connection failed"}`, "api_call", "low"); }
  }
  return valResult("UNVERIFIED", "Credential type not recognized for automated validation", "format_check", "low");
}

async function validateSecret(finding) {
  const kind = finding.kind, value = finding.value;
  if (kind === "github_token") return await validateGitHubToken(value);
  if (kind === "stripe_secret" || kind === "stripe_restricted") return await validateStripeKey(value);
  if (kind === "openai_key") return await validateOpenAIKey(value);
  if (kind === "sendgrid_key") return await validateSendGridKey(value);
  if (kind === "anthropic_key") return await validateAnthropicKey(value);
  if (kind === "huggingface_token") return await validateHuggingFaceToken(value);
  if (kind === "linear_api_key") return await validateLinearKey(value);
  if (kind === "supabase_service_role") return await validateSupabaseKey(value);
  if (kind === "aws_access_key_id") return await validateAWSKey(value);
  if (kind === "jwt") return await validateJWT(value);
  if (kind === "firebase_credential" || kind === "google_api_key") return await validateFirebaseCredential(value);
  return valResult("UNVERIFIED", "No automated validator available for this credential type — manual review recommended", "none", "low");
}

// ================== FINALIZE FINDINGS WITH VALIDATION ==================
async function finalizeFindingsWithValidation(store) {
  let arr = [...store.values()].map((f) => ({ ...f, sources: [...f.sources].sort() }));
  arr = arr.filter(f => !isLikelyNoise(f.value) || f.confidence === "high");
  const grouped = new Map();
  for (const f of arr) {
    const key = f.value;
    if (!grouped.has(key)) grouped.set(key, { ...f, occurrences: 1, sources: new Set(f.sources) });
    else {
      const existing = grouped.get(key);
      existing.occurrences += f.occurrences;
      f.sources.forEach(s => existing.sources.add(s));
      existing.severity = Math.max(existing.severity, f.severity);
      if (existing.confidence !== "high" && f.confidence === "high") existing.confidence = "high";
    }
  }
  arr = [...grouped.values()].map(f => ({ ...f, sources: [...f.sources] }));
  console.log(chalk.yellow("\n[•] Validating secrets (may take a moment)..."));
  let validatedCount = 0;
  for (const f of arr) {
    if (f.confidence === "high" && f.severity >= 4) {
      const result = await validateSecret(f);
      f.validated = result.status;
      f.validationReason = result.reason;
      f.validationMethod = result.method;
      f.validationConfidence = result.confidence;
      validatedCount++;
      if (validatedCount % 10 === 0) process.stdout.write(`\r[•] Validated ${validatedCount} secrets`);
    } else {
      f.validated = "UNVERIFIED";
      f.validationReason = f.severity < 4 ? "Below severity threshold for automated validation" : "Below confidence threshold for automated validation";
      f.validationMethod = "none";
      f.validationConfidence = "low";
    }
  }
  if (validatedCount > 0) console.log();
  arr.sort((a, b) => {
    if (b.severity !== a.severity) return b.severity - a.severity;
    const confOrder = { high: 3, medium: 2, low: 1 };
    return (confOrder[b.confidence] || 0) - (confOrder[a.confidence] || 0);
  });
  return arr;
}


// ================== EXPLOIT CHAIN BUILDER & INTELLIGENCE ==================
function getSecretImpact(kind, validated) {
  const v = String(validated || "");
  // INVALID secrets cannot be directly exploited
  if (v === "INVALID" || (v.startsWith("INVALID") && !v.includes("FORMAT"))) {
    return "No direct abuse possible — key is revoked/invalid. Indicates poor secret hygiene (secrets committed to client-side code).";
  }
  const impacts = {
    "stripe_secret": "Critical Impact: Payment Fraud — Can process unauthorized payments, drain funds, and expose customer financial data.",
    "stripe_restricted": "High Impact: Business Disruption — Limits absolute destruction, but can still leak transactional data or be used for spoofing.",
    "openai_key": "Medium Impact: Financial Loss via Abuse — Can exhaust AI API credits and potentially access organization fine-tuning data.",
    "anthropic_key": "Medium Impact: Financial Loss via Abuse — Can exhaust AI API credits and potentially access organization fine-tuning data.",
    "sendgrid_key": "Medium Impact: Brand Abuse — Can be used to send phishing emails from the company domain, destroying sender reputation.",
    "huggingface_token": "High Impact: Model Theft & Corruption — Could allow reading private models or poisoning existing datasets.",
    "linear_key": "Medium Impact: Internal Data Leak — Can read internal project management tickets, potentially exposing upcoming features or credentials.",
    "github_token": "Critical Impact: Source Code Compromise — Full repository source code access, potential to inject supply-chain backdoors.",
    "supabase_service_role": "Critical Impact: Deep Data Breach — Bypasses all Row Level Security (RLS). Gives full read/write/delete access to database structure and users.",
    "aws_access_key_id": "Critical Impact: Infrastructure Takeover — Potential cloud account takeover. Can spin up costly infrastructure or exfiltrate S3 bucket data.",
    "jwt": "High Impact: Unauthorized Access — Can be used to bypass authentication natively or forged if secret is weak.",
    "context_secret": "Medium Impact: Lateral Movement — Could grant access to undocumented internal APIs or 3rd-party integrations.",
    "firebase_credential": "High Impact: Data Exposure — May allow broad access to Firebase collections or impersonate users if improperly scoped.",
    "analytics_key": "Low Impact: Tracking Leak — Can pollute analytics data or expose basic tracking configurations."
  };
  const base = impacts[kind] || "Could allow unauthorized access to associated service or environment.";
  // UNVERIFIED secrets = potential risk, not confirmed
  if (v === "UNVERIFIED" || v.startsWith("UNVERIFIED")) {
    return `Potential risk (not confirmed) — ${base.charAt(0).toLowerCase() + base.slice(1)}`;
  }
  return base;
}

function getEndpointIntentHint(type) {
  const hints = {
    "API": "General system programmatic interface",
    "AUTH": "Handles sensitive identity verification & tokens",
    "ADMIN": "High-risk control panel (Monitor for IDOR)",
    "INTERNAL_API": "Likely unauthenticated/undocumented logic",
    "CONFIG": "May expose deployment infrastructure details",
    "GRAPHQL": "Check for introspection or nested query DOS",
    "DISCOVERY": "Provides roadmap to the application's structure"
  };
  return hints[type] || "Standard asset delivery";
}

function generateExploitChains(findings, intelligence) {
  const chains = [];

  const AUTH_CAPABLE_KINDS = new Set(["jwt", "context_secret", "basic_auth_header", "basic_auth_url",
    "supabase_service_role", "github_token", "api_token_context"]);
  const DATA_ACCESS_KINDS = new Set(["supabase_service_role", "db_uri", "firebase_credential",
    "aws_access_key_id", "aws_context_secret"]);
  // Strict evidence check: INVALID must NOT pass
  function hasEvidence(f) {
    const v = String(f.validated || "");
    if (v === "INVALID" || v.startsWith("INVALID")) return false;
    if (v === "EXPIRED" || v.startsWith("EXPIRED")) return false;
    return v === "VALID" || v.startsWith("VALID") || v.includes("LONG-LIVED") || v.includes("FORMAT") || v === "NO EXPIRY";
  }
  // Determine validation tier for impact modulation
  function getValidationTier(f) {
    const v = String(f.validated || "");
    if (v === "INVALID" || v.startsWith("INVALID")) return "invalid";
    if (v === "EXPIRED" || v.startsWith("EXPIRED")) return "expired";
    if (v === "UNVERIFIED" || v.startsWith("UNVERIFIED")) return "unverified";
    if (v === "VALID" || v.startsWith("VALID")) return "valid";
    if (v.includes("LONG-LIVED")) return "valid"; // long-lived = usable
    if (v.includes("FORMAT")) return "unverified"; // format-only = not confirmed
    return "unverified";
  }

  // Chain 1: JWT + Backend Service + API Endpoints = Unauthorized API Access
  const jwtFindings = findings.filter(f => f.kind === "jwt" && hasEvidence(f));
  const hasBackendService = intelligence.services.size > 0;
  const allApis = [...(intelligence.apis.user || []), ...(intelligence.apis.admin || []), ...(intelligence.apis.internal || [])];

  if (jwtFindings.length > 0 && hasBackendService && allApis.length > 0) {
    const f = jwtFindings[0];
    const src = f.sources && f.sources.length ? f.sources[0] : "unknown";
    const services = [...intelligence.services].join(", ");
    chains.push({
      title: "Unauthorized API Access via JWT Replay",
      trigger: {
        conditions: [
          `JWT found (${f.validated}) in: ${src}`,
          `Backend service(s) detected: ${services}`,
          `${allApis.length} API endpoint(s) discovered`
        ]
      },
      flow: [
        `1. Extract JWT from client-side source: ${truncate(src, 60)}`,
        `2. JWT grants ${f.validationReason ? f.validationReason.split(".")[0] : "access to backend"}`,
        `3. Replay token as Authorization header to API endpoints`,
        `4. Target endpoints: ${allApis.slice(0, 3).join(", ")}${allApis.length > 3 ? " ..." : ""}`
      ],
      result: `JWT allows ${jwtFindings[0].validated?.includes("LONG-LIVED") ? "long-lived" : "authenticated"} access to ${services} APIs — potential unauthorized data read/write`,
      impact: "Data Breach / Unauthorized Access"
    });
  }

  // Chain 2: Admin Endpoint + Auth-capable Secret = Privilege Escalation
  const adminApis = intelligence.apis.admin || [];
  const authFindings = findings.filter(f => f.severity >= 4 && AUTH_CAPABLE_KINDS.has(f.kind) && hasEvidence(f));

  if (authFindings.length > 0 && adminApis.length > 0) {
    const f = authFindings[0];
    const src = f.sources && f.sources.length ? f.sources[0] : "unknown";
    chains.push({
      title: "Admin Privilege Escalation",
      trigger: {
        conditions: [
          `Auth-capable ${f.kind} found in: ${src}`,
          `${adminApis.length} admin endpoint(s) exposed: ${adminApis[0]}`
        ]
      },
      flow: [
        `1. ${f.label} extracted from: ${truncate(src, 60)}`,
        `2. Credential type (${f.kind}) is capable of web authentication`,
        `3. Replay credential to admin panel: ${adminApis[0]}`
      ],
      result: "Direct administrative access (possible if endpoint lacks supplementary authorization)",
      impact: "Critical System Compromise"
    });
  }

  // Chain 3: Supabase JWT + Service detection = RLS Bypass / Data Access
  if (intelligence.services.has("Supabase")) {
    const supaJwts = findings.filter(f => (f.kind === "jwt" || f.kind === "supabase_service_role") && hasEvidence(f));
    const roleKeys = supaJwts.filter(f => f.kind === "supabase_service_role");
    const anonJwts = supaJwts.filter(f => f.kind === "jwt" && f.validationReason?.includes("anon"));

    if (roleKeys.length > 0) {
      const f = roleKeys[0];
      chains.push({
        title: "Supabase RLS Bypass via service_role Key",
        trigger: {
          conditions: [
            `service_role key found (validated: ${f.validated})`,
            `Supabase service confirmed in tech stack`
          ]
        },
        flow: [
          `1. service_role key extracted: ${truncate(f.value, 40)}...`,
          `2. This key type natively bypasses Row Level Security (RLS)`,
          `3. Set as Bearer token → POST/GET to /rest/v1/{table}`
        ],
        result: "Full database access (possible if service_role key is used without network restrictions)",
        impact: "Critical Root Database Compromise"
      });
    } else if (anonJwts.length > 0) {
      const f = anonJwts[0];
      chains.push({
        title: "Supabase Anonymous API Access",
        trigger: {
          conditions: [
            `Supabase anon JWT found (validated: ${f.validated})`,
            `Supabase service confirmed in tech stack`
          ]
        },
        flow: [
          `1. Anon JWT extracted from client-side bundle`,
          `2. Authenticate to REST API with anon key`,
          `3. Probe predictable tables: /rest/v1/users, /rest/v1/profiles`
        ],
        result: "If RLS is misconfigured, public table reads are possible",
        impact: "Potential Data Exposure"
      });
    }
  }

  // Chain 4: Firebase + credential = Database Dump
  if (intelligence.services.has("Firebase")) {
    const leakedFirebase = findings.filter(f =>
      (f.kind.includes("firebase") || f.value.includes("firebaseio.com")) && hasEvidence(f)
    );
    if (leakedFirebase.length > 0) {
      const f = leakedFirebase[0];
      const targetUrl = f.value.includes("firebaseio.com") ? f.value : "associated Firebase DB";
      chains.push({
        title: "Firebase Realtime DB Unauthorized Access",
        trigger: {
          conditions: [
            `Firebase credential/URL discovered: ${truncate(f.value, 50)}`,
            `Firebase service confirmed in tech stack`
          ]
        },
        flow: [
          `1. Append '.json' to database root URL`,
          `2. Target: ${targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`}/.json`,
          `3. If Realtime DB rules allow public read → full dump`
        ],
        result: "Database exposure (if security rules are unconfigured or misconfigured)",
        impact: "Complete Database Exposure / Ransom"
      });
    }
  }

  // Chain 5: API Key + Frontend Exposure — VALIDATION-AWARE
  const apiKeyFindings = findings.filter(f => (f.kind === "openai_key" || f.kind === "anthropic_key" || f.kind === "sendgrid_key"));
  if (apiKeyFindings.length > 0) {
    const f = apiKeyFindings[0];
    const src = f.sources && f.sources.length ? f.sources[0] : "unknown";
    const isFrontend = src.includes(".js") || src.includes("assets/") || src.includes("bundle");
    const tier = getValidationTier(f);

    if (isFrontend) {
      if (tier === "valid") {
        // VALID key = full abuse chain
        chains.push({
          title: "API Key Abuse via Frontend Exposure",
          trigger: {
            conditions: [
              `${f.label} found in client-side code: ${truncate(src, 50)}`,
              `Key is validated as: ${f.validated} (CONFIRMED ACTIVE)`
            ]
          },
          flow: [
            `1. API key is embedded in publicly accessible JavaScript`,
            `2. Anyone can extract and reuse this key`,
            `3. Key allows: ${getSecretImpact(f.kind, f.validated).split(".")[0]}`
          ],
          result: `Third-party API abuse — ${f.kind === "openai_key" ? "AI credit exhaustion" : f.kind === "sendgrid_key" ? "spam/phishing via email API" : "unauthorized API usage"}`,
          impact: "Financial Loss / Service Abuse"
        });
      } else if (tier === "invalid" || tier === "expired") {
        // INVALID/EXPIRED key = hygiene warning only, NO exploit claim
        chains.push({
          title: "Secret Hygiene Issue — API Key in Client Code",
          trigger: {
            conditions: [
              `${f.label} found in client-side code: ${truncate(src, 50)}`,
              `Key is validated as: ${f.validated} (NOT EXPLOITABLE)`
            ]
          },
          flow: [
            `1. API key is hardcoded in publicly accessible JavaScript`,
            `2. Key was tested against the provider API and rejected`,
            `3. No direct abuse is possible with this specific key`
          ],
          result: "No direct exploitation — but indicates poor secret management. Future key rotations may re-expose valid credentials in the same location.",
          impact: "Security Hygiene / Process Risk"
        });
      } else {
        // UNVERIFIED key = uncertain
        chains.push({
          title: "API Key Exposure — Unverified Risk",
          trigger: {
            conditions: [
              `${f.label} found in client-side code: ${truncate(src, 50)}`,
              `Key is validated as: ${f.validated} (STATUS UNCERTAIN)`
            ]
          },
          flow: [
            `1. API key is embedded in publicly accessible JavaScript`,
            `2. Validation could not confirm or deny key status`,
            `3. Manual verification against provider API recommended`
          ],
          result: "Potential risk — key validity could not be confirmed. If active, third-party API abuse is possible.",
          impact: "Potential Financial Loss (Unconfirmed)"
        });
      }
    }
  }

  return chains;
}

function getServiceHints(intelligence, findings) {
  const hints = [];
  if (intelligence.services.has("Firebase")) {
    const firebaseLinks = findings.filter(f => f.value.includes("firebaseio.com"));
    if (firebaseLinks.length > 0) {
      hints.push({ service: "Firebase", hint: `Confirmed DB exposure: Evaluate read/write by appending /.json to ${firebaseLinks[0].value}` });
    }
  }
  if (intelligence.services.has("Stripe")) {
    const stripeKeys = findings.filter(f => f.kind.includes("stripe"));
    for (const sk of stripeKeys) {
      if (sk.value.startsWith("rk_")) {
        hints.push({ service: "Stripe", hint: `Restricted key (${sk.value.substring(0, 8)}***) verified. Impacts limited by specific token scopes.` });
      } else if (sk.value.startsWith("sk_live")) {
        hints.push({ service: "Stripe", hint: `CRITICAL: Standard Secret Key (${sk.value.substring(0, 8)}***) verified. Grants complete API destructive power.` });
      }
    }
  }
  if (intelligence.services.has("Supabase")) {
    const anonKeys = findings.filter(f => f.kind === "supabase_anon" && f.validated === "VALID");
    if (anonKeys.length > 0 && intelligence.apis.user && intelligence.apis.user.length > 0) {
      hints.push({ service: "Supabase", hint: `Valid Anon Key found. Test Row Level Security (RLS) bypass directly on discovered endpoint: ${intelligence.apis.user[0]}` });
    }
  }
  return hints;
}

// ================== RECON ANALYSIS ENGINE (RELATIONAL RISK SCORING) ==================
function analyzeRisk(findings, intelligence) {
  let score = 0;
  const reasons = [];

  // === BASE WEIGHTS ===
  const validSecrets = findings.filter(f => f.severity >= 5 && String(f.validated || "").includes("VALID"));
  const longLivedSecrets = findings.filter(f => String(f.validated || "").includes("LONG-LIVED"));
  const highSevSecrets = findings.filter(f => f.severity >= 5);
  const hasAdminEndpoints = (intelligence.apis.admin || []).length > 0;
  const hasUserEndpoints = (intelligence.apis.user || []).length > 0;
  const hasInternalEndpoints = (intelligence.apis.internal || []).length > 0;
  const hasAuth = !!intelligence.auth;
  const serviceCount = intelligence.services.size;
  const hasSupabase = intelligence.services.has("Supabase");
  const hasFirebase = intelligence.services.has("Firebase");

  // Step 1: Base findings scoring
  if (validSecrets.length > 0) {
    score += 30;
    reasons.push(`${validSecrets.length} validated high-severity secret(s) confirmed active`);
  } else if (highSevSecrets.length > 0) {
    score += 15;
    reasons.push(`${highSevSecrets.length} high-severity secret(s) detected (unvalidated)`);
  }
  if (longLivedSecrets.length > 0) {
    score += 10;
    reasons.push(`${longLivedSecrets.length} long-lived token(s) — weak rotation policy`);
  }
  if (hasAdminEndpoints) {
    score += 15;
    reasons.push(`Admin endpoints exposed (${intelligence.apis.admin.length} found)`);
  }
  if (hasInternalEndpoints) {
    score += 10;
    reasons.push(`Internal API endpoints accessible (${intelligence.apis.internal.length} found)`);
  }
  if (serviceCount > 0) {
    score += 5;
    reasons.push(`Backend services detected: ${[...intelligence.services].join(", ")}`);
  }
  if (hasAuth) {
    score += 5;
    reasons.push("Authentication flow detected — credential interception possible");
  }

  // Step 2: RELATIONAL AMPLIFICATION — linked findings multiply risk
  // JWT + Supabase + API endpoints = amplified risk
  const hasJwt = findings.some(f => f.kind === "jwt" && String(f.validated || "") !== "EXPIRED");
  if (hasJwt && hasSupabase && hasUserEndpoints) {
    score += 15;
    reasons.push("⚡ JWT + Supabase + API endpoints → amplified unauthorized access risk");
  }
  // Validated secret + Admin panel = critical escalation
  if (validSecrets.length > 0 && hasAdminEndpoints) {
    score += 15;
    reasons.push("⚡ Validated secret + Admin panel → direct privilege escalation path");
  }
  // API key in frontend + service detected = abuse risk
  const frontendApiKeys = findings.filter(f =>
    (f.kind === "openai_key" || f.kind === "stripe_secret" || f.kind === "sendgrid_key") &&
    f.sources?.some(s => s.includes(".js") || s.includes("assets/"))
  );
  if (frontendApiKeys.length > 0) {
    score += 10;
    reasons.push(`⚡ ${frontendApiKeys.length} API key(s) exposed in client-side JavaScript`);
  }
  // Long-lived JWT + backend service = persistent access
  if (longLivedSecrets.length > 0 && serviceCount > 0) {
    score += 10;
    reasons.push("→ ⚡ Long-lived tokens + active backend → potential persistent unauthorized access IF backend access controls are weak");
  }
  // Firebase credentials + Firebase service = DB risk
  if (hasFirebase && findings.some(f => f.kind.includes("firebase") || f.value?.includes("firebaseio.com"))) {
    score += 10;
    reasons.push("⚡ Firebase credentials + confirmed service → database exposure risk");
  }

  const finalScore = Math.min(100, score);
  let verdict = "LOW";
  if (finalScore >= 65) verdict = "HIGH";
  else if (finalScore >= 35) verdict = "MEDIUM";
  return { score: finalScore, verdict, reasons };
}

function collectRateLimitSignals(resources) {
  const signals = [];
  const wafHeaders = ["x-ratelimit-limit", "retry-after", "cf-mitigated", "x-amzn-waf-action"];
  for (const r of resources) {
    if (r.status === 429 || r.status === 403) {
      let foundHeader = false;
      for (const h of wafHeaders) {
        if (r.headers[h.toLowerCase()]) {
          signals.push(`${r.url} (${h}: ${r.headers[h.toLowerCase()]})`);
          foundHeader = true;
        }
      }
      if (r.status === 429 && !foundHeader) {
        signals.push(`${r.url} (HTTP 429 Too Many Requests)`);
      }
    }
  }
  return [...new Set(signals)];
}

// ================== CRAWL ==================
const STATE_FILE = ".reconix-state.json";
function loadState() {
  if (!flags.resume) return null;
  try {
    if (fs.existsSync(STATE_FILE)) return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch { }
  return null;
}
function saveState(state) {
  try { fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2)); } catch { }
}
function priorityScore(url, depth) {
  let score = 1000 - (depth * 100);
  const lower = url.toLowerCase();
  if (lower.includes('.js') || lower.includes('javascript')) score += 50;
  if (lower.includes('.json') || lower.includes('api')) score += 30;
  if (lower.includes('robots.txt') || lower.includes('sitemap')) score += 40;
  if (lower.includes('.css')) score += 10;
  if (lower.includes('.html') || lower === '') score += 20;
  if (flags.aggressive) {
    if (lower.includes('/api/') || lower.includes('/v1/') || lower.includes('/v2/')) score += 40;
    if (lower.includes('.map')) score += 30;
  }
  return score;
}
function defaultSeeds(baseUrl) {
  const paths = [
    "/robots.txt", "/sitemap.xml", "/sitemap_index.xml", "/feed.xml", "/rss.xml",
    "/manifest.json", "/asset-manifest.json", "/security.txt", "/.well-known/security.txt",
    "/.well-known/assetlinks.json", "/.well-known/apple-app-site-association", "/crossdomain.xml",
    "/openapi.json", "/openapi.yaml", "/openapi.yml", "/swagger.json", "/swagger/v1/swagger.json",
    "/v2/api-docs", "/v3/api-docs", "/api-docs",
  ];
  if (flags.aggressive) {
    paths.push(
      "/api", "/api/v1", "/api/v2", "/graphql", "/admin", "/wp-admin", "/phpmyadmin",
      "/.env", "/.env.production", "/.git/config", "/config.json", "/config.yml"
    );
  }
  return paths.map(p => new URL(p, baseUrl).href);
}
async function crawlScope(baseUrl, rootScopeHost, options, extraSeeds = []) {
  const maxDepth = options.aggressive ? (options.deep ? 6 : 4) : (options.deep ? 4 : 2);
  let maxResources;
  if (options.aggressive && options.deep) maxResources = 500;
  else if (options.aggressive && !options.deep) maxResources = 350;
  else if (!options.aggressive && options.deep) maxResources = 220;
  else maxResources = 120;
  const concurrency = Math.max(1, Math.min(options.threads || 20, options.aggressive ? 30 : 20));
  let queue = [], enqueued = new Set(), resources = [], blobs = [];
  const saved = loadState();
  if (saved && saved.queue && saved.enqueued && saved.resources && saved.blobs) {
    console.log(chalk.blue("[*] Resuming from previous state — validating..."));
    const originalCount = saved.queue.length + saved.resources.length;
    // Validate queue: remove out-of-scope, malformed, and duplicate URLs
    const validatedQueue = [];
    const seenUrls = new Set();
    for (const item of saved.queue) {
      if (!item || !item.url) continue;
      try { new URL(item.url); } catch { continue; } // malformed
      if (!isAllowedUrl(item.url, rootScopeHost)) continue; // out of scope
      const norm = normalizeUrl(item.url);
      if (!norm || seenUrls.has(norm)) continue; // duplicate
      seenUrls.add(norm);
      if (item.priorityScore === undefined) item.priorityScore = priorityScore(item.url, item.depth || 0);
      validatedQueue.push(item);
    }
    // Validate resources: remove out-of-scope
    const validatedResources = saved.resources.filter(r => {
      if (!r || !r.url) return false;
      try { new URL(r.url); } catch { return false; }
      return isAllowedUrl(r.url, rootScopeHost);
    });
    // Filter blobs: remove entries with empty text
    const validatedBlobs = saved.blobs.filter(b => b && b.text && String(b.text).trim().length > 0);
    // Validate enqueued set
    const validatedEnqueued = new Set();
    for (const u of (saved.enqueued || [])) {
      try { new URL(u); if (isAllowedUrl(u, rootScopeHost)) validatedEnqueued.add(u); } catch { }
    }
    // Check corruption level
    const survivedCount = validatedQueue.length + validatedResources.length;
    if (originalCount > 0 && survivedCount / originalCount < 0.5) {
      console.log(chalk.yellow("[⚠] Saved state too corrupted (>50% invalid) — starting fresh scan"));
    } else {
      queue = validatedQueue;
      queue.sort((a, b) => b.priorityScore - a.priorityScore);
      enqueued = validatedEnqueued;
      // Also add queue URLs to enqueued
      for (const item of queue) enqueued.add(item.url);
      resources = validatedResources;
      blobs = validatedBlobs;
      console.log(chalk.green(`[+] State validated: ${queue.length} queued, ${resources.length} resources, ${blobs.length} blobs`));
    }
  }
  if (queue.length === 0 && resources.length === 0) {
    function enqueue(rawUrl, depth = 0, source = "seed") {
      if (!rawUrl || resources.length + queue.length >= maxResources) return;
      let abs = null;
      try { abs = new URL(rawUrl, baseUrl).href; } catch { return; }
      if (!isAllowedUrl(abs, rootScopeHost)) return;
      const key = normalizeUrl(abs);
      if (!key || enqueued.has(key)) return;
      enqueued.add(key);
      queue.push({ url: key, depth, source, priorityScore: priorityScore(key, depth) });
    }
    enqueue(baseUrl, 0, "target");
    for (const seed of defaultSeeds(baseUrl)) enqueue(seed, 0, "seed");
    for (const seed of extraSeeds) enqueue(seed, 0, "subdomain");
    queue.sort((a, b) => b.priorityScore - a.priorityScore);
  }
  let cursor = 0;
  async function worker() {
    while (true) {
      if (cursor >= queue.length) break;
      const item = queue[cursor++];
      if (!item) continue;
      if (resources.length >= maxResources) break;
      if (item.depth > maxDepth) continue;
      let fetched = null;
      if (flags.js && (item.depth === 0 || item.url.match(/\.(html?)$/i))) fetched = await fetchWithBrowser(item.url);
      if (!fetched) fetched = await safeFetchMeta(item.url, { timeoutMs: 12000, maxBytes: options.maxBytes });
      if (!fetched) continue;
      if (!isAllowedUrl(fetched.finalUrl || fetched.url, rootScopeHost)) continue;
      const kind = detectKind(fetched.finalUrl || fetched.url, fetched.contentType, fetched.body);
      const resource = {
        url: normalizeUrl(fetched.finalUrl || fetched.url),
        source: item.source,
        depth: item.depth,
        status: fetched.status,
        headers: fetched.headers,
        contentType: fetched.contentType,
        kind,
        body: fetched.body || "",
      };
      resources.push(resource);
      blobs.push({ source: `${resource.url}::headers`, kind: "headers", text: headersToText(resource.headers), headers: resource.headers, status: resource.status, url: resource.url });
      if (resource.body) blobs.push({ source: resource.url, kind: resource.kind, text: resource.body, headers: resource.headers, status: resource.status, url: resource.url });
      const params = extractParams(resource.url, resource.body, resource.url);
      if (params.length) blobs.push({ source: `${resource.url}::params`, kind: "params", text: JSON.stringify(params, null, 2), headers: {}, status: resource.status, url: resource.url });
      if (resource.kind === "html") {
        const htmlArtifacts = extractHtmlArtifacts(resource.body, resource.url, rootScopeHost);
        for (const u of htmlArtifacts.urls) if (!enqueued.has(u)) { enqueued.add(u); queue.push({ url: u, depth: item.depth + 1, source: resource.url, priorityScore: priorityScore(u, item.depth + 1) }); }
        for (const b of htmlArtifacts.blobs) blobs.push(b);
        const extras = extractUrlsFromText(resource.body, htmlArtifacts.baseUrl || resource.url, rootScopeHost, 80);
        for (const u of extras) if (!enqueued.has(u)) { enqueued.add(u); queue.push({ url: u, depth: item.depth + 1, source: resource.url, priorityScore: priorityScore(u, item.depth + 1) }); }
      }
      if (resource.kind === "js" || resource.kind === "css" || resource.kind === "text" || resource.kind === "xml" || resource.kind === "json") {
        const broadUrls = extractUrlsFromText(resource.body, resource.url, rootScopeHost, 120);
        for (const u of broadUrls) if (!enqueued.has(u)) { enqueued.add(u); queue.push({ url: u, depth: item.depth + 1, source: resource.url, priorityScore: priorityScore(u, item.depth + 1) }); }
        if (flags.aggressive && resource.kind === "js") {
          const jsEndpoints = extractJsEndpoints(resource.body, resource.url);
          for (const u of jsEndpoints) if (!enqueued.has(u)) { enqueued.add(u); queue.push({ url: u, depth: item.depth + 1, source: resource.url, priorityScore: priorityScore(u, item.depth + 1) }); }
        }
      }
      if (resource.kind === "js" || resource.kind === "css") {
        const mapRef = extractSourceMapReference(resource.body);
        if (mapRef) {
          const inlineMap = decodeDataJsonRef(mapRef);
          if (inlineMap) {
            const mapBlobs = sourceMapBlobsFromJson(inlineMap, `${resource.url}::inline-source-map`, rootScopeHost, (u, d, s) => {
              if (!enqueued.has(u)) { enqueued.add(u); queue.push({ url: u, depth: d, source: s, priorityScore: priorityScore(u, d) }); }
            });
            for (const b of mapBlobs) blobs.push(b);
          } else {
            try {
              const mapUrl = new URL(mapRef, resource.url).href;
              if (isAllowedUrl(mapUrl, rootScopeHost) && !enqueued.has(mapUrl)) { enqueued.add(mapUrl); queue.push({ url: mapUrl, depth: item.depth + 1, source: resource.url, priorityScore: priorityScore(mapUrl, item.depth + 1) }); }
            } catch { }
          }
        }
        if (flags.aggressive && resource.kind === "js") {
          const possibleMap = resource.url + ".map";
          if (!enqueued.has(possibleMap)) { enqueued.add(possibleMap); queue.push({ url: possibleMap, depth: item.depth + 1, source: resource.url, priorityScore: priorityScore(possibleMap, item.depth + 1) }); }
        }
      }
      if (resource.kind === "map") {
        const mapBlobs = sourceMapBlobsFromJson(resource.body, resource.url, rootScopeHost, (u, d, s) => {
          if (!enqueued.has(u)) { enqueued.add(u); queue.push({ url: u, depth: d, source: s, priorityScore: priorityScore(u, d) }); }
        });
        for (const b of mapBlobs) blobs.push(b);
      }
      if (resource.kind === "xml") {
        const sitemapUrls = extractSitemapUrls(resource.body, resource.url, rootScopeHost);
        for (const u of sitemapUrls) if (!enqueued.has(u)) { enqueued.add(u); queue.push({ url: u, depth: item.depth + 1, source: resource.url, priorityScore: priorityScore(u, item.depth + 1) }); }
      }
      if (resource.kind === "json") {
        try {
          const parsed = JSON.parse(resource.body);
          if (parsed && typeof parsed === "object") {
            const manifestUrls = extractManifestUrls(resource.body, resource.url, rootScopeHost);
            for (const u of manifestUrls) if (!enqueued.has(u)) { enqueued.add(u); queue.push({ url: u, depth: item.depth + 1, source: resource.url, priorityScore: priorityScore(u, item.depth + 1) }); }
            if (Array.isArray(parsed.sourcesContent)) {
              const mapBlobs = sourceMapBlobsFromJson(resource.body, resource.url, rootScopeHost, (u, d, s) => {
                if (!enqueued.has(u)) { enqueued.add(u); queue.push({ url: u, depth: d, source: s, priorityScore: priorityScore(u, d) }); }
              });
              for (const b of mapBlobs) blobs.push(b);
            }
          }
        } catch { }
      }
      if (resource.kind === "text" && /robots\.txt$/i.test(resource.url.toLowerCase())) {
        const sitemapHints = resource.body.match(/^sitemap:\s*(.+)$/gim) || [];
        for (const line of sitemapHints) {
          const m = line.match(/^sitemap:\s*(.+)$/i);
          if (m && m[1]) {
            try {
              const abs = new URL(m[1].trim(), resource.url).href;
              if (isAllowedUrl(abs, rootScopeHost) && !enqueued.has(abs)) { enqueued.add(abs); queue.push({ url: abs, depth: item.depth + 1, source: resource.url, priorityScore: priorityScore(abs, item.depth + 1) }); }
            } catch { }
          }
        }
      }
      if (flags.aggressive && resource.url.includes("/api/")) {
        const versions = ["/v1/", "/v2/", "/v3/"];
        for (const v of versions) {
          const alt = resource.url.replace("/api/", `/api${v}`);
          if (!enqueued.has(alt)) { enqueued.add(alt); queue.push({ url: alt, depth: item.depth + 1, source: resource.url, priorityScore: priorityScore(alt, item.depth + 1) }); }
        }
      }
      if (resources.length % 10 === 0) saveState({ queue, enqueued: [...enqueued], resources, blobs });
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  if (fs.existsSync(STATE_FILE)) fs.unlinkSync(STATE_FILE);
  return { resources, blobs };
}

// ================== SCAN BLOBS ==================
async function scanBlobs(blobs, options) {
  const findingsMap = new Map();
  const techMap = new Map();
  let processed = 0;
  await mapLimit(blobs, options.threads, async (blob) => {
    if (!blob || !blob.text) {
      processed++;
      if (processed % 3 === 0 || processed === blobs.length) renderProgress("Scanning", processed, blobs.length);
      return;
    }
    scanTextForSecrets(blob.text, blob.source, findingsMap, { recursive: true, maxChars: options.maxBytes });
    const envFindings = detectInlineEnv(blob.text, blob.source);
    for (const ef of envFindings) {
      addFinding(findingsMap, {
        kind: "inline_env",
        label: "Inline Environment Variable",
        value: `${ef.key}=${ef.value}`,
        source: ef.source,
        severity: 4,
        confidence: "high",
        reason: "Exposed environment variable in client-side code",
      });
      scanTextForSecrets(ef.value, `${ef.source}::env_value`, findingsMap, { recursive: false });
    }
    const blobTechs = detectTechAdvanced(blob.headers || {}, blob.text || "", blob.url, [], [], null, null);
    for (const [name, tech] of blobTechs) addUnique(techMap, name, tech);
    processed++;
    if (processed % 3 === 0 || processed === blobs.length) renderProgress("Scanning", processed, blobs.length);
  });
  if (blobs.length === 0) console.log(chalk.gray("[•] No content collected for scanning"));
  else renderProgress("Scanning", blobs.length, blobs.length);
  return { findingsMap, techMap };
}

// ================== HTML REPORT GENERATOR ==================
function generateHtmlReport(report) {
  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Reconix Report - ${report.target}</title>
<style>body{font-family:Segoe UI;margin:40px;background:#0a0e27;color:#eee}.container{max-width:1200px;margin:auto;background:#0f1322;border-radius:12px;padding:24px}h1{color:#00d4ff}.risk-high{color:#ff5555}.risk-medium{color:#ffaa44}.risk-low{color:#44ff44}.section{margin-top:30px;background:#1a1e2f;padding:20px;border-radius:8px}.finding{background:#0f1222;margin:10px 0;padding:12px;border-left:4px solid #ff5555;border-radius:4px}.finding-critical{border-left-color:#ff0000}.finding-high{border-left-color:#ff8800}.finding-medium{border-left-color:#ffcc00}.finding-low{border-left-color:#00cc88}pre{background:#0a0e1c;padding:12px;overflow:auto;border-radius:6px;color:#bbffbb}</style>
</head><body><div class="container"><h1>🔍 Reconix Security Report</h1>
<p><strong>Target:</strong> ${escapeHtml(report.target)}</p><p><strong>Scope:</strong> ${escapeHtml(report.scopeHost)}</p><p><strong>Timestamp:</strong> ${report.timestamp}</p>
<p><strong>Risk Level:</strong> <span class="risk-${report.risk.level.toLowerCase()}">${report.risk.level} (${report.risk.score}/100)</span> | Exploitability: ${report.risk.exploitability} | Impact: ${report.risk.impact}</p><hr>
<div class="section"><h2>📋 Summary</h2><ul><li>Resources scanned: ${report.resources_scanned}</li><li>Blobs analyzed: ${report.blobs_scanned}</li><li>Secrets found: ${report.findings.length}</li><li>Tech Confirmed: ${(report.tech.confirmed || []).join(", ") || "None"}</li><li>Tech Likely: ${(report.tech.likely || []).join(", ") || "None"}</li><li>Tech Inferred: ${(report.tech.inferred || []).join(", ") || "None"}</li><li>Rate limiting: ${report.rate_limit.detected ? "⚠️ Yes" : "✔ No"}</li></ul></div>
<div class="section"><h2>🔐 Secrets Found</h2>${report.findings.length === 0 ? "<p>None</p>" : report.findings.map(f => `<div class="finding finding-${f.severity >= 5 ? 'critical' : f.severity >= 4 ? 'high' : f.severity >= 3 ? 'medium' : 'low'}"><strong>${escapeHtml(f.label)}</strong> (severity ${f.severity}, confidence ${f.confidence}, validated: ${f.validated})<br><code>${escapeHtml(f.value)}</code><br><small>Sources: ${f.sources.join(", ")}</small> ${f.occurrences > 1 ? `<span class="badge">${f.occurrences}x</span>` : ""}</div>`).join("")}</div>
<div class="section"><h2>🌐 DNS & SSL</h2><p>IPs: ${[...(report.dns.a || []), ...(report.dns.aaaa || [])].join(", ")}</p><p>SSL Issuer: ${escapeHtml(report.ssl.issuer)}</p><p>SSL Expiry: ${escapeHtml(report.ssl.valid_to)}</p><p>SSL Valid: ${report.ssl.authorized ? "✔ Yes" : "❌ No"}</p></div>
<div class="section"><h2>🔄 Redirect Chain</h2>${report.redirect_chain.length === 0 ? "<p>None</p>" : report.redirect_chain.map(step => `<p>${step.status} → ${escapeHtml(step.url)}</p>`).join("")}</div>
</div></body></html>`;
  fs.writeFileSync(flags.html, html);
  console.log(chalk.green(`[+] HTML report saved to ${flags.html}`));
}
function escapeHtml(str) { return String(str).replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;'); }

// ================== POST-CRAWL CHECKS ==================
async function runPostCrawlChecks(report, baseUrl, resources, techSet) {
  const extraFindings = [];
  const apiUrls = resources.filter(r => r.url.includes("/api/") || r.url.includes("/v1/") || r.url.includes("/v2/")).map(r => r.url);
  for (const url of apiUrls.slice(0, 20)) {
    const cors = await checkCors(url);
    if (cors.vulnerable) {
      extraFindings.push({
        kind: "cors_misconfiguration",
        label: "CORS Misconfiguration",
        value: `${url} (ACAO: ${cors.acao})`,
        source: url,
        severity: 4,
        confidence: "high",
        validated: "UNVERIFIED",
        reason: "Reflective or wildcard CORS header",
      });
    }
  }
  const graphqlPaths = ["/graphql", "/api/graphql", "/v1/graphql", "/graphql/v1"];
  for (const path of graphqlPaths) {
    const url = new URL(path, baseUrl).href;
    const gql = await checkGraphQLIntrospection(url);
    if (gql.exposed) {
      extraFindings.push({
        kind: "graphql_introspection",
        label: "GraphQL Introspection Enabled",
        value: url,
        source: url,
        severity: 4,
        confidence: "high",
        validated: "VALIDATED",
        validationMethod: "POST __schema introspection",
        validationConfidence: "High",
        reason: "GraphQL schema is publicly exposed",
      });
    }
  }

  // Supabase REST validation
  if (techSet.has("Supabase")) {
    const supa = await checkSupabaseRest(baseUrl);
    if (supa.exposed) {
      extraFindings.push({
        kind: "supabase_rest_exposure",
        label: "Supabase PostgREST API Exposed",
        value: "Public unauthenticated access permitted",
        source: new URL("/rest/v1/", baseUrl).href,
        severity: 4,
        confidence: "high",
        validated: "VALIDATED",
        validationMethod: "GET /rest/v1/",
        validationConfidence: "High",
        reason: "Supabase REST layer is readable anonymously",
      });
    }
  }

  // Auth Behavior validation
  const authChecks = await checkAuthRoutes(resources);
  for (const chk of authChecks) {
    if (!chk.protected && chk.status === 200) {
      extraFindings.push({
        kind: "admin_endpoint_unprotected",
        label: "Admin / Internal Endpoint Unprotected",
        value: "Endpoint returned 200 OK without authentication",
        source: chk.url,
        severity: 4,
        confidence: "medium",
        validated: "UNVERIFIED", // Requires manual verification
        validationMethod: "GET without token",
        validationConfidence: "Medium",
        reason: "Sensitive endpoint lacks authentication check",
      });
    }
  }
  if (techSet.has("WordPress")) {
    const wp = await checkWordPressUserEnumeration(baseUrl);
    if (wp.exposed) {
      extraFindings.push({
        kind: "wp_user_enumeration",
        label: "WordPress User Enumeration",
        value: `${wp.count} users exposed via REST API`,
        source: `${baseUrl}/wp-json/wp/v2/users`,
        severity: 3,
        confidence: "medium",
        validated: "UNVERIFIED",
        reason: "User IDs and names are publicly accessible",
      });
    }
  }
  if (techSet.has("Next.js")) {
    const next = await checkNextJsEnvLeak(baseUrl);
    if (next.exposed) {
      extraFindings.push({
        kind: "nextjs_env_leak",
        label: "Next.js Environment Variables Leak",
        value: `Process.env references found in ${next.url}`,
        source: next.url,
        severity: 4,
        confidence: "high",
        validated: "UNVERIFIED",
        reason: "Environment variables embedded in client-side chunks",
      });
    }
  }
  return extraFindings;
}

// ================== CLASSIFICATION & SUMMARY ==================
function classifyEndpoint(url) {
  const lower = url.toLowerCase();
  if (lower.includes("/api/") || lower.includes("/v1/") || lower.includes("/v2/") || lower.includes("/v3/")) return "API";
  if (lower.includes("/auth") || lower.includes("/login") || lower.includes("/signin") || lower.includes("/oauth") || lower.includes("/token") || lower.includes("/session")) return "AUTH";
  if (lower.includes("/admin") || lower.includes("/dashboard") || lower.includes("/manage") || lower.includes("/console") || lower.includes("/control")) return "ADMIN";
  if (lower.includes(".js") || lower.includes(".css") || lower.includes(".png") || lower.includes(".jpg") || lower.includes(".svg") || lower.includes(".ico")) return "STATIC";
  if (lower.includes(".env") || lower.includes(".git") || lower.includes(".json") || lower.includes(".xml") || lower.includes(".yaml") || lower.includes(".yml") || lower.includes(".conf") || lower.includes("config")) return "CONFIG";
  if (lower.includes("/graphql") || lower.includes("/gql")) return "GRAPHQL";
  if (lower.includes("/sitemap") || lower.includes("/robots") || lower.includes("/manifest") || lower.includes("/swagger")) return "DISCOVERY";
  return "OTHER";
}
function buildAttackSurfaceSummary(resources, subdomains) {
  const endpoints = resources.map(r => r.url);
  const classified = resources.map(r => ({ url: r.url, type: r.type || classifyEndpoint(r.url) }));
  const apis = classified.filter(c => c.type === "API" || c.type === "INTERNAL_API").length;
  const auth = classified.filter(c => c.type === "AUTH").length;
  const admin = classified.filter(c => c.type === "ADMIN").length;
  const config = classified.filter(c => c.type === "CONFIG").length;
  const graphql = classified.filter(c => c.type === "GRAPHQL").length;
  const discovery = classified.filter(c => c.type === "DISCOVERY").length;
  return { subdomains: subdomains.length, totalEndpoints: endpoints.length, apis, auth, admin, config, graphql, discovery };
}
function buildPriorityTargets(findings, resources, subdomains) {
  const targets = [];
  for (const f of findings) {
    if (f.validated === "VALID" && f.severity >= 5) {
      targets.push({ type: "VALIDATED_SECRET", label: f.label, value: f.value, source: f.sources[0], severity: f.severity, confidence: f.confidence });
    }
  }
  const cls = (r) => r.type || classifyEndpoint(r.url);

  const authUrls = resources.filter(r => cls(r) === "AUTH").map(r => r.url);
  for (const url of authUrls.slice(0, 10)) targets.push({ type: "AUTH_ENDPOINT", label: "Authentication Endpoint", value: url, source: "Recon", severity: 4, confidence: "high" });

  const adminUrls = resources.filter(r => cls(r) === "ADMIN").map(r => r.url);
  for (const url of adminUrls.slice(0, 10)) targets.push({ type: "ADMIN_PANEL", label: "Admin Panel", value: url, source: "Recon", severity: 5, confidence: "high" });

  const internalUrls = resources.filter(r => cls(r) === "INTERNAL_API").map(r => r.url);
  for (const url of internalUrls.slice(0, 10)) targets.push({ type: "INTERNAL_API", label: "Internal API", value: url, source: "Recon", severity: 5, confidence: "high" });

  const sensitiveApis = resources.filter(r => r.url && (r.url.includes("/payment") || r.url.includes("/user") || r.url.includes("/profile") || r.url.includes("/order") || r.url.includes("/transaction"))).map(r => r.url);
  for (const url of sensitiveApis.slice(0, 10)) targets.push({ type: "SENSITIVE_API", label: "Sensitive API Endpoint", value: url, source: "Recon", severity: 4, confidence: "medium" });

  const graphqlUrls = resources.filter(r => cls(r) === "GRAPHQL").map(r => r.url);
  for (const url of graphqlUrls.slice(0, 5)) targets.push({ type: "GRAPHQL", label: "GraphQL Endpoint", value: url, source: "Recon", severity: 4, confidence: "medium" });

  const sensitiveFiles = resources.filter(r => r.url && r.url.match(/\.(env|git|config|json|yaml|yml|conf|log|sql|dump|zip|tar|gz|bak|backup)$/i)).map(r => r.url);
  for (const url of sensitiveFiles.slice(0, 10)) targets.push({ type: "SENSITIVE_FILE", label: "Sensitive File", value: url, source: "Recon", severity: 5, confidence: "high" });

  if (subdomains.length > 0) {
    targets.push({ type: "SUBDOMAINS", label: `Discovered Subdomains (${subdomains.length})`, value: subdomains.slice(0, 5).join(", "), source: "crt.sh", severity: 3, confidence: "medium" });
  }
  const seen = new Set();
  const unique = targets.filter(t => { const key = `${t.type}|${t.value}`; if (seen.has(key)) return false; seen.add(key); return true; });
  return unique.slice(0, 20);
}
function getTechRiskHints(techSet, unifiedEndpoints) {
  const hints = [];
  const endpointUrls = Array.from(unifiedEndpoints.keys());

  if (techSet.has("WordPress")) {
    const wpAdmin = endpointUrls.find(u => u.includes("/wp-admin"));
    const wpUsers = endpointUrls.find(u => u.includes("/wp-json/wp/v2/users"));
    if (wpAdmin) hints.push(`WordPress Admin panel exposed at: ${wpAdmin}`);
    if (wpUsers) hints.push(`WordPress user enumeration possible via: ${wpUsers}`);
  }

  if (techSet.has("Next.js") || techSet.has("React")) {
    const nextData = endpointUrls.find(u => u.includes("_next/data") || u.includes("_next/static"));
    const srcMap = endpointUrls.find(u => u.endsWith(".map"));
    if (nextData) hints.push(`Next.js build data exposed. Inspect ${nextData} for pre-rendered state.`);
    if (srcMap) hints.push(`Source maps found (${srcMap}). Highly likely to leak internal source code.`);
  }

  if (techSet.has("GraphQL")) {
    const gql = endpointUrls.find(u => u.toLowerCase().includes("graphql"));
    if (gql) hints.push(`GraphQL endpoint confirmed at ${gql}. Introspection checks recommended.`);
  }

  if (techSet.has("Netlify")) {
    const toml = endpointUrls.find(u => u.includes("netlify.toml"));
    if (toml) hints.push(`Netlify configuration found at ${toml}. May expose deployment variables.`);
  }

  return hints;
}

// ================== CLEANUP ==================
let shuttingDown = false;
async function cleanup() {
  if (shuttingDown) return;
  shuttingDown = true;
  // Clear health monitoring
  if (browserHealthInterval) {
    clearInterval(browserHealthInterval);
    browserHealthInterval = null;
  }
  // Kill browser gracefully
  await killBrowser();
}

// ================== FINAL PROCESSING PIPELINE ==================
async function finalizeAndOutput(rawData) {
  // Step 1: Ensure all URLs are normalized (already done during collection)
  // Step 2: Deduplicate using ReconStore (already done)
  // Step 3: Finalize technology scoring
  const finalTechs = new Map();
  for (const [name, tech] of ReconStore.technologies) {
    let totalConfidence = 0;
    let strongSignalCount = 0;
    let evidenceCount = (tech.evidence && tech.evidence.size) || 0;
    let maxWeight = 0;
    for (const ev of (tech.evidence || [])) {
      let weight = 0;
      if (STRONG_SIGNALS.has(ev)) {
        weight = 90;
        strongSignalCount++;
      } else {
        if (ev.includes("js")) weight = 40;
        else if (ev.includes("header")) weight = 60;
        else if (ev.includes("html")) weight = 40;
        else if (ev.includes("path")) weight = 30;
        else if (ev.includes("cookie")) weight = 50;
        else weight = 20;
      }
      if (weight > maxWeight) maxWeight = weight;
      totalConfidence += weight;
    }

    // Dynamic scoring logic: boost if corroborated, eliminate weak
    let finalConfidence = maxWeight + (evidenceCount > 1 ? (evidenceCount - 1) * 15 : 0);

    // Strict requirement: must have 1 strong OR 2+ medium signals.
    if (strongSignalCount === 0 && evidenceCount < 2) {
      finalConfidence = 0; // discard weak single signals
    }
    finalConfidence = Math.min(100, finalConfidence);
    if (finalConfidence > 0) {
      finalTechs.set(name, { ...tech, confidence: finalConfidence });
    }
  }
  // Resolve conflicts again
  const conflicts = [["WordPress", "Shopify"], ["Next.js", "Nuxt.js"]];
  for (const [a, b] of conflicts) {
    if (finalTechs.has(a) && finalTechs.has(b)) {
      if (finalTechs.get(a).confidence > finalTechs.get(b).confidence) finalTechs.delete(b);
      else if (finalTechs.get(b).confidence > finalTechs.get(a).confidence) finalTechs.delete(a);
    }
  }
  ReconStore.technologies = finalTechs;
  // Step 4: Merge intelligence data & Endpoints
  const intelligence = ReconStore.intelligence;

  const unifiedEndpoints = new Map();
  for (const r of rawData.resources) {
    unifiedEndpoints.set(r.url, { url: r.url, source: "Crawl", type: classifyEndpoint(r.url), confidence: 100, isDirect: true });
  }

  const addIntelEndpoint = (endpointStr, type) => {
    try {
      const u = new URL(endpointStr, targetUrl).href;
      const norm = normalizeUrl(u);
      if (!unifiedEndpoints.has(norm)) {
        unifiedEndpoints.set(norm, { url: norm, source: "Inferred", type, confidence: 60, isDirect: false });
      }
    } catch { }
  };

  if (intelligence.apis.user) intelligence.apis.user.forEach(e => addIntelEndpoint(e, "API"));
  if (intelligence.apis.admin) intelligence.apis.admin.forEach(e => addIntelEndpoint(e, "ADMIN"));
  if (intelligence.apis.internal) intelligence.apis.internal.forEach(e => addIntelEndpoint(e, "INTERNAL_API"));

  ReconStore.endpoints = unifiedEndpoints;

  // Step 5: False-positive filtering (already done globally via strict rules)

  // Step 6: Run final analysis
  const analysis = analyzeRisk(ReconStore.findings, intelligence);

  // Step 7: Generate output
  const surface = buildAttackSurfaceSummary([...unifiedEndpoints.values()], [...ReconStore.subdomains]);
  const priorityTargets = buildPriorityTargets(ReconStore.findings, [...unifiedEndpoints.values()], [...ReconStore.subdomains]);

  // Group technologies by category
  const groupedTechs = new Map();
  for (const [name, tech] of finalTechs) {
    const cat = tech.category || "Misc";
    if (!groupedTechs.has(cat)) groupedTechs.set(cat, []);
    groupedTechs.get(cat).push({
      name: tech.name,
      confidence: tech.confidence,
      evidence: Array.from(tech.evidence || [])
    });
  }

  // Also infer architecture from scan evidence as "Architecture" category
  const inferred = [];
  if (surface.apis > 0) inferred.push("API Backend");
  if (surface.auth > 0 || intelligence.auth) inferred.push("Auth System");
  if (surface.totalEndpoints > 0 && rawData.resources.some(r => r.url.endsWith(".js"))) inferred.push("SPA Architecture");
  if (inferred.length > 0) {
    if (!groupedTechs.has("Architecture")) groupedTechs.set("Architecture", []);
    for (const inf of inferred) {
      groupedTechs.get("Architecture").push({ name: inf, confidence: 60, evidence: ["Inferred from crawling behavior"] });
    }
  }

  // Sort categories and inside categories
  const sortedCategories = Array.from(groupedTechs.keys()).sort();

  const techHints = getTechRiskHints(new Set([...finalTechs.keys()]), unifiedEndpoints);
  const duration = ((Date.now() - ReconStore.meta.startTime) / 1000).toFixed(2);
  // Output the final report
  console.log("\n" + chalk.cyan("┌── Reconix Report ─────────────────────────┐"));
  console.log(`│ Target: ${target.hostname}`);
  console.log(`│ Scope: ${scopeHost}`);
  console.log(`│ Risk Level: ${chalk[analysis.verdict === "HIGH" ? "red" : analysis.verdict === "MEDIUM" ? "yellow" : "green"](analysis.verdict)} (${analysis.score}/100)`);
  console.log(`│ Exploitability: ${analysis.score} | Impact: ${analysis.score}`);
  console.log(chalk.cyan("├───────────────────────────────────────────┤"));
  console.log("│ Redirect Chain:");
  if (rawData.redirectChain.length === 0) console.log("│  None");
  else for (const step of rawData.redirectChain) console.log(`│  ${step.status} → ${truncate(step.url, 55)}`);
  console.log(chalk.cyan("├───────────────────────────────────────────┤"));
  const ipList = [...(rawData.dns.a || []), ...(rawData.dns.aaaa || [])];
  console.log(`│ IP: ${ipList.join(", ") || "N/A"}`);
  console.log(`│ SSL Expiry: ${rawData.ssl.valid_to || "Unknown"}`);
  console.log(`│ SSL Status: ${rawData.ssl.authorized ? "Valid" : "Invalid"}`);
  console.log(`│ Rate Limit: ${rawData.rateLimitDetected ? "Detected ⚠️" : "Not Detected ✔"}`);
  console.log(chalk.cyan("├───────────────────────────────────────────┤"));
  console.log(chalk.bold.cyan("│ 🧠 TECHNOLOGY STACK INTELLIGENCE"));
  if (sortedCategories.length === 0) {
    console.log(`│  ${chalk.gray("Unknown")}`);
  } else {
    for (const cat of sortedCategories) {
      console.log(`│\n│  ${chalk.bold.magenta(cat + ":")}`);
      const techs = groupedTechs.get(cat).sort((a, b) => b.confidence - a.confidence || a.name.localeCompare(b.name));

      for (const t of techs) {
        let confColorStr;
        let badge;
        if (t.confidence >= 90) { confColorStr = chalk.green; badge = "Confirmed ✅"; }
        else if (t.confidence >= 70) { confColorStr = chalk.yellow; badge = "Likely ⚠️"; }
        else { confColorStr = chalk.gray; badge = "Theoretical ❓"; }
        console.log(`│    ${chalk.cyan("•")} ${t.name} [Confidence: ${confColorStr(t.confidence + "% - " + badge)}]`);
        if (t.evidence && t.evidence.length > 0) {
          console.log(`│      ${chalk.gray("↳ Evidence:")}`);
          // limit evidence display to avoid spam, max 3
          for (const ev of t.evidence.slice(0, 3)) {
            console.log(`│        - ${chalk.gray(ev)}`);
          }
          if (t.evidence.length > 3) {
            console.log(`│        - ${chalk.gray(`...and ${t.evidence.length - 3} more signals`)}`);
          }
        }
      }
    }
  }
  console.log(`│`);
  console.log(chalk.cyan("├───────────────────────────────────────────┤"));
  console.log(`│ Resources: ${surface.totalEndpoints}`);
  console.log(`│ Scan Blobs: ${ReconStore.meta.totalBlobs}`);
  console.log(`│ Secrets Found: ${ReconStore.findings.length}`);
  console.log(chalk.cyan("├───────────────────────────────────────────┤"));
  console.log(chalk.bold.cyan("📊 Attack Surface Summary"));
  console.log(`│ Subdomains: ${surface.subdomains}`);
  console.log(`│ Total Endpoints: ${surface.totalEndpoints}`);
  console.log(`│ API Endpoints: ${surface.apis}`);
  console.log(`│ Authentication Endpoints: ${surface.auth}`);
  console.log(`│ Admin Panels: ${surface.admin}`);
  console.log(`│ Sensitive Config Files: ${surface.config}`);
  console.log(`│ GraphQL Endpoints: ${surface.graphql}`);
  console.log(`│ Discovery Files: ${surface.discovery}`);
  const critical = ReconStore.findings.filter(f => f.confidence === "high" && f.severity >= 5);
  if (critical.length > 0) {
    console.log(chalk.cyan("├───────────────────────────────────────────┤"));
    console.log(chalk.bold.red("🔥 CRITICAL FINDINGS (High confidence, High severity)"));
    for (const f of critical.slice(0, 12)) {
      const src = f.sources && f.sources.length ? f.sources[0] : f.source || "unknown";
      const extra = f.sources && f.sources.length > 1 ? chalk.gray(` (+${f.sources.length - 1} more)`) : "";
      const occurrence = f.occurrences > 1 ? chalk.gray(` (${f.occurrences}x)`) : "";

      let badge = chalk.gray(" ❓ Theoretical");
      if (f.validated === "VALID" || f.validated === "VALIDATED") badge = chalk.green(" ✅ Confirmed");
      else if (f.validated === "INVALID" || f.validated === "EXPIRED") badge = chalk.red(` ❌ ${f.validated}`);
      else if (f.confidence === "high" || f.validated === "UNVERIFIED") badge = chalk.yellow(" ⚠️ Likely");

      console.log(`│  ${chalk.red("→")} ${f.label}${badge}: ${truncate(f.value, 80)}`);
      console.log(`│    ${chalk.gray("Source:")}  ${truncate(src, 60)}${extra}${occurrence}`);
      if (f.reason || f.validationReason) {
        console.log(`│    ${chalk.gray("Reason:")}  ${f.reason || f.validationReason}`);
      }
      if (f.validationMethod && f.validationMethod !== "none") {
        console.log(`│    ${chalk.gray("Method:")}  ${f.validationMethod} | Confidence: ${f.validationConfidence || "unknown"}`);
      }
      console.log(`│    ${chalk.gray("Impact:")}  ${getSecretImpact(f.kind, f.validated)}`);
    }
    if (critical.length > 12) console.log(chalk.yellow(`│  + ${critical.length - 12} more critical findings...`));
  }
  const medium = ReconStore.findings.filter(f => (f.confidence === "high" || f.confidence === "medium") && f.severity >= 3 && f.severity <= 4);
  if (medium.length > 0) {
    console.log(chalk.cyan("├───────────────────────────────────────────┤"));
    console.log(chalk.bold.yellow("⚠️ MEDIUM FINDINGS (Moderate confidence / severity)"));
    for (const f of medium.slice(0, 8)) {
      const src = f.sources && f.sources.length ? f.sources[0] : f.source || "unknown";
      const extra = f.sources && f.sources.length > 1 ? chalk.gray(` (+${f.sources.length - 1} more)`) : "";
      const occurrence = f.occurrences > 1 ? chalk.gray(` (${f.occurrences}x)`) : "";

      let badge = chalk.gray(" ❓ Theoretical");
      if (f.validated === "VALID" || f.validated === "VALIDATED") badge = chalk.green(" ✅ Confirmed");
      else if (f.validated === "INVALID" || f.validated === "EXPIRED") badge = chalk.red(` ❌ ${f.validated}`);
      else if (f.confidence === "high" || f.validated === "UNVERIFIED") badge = chalk.yellow(" ⚠️ Likely");

      console.log(`│  ${chalk.yellow("→")} ${f.label}${badge}: ${truncate(f.value, 60)}`);
      console.log(`│    ${chalk.gray("Source:")}  ${truncate(src, 50)}${extra}${occurrence}`);
      if (f.reason || f.validationReason) {
        console.log(`│    ${chalk.gray("Reason:")}  ${f.reason || f.validationReason}`);
      }
      if (f.validationMethod && f.validationMethod !== "none") {
        console.log(`│    ${chalk.gray("Method:")}  ${f.validationMethod}`);
      }
    }
    if (medium.length > 8) console.log(chalk.yellow(`│  + ${medium.length - 8} more medium findings...`));
  }
  const low = ReconStore.findings.filter(f => f.confidence === "low");
  if (low.length > 0 && !flags.noLow) {
    console.log(chalk.cyan("├───────────────────────────────────────────┤"));
    console.log(chalk.bold.gray("💤 LOW CONFIDENCE FINDINGS (May be false positives)"));
    for (const f of low.slice(0, 5)) {
      const src = f.sources && f.sources.length ? f.sources[0] : f.source || "unknown";
      const extra = f.sources && f.sources.length > 1 ? chalk.gray(` (+${f.sources.length - 1} more)`) : "";
      const occurrence = f.occurrences > 1 ? chalk.gray(` (${f.occurrences}x)`) : "";
      console.log(`│  ${chalk.gray("→")} ${f.label}: ${truncate(f.value, 60)} ${chalk.gray(`[${truncate(src, 35)}]`)}${extra}${occurrence}`);
    }
    if (low.length > 5) console.log(chalk.gray(`│  + ${low.length - 5} more low confidence findings`));
  }
  if (priorityTargets.length > 0) {
    console.log(chalk.cyan("├───────────────────────────────────────────┤"));
    console.log(chalk.bold.magenta("🎯 PRIORITY TARGETS (Start Here)"));
    for (const target of priorityTargets.slice(0, 10)) console.log(`│  ${chalk.magenta("→")} ${target.label}: ${truncate(target.value, 75)}`);
    if (priorityTargets.length > 10) console.log(chalk.gray(`│  + ${priorityTargets.length - 10} more priority targets`));
  }
  if (techHints.length > 0) {
    console.log(chalk.cyan("├───────────────────────────────────────────┤"));
    console.log(chalk.bold.cyan("💡 Technology Risk Hints"));
    for (const hint of techHints.slice(0, 5)) console.log(`│  ${chalk.cyan("→")} ${hint}`);
  }
  console.log(chalk.cyan("├───────────────────────────────────────────┤"));
  console.log(chalk.bold.magenta("🧠 CLIENT EXPOSURE INTELLIGENCE"));
  if (intelligence.auth) {
    console.log(chalk.yellow("\nAUTH & SESSION:"));
    if (intelligence.auth.login) console.log(`│  → Login endpoint: ${intelligence.auth.login}`);
    if (intelligence.auth.storage) console.log(`│  → Token storage: ${intelligence.auth.storage}`);
    if (intelligence.auth.header) console.log(`│  → Auth header: ${intelligence.auth.header}`);
  } else console.log(chalk.gray("\nAUTH: No authentication patterns detected"));
  if (intelligence.apis.user.length || intelligence.apis.admin.length || intelligence.apis.internal.length) {
    console.log(chalk.yellow("\nAPI ENDPOINT INFERENCE:"));
    if (intelligence.apis.user.length) {
      console.log(`│  → USER (${getEndpointIntentHint("REST")}):`);
      console.log(`│    ${intelligence.apis.user.slice(0, 5).join(", ")}${intelligence.apis.user.length > 5 ? " ..." : ""}`);
    }
    if (intelligence.apis.admin.length) {
      console.log(`│  → ADMIN (${getEndpointIntentHint("ADMIN")}):`);
      console.log(`│    ${intelligence.apis.admin.slice(0, 5).join(", ")}${intelligence.apis.admin.length > 5 ? " ..." : ""}`);
    }
    if (intelligence.apis.internal.length) {
      console.log(`│  → INTERNAL (${getEndpointIntentHint("INTERNAL_API")}):`);
      console.log(`│    ${intelligence.apis.internal.slice(0, 5).join(", ")}${intelligence.apis.internal.length > 5 ? " ..." : ""}`);
    }
  }
  if (intelligence.services.size) {
    console.log(chalk.yellow("\nEXTERNAL SERVICES DETECTED:"));
    console.log(`│  → ${[...intelligence.services].join(", ")}`);
    const serviceHints = getServiceHints(intelligence, ReconStore.findings);
    if (serviceHints.length > 0) {
      console.log(chalk.cyan("\n🎯 Target Service Attack Hints:"));
      for (const sh of serviceHints) console.log(`│  → ${chalk.bold(sh.service)}: ${sh.hint}`);
    }
  }
  if (intelligence.env.size) {
    console.log(chalk.yellow("\nENV VARIABLES DETECTED:"));
    console.log(`│  → ${[...intelligence.env].slice(0, 10).join(", ")}${intelligence.env.size > 10 ? " ..." : ""}`);
  }
  if (intelligence.flags.size) {
    console.log(chalk.yellow("\nDEV/FEATURE FLAGS EXPOSED:"));
    console.log(`│  → ${[...intelligence.flags].slice(0, 10).join(", ")}${intelligence.flags.size > 10 ? " ..." : ""}`);
  }
  console.log(chalk.cyan("└───────────────────────────────────────────┘"));
  console.log(chalk.bold.green("\n✅ Scan Complete"));
  console.log(chalk.gray(`────────────────────────────────────────────`));
  console.log(`  Critical Findings: ${chalk.red(critical.length)}`);
  console.log(`  Medium Findings:   ${chalk.yellow(medium.length)}`);
  console.log(`  Low Findings:      ${chalk.gray(low.length)}`);
  console.log(`  APIs Discovered:   ${surface.apis}`);
  console.log(`  Subdomains:        ${surface.subdomains}`);
  console.log(`  Total Resources:   ${surface.totalEndpoints}`);
  console.log(`  Scan Duration:     ${duration}s`);
  console.log(`  Overall Risk:      ${chalk[analysis.verdict === "HIGH" ? "red" : analysis.verdict === "MEDIUM" ? "yellow" : "green"](analysis.verdict)} (${analysis.score}/100)`);
  console.log(chalk.gray(`────────────────────────────────────────────`));
  console.log(chalk.bold.cyan("\n[🧠 RECON ANALYSIS VERDICT]"));
  console.log(chalk.bold("Verdict: ") + chalk[analysis.verdict === "HIGH" ? "red" : analysis.verdict === "MEDIUM" ? "yellow" : "green"](analysis.verdict));
  if (analysis.reasons.length) {
    console.log("Risk Factors:");
    for (const reason of analysis.reasons) console.log(`  → ${reason}`);
  }

  const generatedChains = generateExploitChains(ReconStore.findings, intelligence);
  if (generatedChains.length > 0) {
    console.log(chalk.bold.red("\n[⚔️ EXPLOIT CHAIN BUILDER]"));
    console.log(chalk.gray("Evidence-based attack vectors inferred from your findings:"));
    for (const chain of generatedChains) {
      console.log(chalk.red(`\n>> ${chain.title}`));
      console.log(`   Impact: ${chalk.yellow(chain.impact)}`);
      if (chain.trigger && chain.trigger.conditions) {
        console.log(chalk.gray(`   Trigger Conditions:`));
        for (const cond of chain.trigger.conditions) console.log(`    • ${cond}`);
      }
      if (chain.flow) {
        console.log(chalk.gray(`   Attack Flow:`));
        for (const step of chain.flow) console.log(`    ${step}`);
      }
      if (chain.result) {
        console.log(`   ${chalk.bold("Result:")} ${chain.result}`);
      }
    }
  }

  if (ReconStore.findings.length) {
    const secretsFile = "discovered_api_keys.txt";
    const content = ReconStore.findings.map(f => {
      let line = `[${f.label}] ${f.value}`;
      line += `\n  Status: ${f.validated} | Severity: ${f.severity} | Confidence: ${f.confidence}`;
      if (f.validationReason) line += `\n  Reason: ${f.validationReason}`;
      if (f.validationMethod && f.validationMethod !== "none") line += `\n  Method: ${f.validationMethod} | Validation Confidence: ${f.validationConfidence}`;
      line += `\n  Sources: ${f.sources.join(", ")}`;
      return line;
    }).join("\n\n");
    fs.writeFileSync(secretsFile, content);
    console.log(chalk.green(`\n[+] All discovered secrets saved to ${secretsFile}`));
  }
  if (flags.output) {
    const exportReport = {
      target: targetUrl,
      scopeHost,
      timestamp: new Date().toISOString(),
      redirect_chain: rawData.redirectChain,
      dns: rawData.dns,
      ssl: rawData.ssl,
      rate_limit: { detected: rawData.rateLimitDetected, signals: rawData.rateLimitSignals },
      tech: {
        confirmed: confirmedTechs.map(t => `${t.name} (${t.category})`),
        likely: likelyTechs.map(t => `${t.name} (${t.category})`),
        inferred,
        all: [...finalTechs.keys()],
      },
      resources_scanned: surface.totalEndpoints,
      blobs_scanned: ReconStore.meta.totalBlobs,
      findings: ReconStore.findings,
      risk: { level: analysis.verdict, score: analysis.score, color: analysis.verdict === "HIGH" ? "red" : analysis.verdict === "MEDIUM" ? "yellow" : "green" },
      attackSurface: surface,
      priorityTargets,
      technologyHints: techHints,
      intelligence,
      analysis
    };
    fs.writeFileSync(flags.output, JSON.stringify(exportReport, null, 2));
    console.log(chalk.green(`[+] JSON report saved to ${flags.output}`));
  }
  if (flags.html) generateHtmlReport({ target: targetUrl, scopeHost, timestamp: new Date().toISOString(), risk: { level: analysis.verdict, score: analysis.score }, resources_scanned: surface.totalEndpoints, blobs_scanned: ReconStore.meta.totalBlobs, findings: ReconStore.findings, tech: [...finalTechs.keys()], rate_limit: { detected: rawData.rateLimitDetected }, dns: rawData.dns, ssl: rawData.ssl, redirect_chain: rawData.redirectChain, intelligence });
}

// ================== MAIN ==================
(async () => {
  const startTime = Date.now();
  ReconStore.meta.startTime = startTime;
  banner();
  console.log(chalk.gray("Use only on authorized targets\n"));
  // Initialize proxy if configured
  if (flags.proxy) {
    console.log(chalk.yellow("[•] Testing proxy connectivity..."));
    const proxyOk = await testProxy(flags.proxy);
    if (proxyOk) {
      proxyActive = true;
      console.log(chalk.green("[+] Proxy verified and active"));
    } else {
      proxyActive = false;
      console.log(chalk.yellow("[⚠] Proxy unreachable — falling back to direct connection"));
    }
  }
  // Start browser health monitoring
  if (flags.js && puppeteer) {
    startBrowserHealthMonitor();
  }
  let subdomains = [];
  if (flags.subdomains) subdomains = await discoverSubdomains(scopeHost);
  subdomains.forEach(s => ReconStore.subdomains.add(s));
  const subdomainSeeds = subdomains.map(s => `https://${s}`);
  let historicalUrls = [];
  if (flags.historical) historicalUrls = await fetchHistoricalUrls(scopeHost);
  let redirectChain = [];
  let dns = {};
  let ssl = {};
  let rateLimitDetected = false;
  let rateLimitSignals = [];
  console.log(chalk.yellow("[•] Redirect analysis..."));
  redirectChain = await getRedirectChain(targetUrl);
  console.log(chalk.yellow("[•] DNS and certificate analysis..."));
  dns = await getDnsSummary(rootHost);
  ssl = await getSslInfo(rootHost);
  console.log(chalk.yellow("[•] Crawling same-site resources..."));
  const crawlResult = await crawlScope(targetUrl, scopeHost, flags, subdomainSeeds);
  ReconStore.meta.totalRequests = crawlResult.resources.length;
  let historicalBlobs = [];
  if (flags.historical && historicalUrls.length) {
    console.log(chalk.yellow("[•] Fetching historical archived content..."));
    let histCount = 0;
    for (const url of historicalUrls.slice(0, flags.aggressive ? 500 : 200)) {
      await lightDelay();
      const archived = await fetchArchivedContent(url);
      if (archived && archived.body) {
        historicalBlobs.push({ source: `${url}::archive[latest]`, kind: "historical", text: archived.body, headers: archived.headers, status: archived.status, url });
      }
      histCount++;
      if (histCount % 20 === 0) renderProgress("Historical", histCount, Math.min(flags.aggressive ? 500 : 200, historicalUrls.length));
    }
    if (historicalUrls.length > (flags.aggressive ? 500 : 200)) console.log(chalk.gray(`\n[•] Limited to first ${flags.aggressive ? 500 : 200} historical URLs`));
    console.log();
  }
  const dnsTxtBlobs = (dns.txt || []).map((txt, idx) => ({ source: `${rootHost}::dns-txt[${idx + 1}]`, kind: "dns-txt", text: txt, headers: {}, status: 200, url: `${targetUrl}::dns-txt` }));
  const scanCorpus = [...crawlResult.blobs, ...dnsTxtBlobs, ...historicalBlobs];
  ReconStore.meta.totalBlobs = scanCorpus.length;
  console.log(chalk.yellow("[•] Deep secret and tech scanning..."));
  const { findingsMap, techMap: detectedTechMap } = await scanBlobs(scanCorpus, flags);
  for (const [name, tech] of detectedTechMap) addUnique(ReconStore.technologies, name, tech);
  console.log(chalk.yellow("[•] Running post-crawl checks (CORS, GraphQL, tech-specific)..."));
  const extraFindings = await runPostCrawlChecks(null, targetUrl, crawlResult.resources, new Set(detectedTechMap.keys()));
  for (const ef of extraFindings) addFinding(findingsMap, ef);
  let findings = await finalizeFindingsWithValidation(findingsMap);
  if (flags.onlyCritical) findings = findings.filter(f => f.confidence === "high" && f.severity >= 5);
  else if (flags.noLow) findings = findings.filter(f => f.confidence !== "low");
  else if (!flags.includeMedium) findings = findings.filter(f => f.confidence === "high");
  ReconStore.findings = findings;
  for (const f of findings) addUnique(ReconStore.secrets, f.value, f);
  rateLimitSignals = collectRateLimitSignals(crawlResult.resources);
  rateLimitDetected = rateLimitSignals.length > 0;
  console.log(chalk.yellow("[•] Extracting client exposure intelligence..."));
  const intelligence = extractClientIntelligence(scanCorpus);
  ReconStore.intelligence = intelligence;
  // Final pipeline: process and output
  await finalizeAndOutput({
    resources: crawlResult.resources,
    redirectChain,
    dns,
    ssl,
    rateLimitDetected,
    rateLimitSignals
  });
  await cleanup();
  process.exit(0);
})()
  .catch(console.error);