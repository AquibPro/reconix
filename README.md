````markdown
# Reconix

<div align="center">

**Reconnaissance Intelligence Engine | Leak Scanner | Threat Intelligence Suite**

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0-brightgreen)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-RECONIX-blue)](LICENSE.txt)

**🔍 Deep Exposure Intelligence • ⚡ High-Signal Recon Engine**

</div>

---

## ⚠️ LEGAL DISCLAIMER

**Reconix is designed EXCLUSIVELY for authorized security testing, bug bounty programs, and defensive research.**

- ✅ **DO** scan targets you own
- ✅ **DO** scan targets with explicit written permission
- ✅ **DO** use in CTF competitions
- ❌ **DO NOT** scan systems without authorization
- ❌ **DO NOT** use for malicious purposes

**Unauthorized scanning is illegal and punishable under computer fraud laws.**  
Read the full disclaimer in [DISCLAIMER.md](./DISCLAIMER.md).

---

## 🔥 What Makes Reconix Powerful

Unlike basic scanners that just regex-match and dump findings, Reconix:

- **Validates secrets live** — Calls actual APIs (GitHub, Stripe, OpenAI, Supabase, SendGrid, Anthropic, HuggingFace, Linear) to confirm if keys are **VALID**, **INVALID**, **EXPIRED**, or **LONG-LIVED** — no more guessing if a key actually works

- **Builds exploit chains** — Automatically connects related findings into actionable attack paths like "JWT + Supabase + API endpoints → Unauthorized data access" or "Validated secret + Admin panel → Privilege escalation"

- **Filters false positives with 10-layer analysis** — Ignores React internals, CSS classes, documentation URLs, placeholders, and minified junk that other tools falsely report as secrets

- **Reconstructs source maps** — Recovers original source code from `.map` files and inline source maps, then scans the reconstructed code for secrets hidden in minified bundles

- **Self-healing browser** — Automatically detects and restarts crashed Puppeteer instances mid-scan without losing progress

- **Extracts client intelligence** — Aggregates all JavaScript to find API endpoints (user/admin/internal), environment variables (`NEXT_PUBLIC_*`, `REACT_APP_*`), third-party services (Supabase, Stripe, Firebase, Clerk), and feature flags

- **Priority-driven crawling** — Intelligently scores URLs (JS files, APIs, source maps first) to find high-value targets before wasting time on static assets

- **Live JWT introspection** — Decodes JWTs to reveal issuer, role, and expiry — flags **LONG-LIVED** (1+ year) and **NO EXPIRY** tokens as security concerns

- **Supabase service_role detection** — Identifies when a JWT has `service_role` privileges, which bypasses all Row Level Security (RLS) — critical database compromise path

- **Firebase Realtime DB testing** — Detects Firebase credentials and tests if `/.json` endpoint allows unauthenticated database dumps

- **GraphQL introspection detection** — Automatically probes `/graphql` endpoints to check if schema introspection is enabled (information leak)

- **CORS misconfiguration scanning** — Checks API endpoints for wildcard (`*`) or reflective `Access-Control-Allow-Origin` headers

- **WordPress user enumeration** — Detects when `/wp-json/wp/v2/users` exposes user IDs and names

- **Next.js environment variable leakage** — Scans `/_next/static/chunks/` for embedded `process.env` references in client bundles

- **Archive digging** — Fetches historical URLs from Wayback Machine and scans archived content for secrets that were removed from the live site

- **Proxy failover** — Automatically falls back to direct connection after 3 consecutive proxy failures, so scans don't die

- **Resumable scans** — Saves state every 10 resources and can resume from `.reconix-state.json` if interrupted

- **Multi-format reporting** — Generates beautiful HTML reports, structured JSON exports, and plaintext `discovered_api_keys.txt` for quick reference

- **150+ technology fingerprints** — Detects frameworks, hosting providers, CDNs, analytics, payment processors, auth systems, and UI libraries from headers, HTML, JS, cookies, TLS certs, and DNS

- **Browser network capture** — When `--js` is enabled, captures all outgoing network requests to fingerprint additional services and APIs

- **Rate limit awareness** — Detects 429 responses and `Retry-After` headers, adjusts accordingly without crashing

---

## 📦 Installation

```bash
# Global installation
npm install -g reconix

# Or run directly
npx reconix target.com

# Verify everything works
reconix --self-test
````

### Requirements

* Node.js 18 or higher
* Internet access
* Chrome/Chromium (installed automatically for `--js` mode)

---

## 🚀 Quick Start

```bash
# Basic scan (low footprint)
reconix example.com

# Full power (maximum findings)
reconix example.com --js --aggressive --deep --only-critical

# Bug bounty mode (balanced)
reconix target.com --js --deep --historical --delay=500 --output=report.json

# Stealth mode (avoid detection)
reconix target.com --delay=2000 --jitter=1000 --threads=5 --proxy=socks5://127.0.0.1:9050
```

---

## 📖 Full Command Reference

### Basic Usage

```bash
reconix <url> [options]
reconix scan <url> [options]
```

---

### 🎨 Output & Reporting

| Flag              | Description             | Default |
| ----------------- | ----------------------- | ------- |
| `--output=<file>` | Save full JSON report   | None    |
| `--html=<file>`   | Generate HTML report    | None    |

```bash
reconix example.com --output=scan.json --html=report.html
```

---

### 🔍 Discovery & Reconnaissance

| Flag              | Description                 | Default |
| ----------------- | --------------------------- | ------- |
| `--no-subdomains` | Disable subdomain discovery | -       |
| `--historical`    | Fetch archived URLs         | false   |
| `--deep`          | Increase crawl depth        | false   |

```bash
reconix example.com --historical --deep
```

---

### 🧠 Scanning Engine

| Flag                  | Description                 | Default |
| --------------------- | --------------------------- | ------- |
| `--threads=<n>`       | Concurrent requests (1–100) | 20      |
| `--delay=<ms>`        | Base delay between requests | 500     |
| `--jitter=<ms>`       | Random delay variation      | 300     |
| `--max-bytes=<bytes>` | Max download size per file  | 4000000 |
| `--resume`            | Resume previous scan        | false   |

```bash
# Fast but risky
reconix example.com --threads=50 --delay=100 --jitter=50

# Polite crawling
reconix example.com --threads=10 --delay=2000 --jitter=1000
```

---

### 🔥 Advanced Features

* `--no-js` → Disable headless browser (Puppeteer)
* `--aggressive` → Deep full-scope scan
* `--proxy=<host:port>` → Proxy support
* `--auth=<user:pass>` → Authentication (Basic or Bearer)
* `--cookie=<string>` → Custom cookies
* `--user-agent=<string>` → Custom user-agent

```bash
# Authenticated scan
reconix api.example.com --auth="Bearer:sk_live_xxx" --js

# Proxy usage
reconix example.com --proxy="http://user:pass@proxy:8080" --delay=1000
```

---

### 🎯 Finding Filters

| Flag               | Description                  | Default |
| ------------------ | ---------------------------- | ------- |
| `--only-critical`  | Show only critical findings  | false   |
| `--no-low`         | Hide low-confidence findings | false   |
| `--include-medium` | Include medium findings      | true    |
| `--no-medium`      | Exclude medium findings      | -       |

```bash
reconix example.com --only-critical --no-low
```

---

## 🎯 Use Cases

### 1. Bug Bounty (Balanced)

```bash
reconix target.com --deep --historical --threads=25 --delay=500 --output=bounty.json --html=report.html
```

### 2. Maximum Findings (Most Powerful)

```bash
reconix target.com --aggressive --deep --historical --threads=50 --delay=150 --jitter=50 --only-critical --output=full.json --html=full.html
```

### 3. Stealth Mode

```bash
reconix target.com --threads=5 --delay=2000 --jitter=1500 --no-subdomains --proxy=socks5://127.0.0.1:9050
```

### 4. Fast Triage

```bash
reconix target.com --threads=30 --delay=200 --no-js --no-subdomains --only-critical
```

---

## 🛡️ Rate Limiting & WAF Avoidance

| Target Type | Threads | Delay     | Jitter | JS |
| ----------- | ------- | --------- | ------ | -- |
| Production  | 5–10    | 2000–3000 | 1000   | ❌  |
| Staging     | 15–20   | 800–1200  | 500    | ✅  |
| Bug Bounty  | 20–30   | 400–600   | 200    | ✅  |
| CTF / Lab   | 50–100  | 0–100     | 0      | ✅  |

---

## 📊 What Reconix Reports

### Technology Stack

* Confirmed (90%+)
* Likely (70–89%)
* Theoretical (<70%)

### Secrets & Credentials

* VALID
* INVALID
* LONG-LIVED
* NO EXPIRY
* UNVERIFIED

### Client Intelligence

* API endpoints
* Environment variables
* External services
* Authentication mechanisms

### Exploit Chains

* JWT + API → Unauthorized access
* API key → Third-party abuse
* Firebase credentials → Database exposure

---

## 🧪 Self-Test Mode

```bash
reconix --self-test
```

---

## 💡 Pro Tips

```bash
# Phase 1: Quick recon
reconix target.com --only-critical

# Phase 2: Deep analysis
reconix target.com --deep --delay=1000

# Phase 3: Aggressive scan
reconix target.com --aggressive --deep --only-critical
```

---

## 🚨 Common Issues & Solutions

| Issue               | Solution                       |
| ------------------- | ------------------------------ |
| Browser timeout     | Reinstall Puppeteer            |
| Too many open files | Reduce threads                 |
| Proxy failed        | Check proxy URL                |
| Rate limited (429)  | Increase delay & jitter        |
| No findings         | Use `--js --deep --historical` |

---

## 📁 Output Files

| File                      | Description       |
| ------------------------- | ----------------- |
| `discovered_api_keys.txt` | All secrets found |
| `*.json`                  | Full scan report  |
| `*.html`                  | Visual report     |
| `.reconix-state.json`     | Resume state      |

---

## 🤝 Contributing

Issues and pull requests are welcome.

```bash
reconix --self-test
```

---

## 📄 License

See LICENSE.txt

---

<div align="center">

⚠️ USE RESPONSIBLY. ONLY ON AUTHORIZED TARGETS. ⚠️

</div>
```
