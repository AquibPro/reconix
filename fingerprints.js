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

  // ═══════════════ EXPANDED FINGERPRINTS (NEW) ═══════════════

  // -------------------- CLOUD & INFRASTRUCTURE --------------------
  {
    name: "AWS S3", category: "Cloud Storage", patterns: {
      headers: [{ v: "x-amz-bucket-region", c: 95 }, { v: "x-amz-request-id", c: 90 }],
      network: [{ v: ".s3.amazonaws.com", c: 90 }, { v: ".s3.us-west-", c: 85 }]
    }
  },
  {
    name: "AWS API Gateway", category: "API Gateway", patterns: {
      headers: [{ v: "x-amzn-requestid", c: 95 }, { v: "x-amz-apigw-id", c: 95 }],
      network: [{ v: ".amazonaws.com/", c: 70 }]
    }
  },
  {
    name: "AWS Lambda", category: "Serverless", patterns: {
      headers: [{ v: "x-amzn-trace-id", c: 95 }, { v: "x-amzn-lambda-", c: 95 }],
      network: [{ v: ".lambda-url.", c: 95 }]
    }
  },
  {
    name: "AWS Amplify", category: "Hosting", patterns: {
      js: [{ v: "aws-amplify", c: 95 }, { v: "Amplify.configure", c: 90 }],
      network: [{ v: "amplifyapp.com", c: 95 }]
    }
  },
  {
    name: "AWS Cognito", category: "Auth", patterns: {
      js: [{ v: "amazon-cognito-identity-js", c: 95 }, { v: "CognitoUserPool", c: 90 }],
      network: [{ v: "cognito-idp.", c: 95 }, { v: "amazoncognito.com", c: 95 }]
    }
  },
  {
    name: "AWS WAF", category: "Security", patterns: {
      headers: [{ v: "x-amzn-waf-", c: 95 }],
      cookies: [{ v: "aws-waf-token", c: 95 }]
    }
  },
  {
    name: "GCP Cloud Functions", category: "Serverless", patterns: {
      headers: [{ v: "x-cloud-trace-context", c: 95 }],
      network: [{ v: "cloudfunctions.net", c: 95 }]
    }
  },
  {
    name: "GCP Cloud Run", category: "Serverless", patterns: {
      headers: [{ v: "x-cloud-trace-context", c: 90 }],
      network: [{ v: ".run.app", c: 95 }]
    }
  },
  {
    name: "GCP Firebase", category: "Backend Service", patterns: {
      network: [{ v: "firebaseio.com", c: 95 }, { v: "firebaseapp.com", c: 95 }]
    }
  },
  {
    name: "Azure App Service", category: "Hosting", patterns: {
      headers: [{ v: "x-ms-request-id", c: 90 }, { v: "x-azure-ref", c: 95 }],
      network: [{ v: ".azurewebsites.net", c: 95 }]
    }
  },
  {
    name: "Azure Functions", category: "Serverless", patterns: {
      network: [{ v: ".azurewebsites.net/api/", c: 85 }],
      headers: [{ v: "x-ms-request-id", c: 80 }]
    }
  },
  {
    name: "Azure Storage", category: "Cloud Storage", patterns: {
      headers: [{ v: "x-ms-request-id", c: 85 }, { v: "x-ms-version", c: 85 }],
      network: [{ v: ".blob.core.windows.net", c: 95 }]
    }
  },
  {
    name: "Azure CDN", category: "CDN", patterns: {
      headers: [{ v: "x-azure-ref", c: 90 }],
      network: [{ v: ".azureedge.net", c: 95 }]
    }
  },
  {
    name: "Azure Front Door", category: "CDN", patterns: {
      headers: [{ v: "x-azure-ref", c: 95 }],
      network: [{ v: ".azurefd.net", c: 95 }]
    }
  },

  // -------------------- WAF & SECURITY LAYERS --------------------
  {
    name: "Cloudflare WAF", category: "Security", patterns: {
      headers: [{ v: "cf-ray", c: 95 }, { v: "cf-chl-", c: 95 }],
      cookies: [{ v: "__cf_chl_", c: 95 }, { v: "cf_clearance", c: 95 }]
    }
  },
  {
    name: "Imperva", category: "Security", patterns: {
      headers: [{ v: "x-cdn: Imperva", c: 95 }, { v: "x-iinfo", c: 95 }],
      cookies: [{ v: "visid_incap_", c: 95 }, { v: "incap_ses_", c: 95 }]
    }
  },
  {
    name: "F5 BIG-IP", category: "Load Balancer", patterns: {
      headers: [{ v: "server: BigIP", c: 95 }],
      cookies: [{ v: "BIGipServer", c: 95 }, { v: "f5-cookie", c: 95 }]
    }
  },
  {
    name: "Barracuda WAF", category: "Security", patterns: {
      headers: [{ v: "barracuda", c: 90 }],
      cookies: [{ v: "barracuda_", c: 95 }]
    }
  },
  {
    name: "Sucuri", category: "Security", patterns: {
      headers: [{ v: "x-sucuri-id", c: 95 }, { v: "x-sucuri-cache", c: 90 }]
    }
  },
  {
    name: "Incapsula", category: "Security", patterns: {
      headers: [{ v: "x-iinfo", c: 95 }, { v: "x-cdn: Incapsula", c: 95 }]
    }
  },
  {
    name: "Distil Networks", category: "Bot Protection", patterns: {
      headers: [{ v: "x-distil", c: 95 }]
    }
  },
  {
    name: "DataDome", category: "Bot Protection", patterns: {
      headers: [{ v: "x-datadome", c: 95 }],
      network: [{ v: "datadome.co", c: 95 }]
    }
  },
  {
    name: "Akamai Bot Manager", category: "Bot Protection", patterns: {
      headers: [{ v: "x-akamai-request-id", c: 90 }],
      cookies: [{ v: "ak_bmsc", c: 95 }]
    }
  },

  // -------------------- BACKEND FRAMEWORKS (MODERN) --------------------
  {
    name: "FastAPI", category: "Backend", patterns: {
      headers: [{ v: "server: uvicorn", c: 95 }, { v: "x-powered-by: FastAPI", c: 95 }],
      paths: [{ v: "/docs", c: 70 }, { v: "/openapi.json", c: 85 }]
    }
  },
  {
    name: "Flask", category: "Backend", patterns: {
      headers: [{ v: "server: Werkzeug", c: 95 }],
      cookies: [{ v: "session=", c: 70 }]
    }
  },
  {
    name: "NestJS", category: "Backend", patterns: {
      headers: [{ v: "x-powered-by: NestJS", c: 95 }],
      cookies: [{ v: "nest_session", c: 90 }]
    }
  },
  {
    name: "Spring Boot", category: "Backend", patterns: {
      headers: [{ v: "x-application-context", c: 90 }],
      paths: [{ v: "/actuator", c: 85 }, { v: "/swagger-ui.html", c: 75 }],
      cookies: [{ v: "JSESSIONID", c: 70 }]
    }
  },
  {
    name: "Gin (Go)", category: "Backend", patterns: {
      headers: [{ v: "x-powered-by: Gin", c: 95 }]
    }
  },
  {
    name: "Echo (Go)", category: "Backend", patterns: {
      headers: [{ v: "x-powered-by: Echo", c: 95 }]
    }
  },
  {
    name: "Koa", category: "Backend", patterns: {
      headers: [{ v: "x-powered-by: koa", c: 90 }]
    }
  },
  {
    name: "AdonisJS", category: "Backend", patterns: {
      headers: [{ v: "x-powered-by: AdonisJS", c: 95 }]
    }
  },
  {
    name: "Symfony", category: "Backend", patterns: {
      cookies: [{ v: "symfony", c: 90 }],
      headers: [{ v: "x-debug-token", c: 70 }]
    }
  },
  {
    name: "Yii", category: "Backend", patterns: {
      cookies: [{ v: "YII_CSRF_TOKEN", c: 95 }]
    }
  },
  {
    name: "CodeIgniter", category: "Backend", patterns: {
      cookies: [{ v: "ci_session", c: 95 }]
    }
  },
  {
    name: "CakePHP", category: "Backend", patterns: {
      cookies: [{ v: "CAKEPHP", c: 95 }]
    }
  },
  {
    name: "Phoenix (Elixir)", category: "Backend", patterns: {
      headers: [{ v: "x-powered-by: Phoenix", c: 95 }],
      cookies: [{ v: "_phoenix_key", c: 95 }]
    }
  },

  // -------------------- DEV/DEBUG EXPOSURES --------------------
  {
    name: "Spring Boot Actuator", category: "Dev Exposure", patterns: {
      paths: [{ v: "/actuator/health", c: 95 }, { v: "/actuator/env", c: 95 }]
    }
  },
  {
    name: "Django Debug Mode", category: "Dev Exposure", patterns: {
      html: [{ v: "You're seeing this error because you have <code>DEBUG = True</code>", c: 95 }],
      headers: [{ v: "x-django-debug", c: 95 }]
    }
  },
  {
    name: "Laravel Debugbar", category: "Dev Exposure", patterns: {
      html: [{ v: "laravel-debugbar", c: 95 }],
      js: [{ v: "phpdebugbar", c: 95 }]
    }
  },
  {
    name: "Symfony Profiler", category: "Dev Exposure", patterns: {
      cookies: [{ v: "sf_redirect", c: 85 }],
      paths: [{ v: "/_profiler", c: 95 }]
    }
  },
  {
    name: "PHP Debug Bar", category: "Dev Exposure", patterns: {
      js: [{ v: "phpdebugbar", c: 95 }],
      html: [{ v: "phpdebugbar", c: 90 }]
    }
  },
  {
    name: "GraphQL Playground", category: "Dev Exposure", patterns: {
      paths: [{ v: "/graphql", c: 60 }],
      html: [{ v: "GraphQL Playground", c: 95 }]
    }
  },
  {
    name: "GraphiQL", category: "Dev Exposure", patterns: {
      html: [{ v: "GraphiQL", c: 95 }],
      paths: [{ v: "/graphiql", c: 90 }]
    }
  },
  {
    name: "Flask Debug Toolbar", category: "Dev Exposure", patterns: {
      html: [{ v: "flask-debugtoolbar", c: 95 }]
    }
  },

  // -------------------- API EXPOSURE PATTERNS --------------------
  {
    name: "Swagger UI", category: "API Docs", patterns: {
      paths: [{ v: "/swagger", c: 80 }, { v: "/swagger-ui", c: 85 }],
      html: [{ v: "swagger-ui", c: 95 }]
    }
  },
  {
    name: "Redoc", category: "API Docs", patterns: {
      paths: [{ v: "/redoc", c: 85 }],
      html: [{ v: "redoc", c: 95 }]
    }
  },
  {
    name: "RapiDoc", category: "API Docs", patterns: {
      html: [{ v: "rapidoc", c: 95 }]
    }
  },
  {
    name: "Postman Collection", category: "API Docs", patterns: {
      paths: [{ v: "/postman/collection", c: 90 }]
    }
  },
  {
    name: "GraphQL Endpoint", category: "API", patterns: {
      paths: [{ v: "/graphql", c: 80 }, { v: "/v1/graphql", c: 85 }],
      headers: [{ v: "x-powered-by: GraphQL", c: 70 }]
    }
  },
  {
    name: "REST HATEOAS", category: "API", patterns: {
      headers: [{ v: "link: <", c: 60 }],
      html: [{ v: "_links", c: 70 }]
    }
  },

  // -------------------- CI/CD & DEVOPS --------------------
  {
    name: "GitHub Actions", category: "CI/CD", patterns: {
      headers: [{ v: "x-github-request-id", c: 90 }],
      network: [{ v: "actions.githubusercontent.com", c: 95 }]
    }
  },
  {
    name: "GitLab CI", category: "CI/CD", patterns: {
      headers: [{ v: "x-gitlab-ci", c: 95 }]
    }
  },
  {
    name: "Jenkins", category: "CI/CD", patterns: {
      headers: [{ v: "x-jenkins", c: 95 }],
      paths: [{ v: "/jenkins/", c: 90 }, { v: "/job/", c: 85 }]
    }
  },
  {
    name: "CircleCI", category: "CI/CD", patterns: {
      network: [{ v: "circleci.com", c: 95 }]
    }
  },
  {
    name: "Travis CI", category: "CI/CD", patterns: {
      network: [{ v: "travis-ci.com", c: 95 }]
    }
  },
  {
    name: "TeamCity", category: "CI/CD", patterns: {
      headers: [{ v: "x-teamcity", c: 95 }],
      paths: [{ v: "/teamcity/", c: 90 }]
    }
  },
  {
    name: "Drone CI", category: "CI/CD", patterns: {
      headers: [{ v: "x-drone", c: 95 }]
    }
  },
  {
    name: "Bamboo", category: "CI/CD", patterns: {
      paths: [{ v: "/bamboo/", c: 90 }],
      headers: [{ v: "x-atlassian-bamboo", c: 95 }]
    }
  },
  {
    name: "ArgoCD", category: "CI/CD", patterns: {
      paths: [{ v: "/argocd/", c: 90 }],
      headers: [{ v: "x-argocd", c: 95 }]
    }
  },
  {
    name: "Spinnaker", category: "CI/CD", patterns: {
      paths: [{ v: "/spinnaker/", c: 90 }]
    }
  },
  {
    name: "Codefresh", category: "CI/CD", patterns: {
      network: [{ v: "codefresh.io", c: 95 }]
    }
  },
  {
    name: "Buddy", category: "CI/CD", patterns: {
      network: [{ v: "buddy.works", c: 95 }]
    }
  },

  // -------------------- MODERN SAAS TOOLS --------------------
  {
    name: "Resend", category: "Email", patterns: {
      js: [{ v: "resend", c: 85 }, { v: "@resend/react-email", c: 95 }],
      network: [{ v: "resend.com", c: 95 }]
    }
  },
  {
    name: "Loops", category: "Email", patterns: {
      js: [{ v: "loops.so", c: 90 }],
      network: [{ v: "loops.so", c: 95 }]
    }
  },
  {
    name: "Novu", category: "Notifications", patterns: {
      js: [{ v: "@novu/node", c: 95 }],
      network: [{ v: "novu.co", c: 95 }]
    }
  },
  {
    name: "Knock", category: "Notifications", patterns: {
      js: [{ v: "@knocklabs/client", c: 95 }],
      network: [{ v: "knock.app", c: 95 }]
    }
  },
  {
    name: "Courier", category: "Notifications", patterns: {
      network: [{ v: "courier.com", c: 95 }]
    }
  },
  {
    name: "Upstash", category: "Database", patterns: {
      js: [{ v: "@upstash/redis", c: 95 }],
      network: [{ v: "upstash.com", c: 95 }]
    }
  },
  {
    name: "Turso", category: "Database", patterns: {
      js: [{ v: "@libsql/client", c: 95 }],
      network: [{ v: "turso.io", c: 95 }]
    }
  },
  {
    name: "Xata", category: "Database", patterns: {
      js: [{ v: "@xata.io/client", c: 95 }],
      network: [{ v: "xata.io", c: 95 }]
    }
  },
  {
    name: "Convex", category: "Backend Service", patterns: {
      js: [{ v: "convex", c: 90 }],
      network: [{ v: "convex.cloud", c: 95 }]
    }
  },
  {
    name: "Liveblocks", category: "Realtime", patterns: {
      js: [{ v: "@liveblocks/client", c: 95 }],
      network: [{ v: "liveblocks.io", c: 95 }]
    }
  },
  {
    name: "Replicache", category: "Sync", patterns: {
      js: [{ v: "replicache", c: 95 }]
    }
  },
  {
    name: "Tinybird", category: "Analytics", patterns: {
      network: [{ v: "tinybird.co", c: 95 }]
    }
  },
  {
    name: "Vapi", category: "AI", patterns: {
      js: [{ v: "@vapi-ai/web", c: 95 }]
    }
  },
  {
    name: "Retell AI", category: "AI", patterns: {
      js: [{ v: "retell", c: 90 }]
    }
  },

  // -------------------- AI/ML INTEGRATIONS --------------------
  {
    name: "OpenAI", category: "AI", patterns: {
      js: [{ v: "openai", c: 80 }, { v: "createChatCompletion", c: 85 }, { v: "gpt-3.5", c: 80 }],
      network: [{ v: "api.openai.com", c: 95 }]
    }
  },
  {
    name: "Anthropic", category: "AI", patterns: {
      js: [{ v: "@anthropic-ai/sdk", c: 95 }],
      network: [{ v: "api.anthropic.com", c: 95 }]
    }
  },
  {
    name: "Cohere", category: "AI", patterns: {
      js: [{ v: "cohere-ai", c: 90 }],
      network: [{ v: "api.cohere.ai", c: 95 }]
    }
  },
  {
    name: "LangChain", category: "AI", patterns: {
      js: [{ v: "langchain", c: 90 }, { v: "@langchain/core", c: 95 }]
    }
  },
  {
    name: "LlamaIndex", category: "AI", patterns: {
      js: [{ v: "llamaindex", c: 90 }]
    }
  },
  {
    name: "Pinecone", category: "AI", patterns: {
      js: [{ v: "@pinecone-database/pinecone", c: 95 }],
      network: [{ v: "pinecone.io", c: 95 }]
    }
  },
  {
    name: "Weaviate", category: "AI", patterns: {
      js: [{ v: "weaviate-ts-client", c: 95 }]
    }
  },
  {
    name: "Chroma", category: "AI", patterns: {
      js: [{ v: "chromadb", c: 90 }]
    }
  },
  {
    name: "Qdrant", category: "AI", patterns: {
      js: [{ v: "@qdrant/js-client-rest", c: 95 }]
    }
  },
  {
    name: "Hugging Face", category: "AI", patterns: {
      js: [{ v: "@huggingface/inference", c: 95 }],
      network: [{ v: "huggingface.co", c: 95 }]
    }
  },
  {
    name: "Replicate", category: "AI", patterns: {
      js: [{ v: "replicate", c: 90 }],
      network: [{ v: "replicate.com", c: 95 }]
    }
  },
  {
    name: "Fal.ai", category: "AI", patterns: {
      network: [{ v: "fal.ai", c: 95 }]
    }
  },
  {
    name: "Together AI", category: "AI", patterns: {
      network: [{ v: "together.xyz", c: 95 }]
    }
  },
  {
    name: "Mistral AI", category: "AI", patterns: {
      js: [{ v: "@mistralai/mistralai", c: 95 }]
    }
  },
  {
    name: "Groq", category: "AI", patterns: {
      js: [{ v: "groq-sdk", c: 90 }]
    }
  },

  // -------------------- EDGE PLATFORMS --------------------
  {
    name: "Cloudflare Workers", category: "Edge", patterns: {
      headers: [{ v: "cf-worker", c: 95 }],
      js: [{ v: "addEventListener('fetch'", c: 80 }]
    }
  },
  {
    name: "Vercel Edge Functions", category: "Edge", patterns: {
      headers: [{ v: "x-vercel-id", c: 95 }],
      network: [{ v: ".vercel.app", c: 90 }]
    }
  },
  {
    name: "Fastly Compute", category: "Edge", patterns: {
      headers: [{ v: "x-served-by", c: 70 }, { v: "fastly", c: 90 }]
    }
  },
  {
    name: "Deno Deploy", category: "Edge", patterns: {
      headers: [{ v: "x-deno", c: 95 }],
      network: [{ v: "deno.dev", c: 95 }]
    }
  },
  {
    name: "Bun", category: "Edge", patterns: {
      headers: [{ v: "server: Bun", c: 95 }]
    }
  },
  {
    name: "Lagon", category: "Edge", patterns: {
      network: [{ v: "lagon.app", c: 95 }]
    }
  },

  // -------------------- DATABASES & INFRA --------------------
  {
    name: "MongoDB Atlas", category: "Database", patterns: {
      network: [{ v: "mongodb.net", c: 95 }]
    }
  },
  {
    name: "PlanetScale", category: "Database", patterns: {
      network: [{ v: "psdb.cloud", c: 95 }],
      js: [{ v: "@planetscale/database", c: 95 }]
    }
  },
  {
    name: "Neon", category: "Database", patterns: {
      network: [{ v: "neon.tech", c: 95 }]
    }
  },
  {
    name: "CockroachDB", category: "Database", patterns: {
      network: [{ v: "cockroachlabs.cloud", c: 95 }]
    }
  },
  {
    name: "Redis Cloud", category: "Database", patterns: {
      network: [{ v: "redislabs.com", c: 90 }, { v: "redis.cloud", c: 95 }]
    }
  },
  {
    name: "Elastic Cloud", category: "Search", patterns: {
      network: [{ v: "elastic-cloud.com", c: 95 }],
      headers: [{ v: "x-found-handling-cluster", c: 95 }]
    }
  },
  {
    name: "Meilisearch", category: "Search", patterns: {
      js: [{ v: "meilisearch", c: 95 }],
      network: [{ v: "meilisearch.com", c: 95 }]
    }
  },
  {
    name: "Algolia", category: "Search", patterns: {
      js: [{ v: "algoliasearch", c: 95 }],
      network: [{ v: "algolia.net", c: 95 }, { v: "algolianet.com", c: 95 }]
    }
  },
  {
    name: "Typesense", category: "Search", patterns: {
      js: [{ v: "typesense", c: 95 }]
    }
  },
  {
    name: "Kafka", category: "Message Queue", patterns: {
      network: [{ v: "confluent.cloud", c: 95 }]
    }
  },
  {
    name: "RabbitMQ", category: "Message Queue", patterns: {
      headers: [{ v: "server: RabbitMQ", c: 95 }]
    }
  },
  {
    name: "NATS", category: "Message Queue", patterns: {
      headers: [{ v: "server: nats", c: 95 }]
    }
  },
  {
    name: "Temporal", category: "Workflow", patterns: {
      js: [{ v: "@temporalio/worker", c: 95 }]
    }
  },

  // -------------------- ADDITIONAL CMS / E-COMMERCE --------------------
  {
    name: "Magento", category: "E-commerce", patterns: {
      cookies: [{ v: "frontend=", c: 80 }, { v: "adminhtml=", c: 85 }],
      paths: [{ v: "/skin/frontend/", c: 90 }]
    }
  },
  {
    name: "WooCommerce", category: "E-commerce", patterns: {
      cookies: [{ v: "woocommerce_items_in_cart", c: 90 }],
      paths: [{ v: "/wp-content/plugins/woocommerce", c: 90 }]
    }
  },
  {
    name: "PrestaShop", category: "E-commerce", patterns: {
      cookies: [{ v: "PrestaShop-", c: 95 }]
    }
  },
  {
    name: "BigCommerce", category: "E-commerce", patterns: {
      network: [{ v: "bigcommerce.com", c: 95 }]
    }
  },
  {
    name: "Webflow", category: "CMS", patterns: {
      html: [{ v: "data-wf-site", c: 95 }],
      network: [{ v: "webflow.com", c: 90 }]
    }
  },
  {
    name: "Strapi", category: "CMS", patterns: {
      js: [{ v: "strapi", c: 90 }],
      paths: [{ v: "/admin/", c: 80 }]
    }
  },
  {
    name: "Payload CMS", category: "CMS", patterns: {
      js: [{ v: "payload", c: 90 }],
      paths: [{ v: "/admin", c: 85 }]
    }
  },
  {
    name: "KeystoneJS", category: "CMS", patterns: {
      js: [{ v: "@keystone-6/core", c: 95 }]
    }
  },
  {
    name: "Directus", category: "CMS", patterns: {
      network: [{ v: "directus.io", c: 95 }],
      paths: [{ v: "/admin/", c: 80 }]
    }
  },

  // -------------------- ADDITIONAL AUTH / USER MANAGEMENT --------------------
  {
    name: "SuperTokens", category: "Auth", patterns: {
      js: [{ v: "supertokens-auth-react", c: 95 }],
      network: [{ v: "supertokens.com", c: 95 }]
    }
  },
  {
    name: "Logto", category: "Auth", patterns: {
      js: [{ v: "@logto/js", c: 95 }]
    }
  },
  {
    name: "WorkOS", category: "Auth", patterns: {
      js: [{ v: "@workos-inc/node", c: 95 }]
    }
  },
  {
    name: "Stytch", category: "Auth", patterns: {
      js: [{ v: "@stytch/vanilla-js", c: 95 }]
    }
  },
  {
    name: "Descope", category: "Auth", patterns: {
      js: [{ v: "@descope/web-js-sdk", c: 95 }]
    }
  },
  {
    name: "Kinde", category: "Auth", patterns: {
      js: [{ v: "@kinde-oss/kinde-auth", c: 95 }]
    }
  },
  {
    name: "Corbado", category: "Auth", patterns: {
      js: [{ v: "@corbado/web-js", c: 95 }]
    }
  },
  {
    name: "FusionAuth", category: "Auth", patterns: {
      paths: [{ v: "/oauth2/", c: 80 }],
      network: [{ v: "fusionauth.io", c: 95 }]
    }
  },

  // -------------------- ADDITIONAL MONITORING / OBSERVABILITY --------------------
  {
    name: "OpenTelemetry", category: "Monitoring", patterns: {
      js: [{ v: "@opentelemetry/api", c: 95 }]
    }
  },
  {
    name: "Prometheus", category: "Monitoring", patterns: {
      paths: [{ v: "/metrics", c: 80 }],
      headers: [{ v: "x-prometheus", c: 95 }]
    }
  },
  {
    name: "Grafana", category: "Monitoring", patterns: {
      paths: [{ v: "/grafana/", c: 85 }],
      network: [{ v: "grafana.net", c: 95 }]
    }
  },
  {
    name: "Honeycomb", category: "Monitoring", patterns: {
      js: [{ v: "honeycomb", c: 90 }],
      network: [{ v: "honeycomb.io", c: 95 }]
    }
  },
  {
    name: "Splunk", category: "Monitoring", patterns: {
      js: [{ v: "splunk", c: 85 }],
      network: [{ v: "splunkcloud.com", c: 95 }]
    }
  },
  {
    name: "Sumo Logic", category: "Monitoring", patterns: {
      network: [{ v: "sumologic.com", c: 95 }]
    }
  },
  {
    name: "Papertrail", category: "Logging", patterns: {
      network: [{ v: "papertrailapp.com", c: 95 }]
    }
  },
  {
    name: "Logtail", category: "Logging", patterns: {
      network: [{ v: "logtail.com", c: 95 }]
    }
  },

  // -------------------- ADDITIONAL CDN / EDGE SERVICES --------------------
  {
    name: "KeyCDN", category: "CDN", patterns: {
      headers: [{ v: "x-cdn: KeyCDN", c: 95 }],
      network: [{ v: "kxcdn.com", c: 90 }]
    }
  },
  {
    name: "StackPath", category: "CDN", patterns: {
      headers: [{ v: "x-stackpath-", c: 95 }]
    }
  },
  {
    name: "Limelight", category: "CDN", patterns: {
      headers: [{ v: "x-llid", c: 95 }]
    }
  },
  {
    name: "Edgecast", category: "CDN", patterns: {
      headers: [{ v: "x-ec-", c: 95 }]
    }
  },
  {
    name: "CDN77", category: "CDN", patterns: {
      headers: [{ v: "x-cdn: CDN77", c: 95 }]
    }
  },

  // -------------------- ADDITIONAL LIBRARIES / UTILITIES --------------------
  {
    name: "Lodash", category: "Library", patterns: {
      js: [{ v: "_.VERSION", c: 90 }, { v: "lodash", c: 85 }]
    }
  },
  {
    name: "Moment.js", category: "Library", patterns: {
      js: [{ v: "moment.version", c: 90 }]
    }
  },
  {
    name: "Day.js", category: "Library", patterns: {
      js: [{ v: "dayjs", c: 90 }]
    }
  },
  {
    name: "date-fns", category: "Library", patterns: {
      js: [{ v: "date-fns", c: 85 }]
    }
  },
  {
    name: "Zod", category: "Validation", patterns: {
      js: [{ v: "z.object", c: 80 }, { v: "z.string", c: 85 }]
    }
  },
  {
    name: "Yup", category: "Validation", patterns: {
      js: [{ v: "yup.object", c: 80 }]
    }
  },
  {
    name: "React Hook Form", category: "Form", patterns: {
      js: [{ v: "useForm", c: 75 }, { v: "react-hook-form", c: 95 }]
    }
  },
  {
    name: "Formik", category: "Form", patterns: {
      js: [{ v: "formik", c: 95 }]
    }
  },
  {
    name: "i18next", category: "i18n", patterns: {
      js: [{ v: "i18next", c: 95 }]
    }
  },
  {
    name: "Prisma", category: "ORM", patterns: {
      js: [{ v: "PrismaClient", c: 95 }]
    }
  },
  {
    name: "Drizzle ORM", category: "ORM", patterns: {
      js: [{ v: "drizzle-orm", c: 95 }]
    }
  },
  {
    name: "Sequelize", category: "ORM", patterns: {
      js: [{ v: "Sequelize", c: 95 }]
    }
  },
  {
    name: "TypeORM", category: "ORM", patterns: {
      js: [{ v: "typeorm", c: 95 }]
    }
  },
  {
    name: "Knex.js", category: "Query Builder", patterns: {
      js: [{ v: "knex", c: 95 }]
    }
  },
  {
    name: "Winston", category: "Logging", patterns: {
      js: [{ v: "winston", c: 90 }]
    }
  },
  {
    name: "Pino", category: "Logging", patterns: {
      js: [{ v: "pino", c: 90 }]
    }
  },
  {
    name: "Bull", category: "Queue", patterns: {
      js: [{ v: "bull", c: 90 }]
    }
  },
  {
    name: "WebRTC", category: "Realtime", patterns: {
      js: [{ v: "RTCPeerConnection", c: 90 }]
    }
  },
  {
    name: "WebAssembly", category: "Language", patterns: {
      js: [{ v: "WebAssembly", c: 80 }],
      html: [{ v: "wasm", c: 70 }]
    }
  },

  // -------------------- INFRASTRUCTURE AS CODE / CONFIG --------------------
  {
    name: "Terraform Cloud", category: "IaC", patterns: {
      network: [{ v: "terraform.io", c: 95 }]
    }
  },
  {
    name: "Pulumi", category: "IaC", patterns: {
      network: [{ v: "pulumi.com", c: 95 }]
    }
  },
  {
    name: "Ansible", category: "IaC", patterns: {
      paths: [{ v: "/ansible/", c: 85 }]
    }
  },
  {
    name: "Chef", category: "IaC", patterns: {
      headers: [{ v: "x-chef", c: 95 }]
    }
  },
  {
    name: "Puppet", category: "IaC", patterns: {
      headers: [{ v: "x-puppet", c: 95 }]
    }
  },

  // -------------------- CONTAINER ORCHESTRATION --------------------
  {
    name: "Kubernetes", category: "Orchestration", patterns: {
      headers: [{ v: "x-kubernetes-", c: 95 }],
      paths: [{ v: "/api/v1/", c: 80 }, { v: "/apis/", c: 80 }]
    }
  },
  {
    name: "Docker", category: "Container", patterns: {
      headers: [{ v: "docker", c: 90 }]
    }
  },
  {
    name: "Rancher", category: "Orchestration", patterns: {
      headers: [{ v: "x-rancher", c: 95 }]
    }
  },
  {
    name: "Nomad", category: "Orchestration", patterns: {
      headers: [{ v: "x-nomad", c: 95 }]
    }
  },
  {
    name: "Portainer", category: "Orchestration", patterns: {
      paths: [{ v: "/portainer/", c: 90 }]
    }
  },

  // -------------------- VERSION CONTROL SYSTEMS --------------------
  {
    name: "GitLab", category: "VCS", patterns: {
      headers: [{ v: "x-gitlab", c: 95 }],
      cookies: [{ v: "_gitlab_session", c: 90 }]
    }
  },
  {
    name: "Bitbucket", category: "VCS", patterns: {
      headers: [{ v: "x-bitbucket", c: 95 }],
      cookies: [{ v: "BITBUCKETSESSIONID", c: 95 }]
    }
  },
  {
    name: "Gitea", category: "VCS", patterns: {
      cookies: [{ v: "i_like_gitea", c: 95 }]
    }
  },
  {
    name: "Gogs", category: "VCS", patterns: {
      cookies: [{ v: "gogs", c: 95 }]
    }
  },

  // -------------------- OTHER SaaS / TOOLS --------------------
  {
    name: "Notion", category: "Productivity", patterns: {
      network: [{ v: "notion.so", c: 95 }],
      html: [{ v: "notion", c: 80 }]
    }
  },
  {
    name: "Airtable", category: "Productivity", patterns: {
      network: [{ v: "airtable.com", c: 95 }]
    }
  },
  {
    name: "Zapier", category: "Automation", patterns: {
      network: [{ v: "zapier.com", c: 95 }]
    }
  },
  {
    name: "Make", category: "Automation", patterns: {
      network: [{ v: "integromat.com", c: 95 }, { v: "make.com", c: 95 }]
    }
  },
  {
    name: "n8n", category: "Automation", patterns: {
      paths: [{ v: "/n8n/", c: 85 }]
    }
  },
  {
    name: "Twilio", category: "Communication", patterns: {
      network: [{ v: "twilio.com", c: 95 }]
    }
  },
  {
    name: "Vonage", category: "Communication", patterns: {
      network: [{ v: "vonage.com", c: 95 }]
    }
  },
  {
    name: "Plaid", category: "Financial", patterns: {
      network: [{ v: "plaid.com", c: 95 }]
    }
  },
  {
    name: "Stripe Connect", category: "Payment", patterns: {
      js: [{ v: "stripe.connect", c: 95 }]
    }
  },
  {
    name: "Lemon Squeezy", category: "Payment", patterns: {
      network: [{ v: "lemonsqueezy.com", c: 95 }]
    }
  },
  {
    name: "Paddle", category: "Payment", patterns: {
      network: [{ v: "paddle.com", c: 95 }]
    }
  },
  {
    name: "Gumroad", category: "Payment", patterns: {
      network: [{ v: "gumroad.com", c: 95 }]
    }
  },
  {
    name: "Recurly", category: "Payment", patterns: {
      network: [{ v: "recurly.com", c: 95 }]
    }
  },
  {
    name: "Chargebee", category: "Payment", patterns: {
      network: [{ v: "chargebee.com", c: 95 }]
    }
  },
  {
    name: "Braintree", category: "Payment", patterns: {
      js: [{ v: "braintree", c: 90 }],
      network: [{ v: "braintreegateway.com", c: 95 }]
    }
  },
  {
    name: "Klarna", category: "Payment", patterns: {
      network: [{ v: "klarna.com", c: 95 }]
    }
  },
  {
    name: "Afterpay", category: "Payment", patterns: {
      network: [{ v: "afterpay.com", c: 95 }]
    }
  },
  {
    name: "Affirm", category: "Payment", patterns: {
      network: [{ v: "affirm.com", c: 95 }]
    }
  },
  {
    name: "Sezzle", category: "Payment", patterns: {
      network: [{ v: "sezzle.com", c: 95 }]
    }
  },
  {
    name: "Trustpilot", category: "Reviews", patterns: {
      network: [{ v: "trustpilot.com", c: 95 }]
    }
  },
  {
    name: "Yotpo", category: "Reviews", patterns: {
      network: [{ v: "yotpo.com", c: 95 }]
    }
  },
  {
    name: "Judge.me", category: "Reviews", patterns: {
      network: [{ v: "judge.me", c: 95 }]
    }
  },
  {
    name: "Smile.io", category: "Loyalty", patterns: {
      network: [{ v: "smile.io", c: 95 }]
    }
  },
  {
    name: "Klaviyo", category: "Marketing", patterns: {
      network: [{ v: "klaviyo.com", c: 95 }]
    }
  },
  {
    name: "Omnisend", category: "Marketing", patterns: {
      network: [{ v: "omnisend.com", c: 95 }]
    }
  },
  {
    name: "Privy", category: "Marketing", patterns: {
      network: [{ v: "privy.com", c: 95 }]
    }
  },
  {
    name: "Justuno", category: "Marketing", patterns: {
      network: [{ v: "justuno.com", c: 95 }]
    }
  },
  {
    name: "OptinMonster", category: "Marketing", patterns: {
      network: [{ v: "optinmonster.com", c: 95 }]
    }
  },
  {
    name: "Beamer", category: "Announcements", patterns: {
      network: [{ v: "beamer.com", c: 95 }]
    }
  },
  {
    name: "Appcues", category: "Onboarding", patterns: {
      network: [{ v: "appcues.com", c: 95 }]
    }
  },
  {
    name: "Userpilot", category: "Onboarding", patterns: {
      network: [{ v: "userpilot.com", c: 95 }]
    }
  },
  {
    name: "Pendo", category: "Product Analytics", patterns: {
      network: [{ v: "pendo.io", c: 95 }]
    }
  },
  {
    name: "Gainsight", category: "Product Analytics", patterns: {
      network: [{ v: "gainsight.com", c: 95 }]
    }
  },
  {
    name: "Chameleon", category: "Product Tours", patterns: {
      network: [{ v: "chameleon.io", c: 95 }]
    }
  },
  {
    name: "UserGuiding", category: "Product Tours", patterns: {
      network: [{ v: "userguiding.com", c: 95 }]
    }
  },
  {
    name: "WalkMe", category: "Product Tours", patterns: {
      network: [{ v: "walkme.com", c: 95 }]
    }
  },
  {
    name: "Whatfix", category: "Product Tours", patterns: {
      network: [{ v: "whatfix.com", c: 95 }]
    }
  },
  {
    name: "LaunchDarkly", category: "Feature Flags", patterns: {
      js: [{ v: "launchdarkly", c: 95 }],
      network: [{ v: "launchdarkly.com", c: 95 }]
    }
  },
  {
    name: "Flagsmith", category: "Feature Flags", patterns: {
      network: [{ v: "flagsmith.com", c: 95 }]
    }
  },
  {
    name: "Split.io", category: "Feature Flags", patterns: {
      network: [{ v: "split.io", c: 95 }]
    }
  },
  {
    name: "ConfigCat", category: "Feature Flags", patterns: {
      network: [{ v: "configcat.com", c: 95 }]
    }
  },
  {
    name: "Rollbar", category: "Error Tracking", patterns: {
      network: [{ v: "rollbar.com", c: 95 }]
    }
  },
  {
    name: "Bugsnag", category: "Error Tracking", patterns: {
      network: [{ v: "bugsnag.com", c: 95 }]
    }
  },
  {
    name: "Airbrake", category: "Error Tracking", patterns: {
      network: [{ v: "airbrake.io", c: 95 }]
    }
  },
  {
    name: "Raygun", category: "Error Tracking", patterns: {
      network: [{ v: "raygun.com", c: 95 }]
    }
  },
  {
    name: "TrackJS", category: "Error Tracking", patterns: {
      network: [{ v: "trackjs.com", c: 95 }]
    }
  },
  {
    name: "Exceptionless", category: "Error Tracking", patterns: {
      network: [{ v: "exceptionless.com", c: 95 }]
    }
  },
  {
    name: "GlitchTip", category: "Error Tracking", patterns: {
      network: [{ v: "glitchtip.com", c: 95 }]
    }
  },
  {
    name: "Sentry Self-Hosted", category: "Error Tracking", patterns: {
      paths: [{ v: "/sentry/", c: 85 }]
    }
  },
  {
    name: "Statuspage", category: "Status", patterns: {
      network: [{ v: "statuspage.io", c: 95 }]
    }
  },
  {
    name: "UptimeRobot", category: "Monitoring", patterns: {
      network: [{ v: "uptimerobot.com", c: 95 }]
    }
  },
  {
    name: "Pingdom", category: "Monitoring", patterns: {
      network: [{ v: "pingdom.com", c: 95 }]
    }
  },
  {
    name: "Better Uptime", category: "Monitoring", patterns: {
      network: [{ v: "betteruptime.com", c: 95 }]
    }
  },
  {
    name: "Checkly", category: "Monitoring", patterns: {
      network: [{ v: "checklyhq.com", c: 95 }]
    }
  },
  {
    name: "Site24x7", category: "Monitoring", patterns: {
      network: [{ v: "site24x7.com", c: 95 }]
    }
  },
  {
    name: "Sematext", category: "Monitoring", patterns: {
      network: [{ v: "sematext.com", c: 95 }]
    }
  },
  {
    name: "Logz.io", category: "Logging", patterns: {
      network: [{ v: "logz.io", c: 95 }]
    }
  },
  {
    name: "Coralogix", category: "Logging", patterns: {
      network: [{ v: "coralogix.com", c: 95 }]
    }
  },
  {
    name: "Humio", category: "Logging", patterns: {
      network: [{ v: "humio.com", c: 95 }]
    }
  },
  {
    name: "Loki", category: "Logging", patterns: {
      paths: [{ v: "/loki/api/v1", c: 90 }]
    }
  },
  {
    name: "Fluentd", category: "Logging", patterns: {
      headers: [{ v: "fluentd", c: 90 }]
    }
  },
  {
    name: "Logstash", category: "Logging", patterns: {
      paths: [{ v: "/logstash/", c: 85 }]
    }
  },
  {
    name: "Graylog", category: "Logging", patterns: {
      paths: [{ v: "/graylog/", c: 85 }]
    }
  },
  {
    name: "Kibana", category: "Visualization", patterns: {
      paths: [{ v: "/kibana/", c: 85 }]
    }
  },
  {
    name: "Metabase", category: "BI", patterns: {
      paths: [{ v: "/metabase/", c: 85 }]
    }
  },
  {
    name: "Superset", category: "BI", patterns: {
      paths: [{ v: "/superset/", c: 85 }]
    }
  },
  {
    name: "Redash", category: "BI", patterns: {
      paths: [{ v: "/redash/", c: 85 }]
    }
  },
  {
    name: "Tableau", category: "BI", patterns: {
      network: [{ v: "tableau.com", c: 95 }]
    }
  },
  {
    name: "Power BI", category: "BI", patterns: {
      network: [{ v: "powerbi.com", c: 95 }]
    }
  },
  {
    name: "Looker", category: "BI", patterns: {
      network: [{ v: "looker.com", c: 95 }]
    }
  },
  {
    name: "Mode", category: "BI", patterns: {
      network: [{ v: "modeanalytics.com", c: 95 }]
    }
  },
  {
    name: "Hex", category: "BI", patterns: {
      network: [{ v: "hex.tech", c: 95 }]
    }
  },
  {
    name: "Deepnote", category: "Notebook", patterns: {
      network: [{ v: "deepnote.com", c: 95 }]
    }
  },
  {
    name: "Observable", category: "Notebook", patterns: {
      network: [{ v: "observablehq.com", c: 95 }]
    }
  },
  {
    name: "Streamlit", category: "Data App", patterns: {
      network: [{ v: "streamlit.io", c: 95 }]
    }
  },
  {
    name: "Gradio", category: "Data App", patterns: {
      network: [{ v: "gradio.app", c: 95 }]
    }
  },
  {
    name: "Dash", category: "Data App", patterns: {
      js: [{ v: "dash-renderer", c: 95 }]
    }
  },
  {
    name: "Shiny", category: "Data App", patterns: {
      js: [{ v: "shiny", c: 90 }]
    }
  },
  {
    name: "Jupyter", category: "Notebook", patterns: {
      paths: [{ v: "/jupyter/", c: 85 }]
    }
  },
  {
    name: "RStudio", category: "IDE", patterns: {
      paths: [{ v: "/rstudio/", c: 85 }]
    }
  },
  {
    name: "VSCode Server", category: "IDE", patterns: {
      paths: [{ v: "/vscode/", c: 85 }]
    }
  },
  {
    name: "Code Server", category: "IDE", patterns: {
      paths: [{ v: "/code-server/", c: 85 }]
    }
  },
  {
    name: "Theia", category: "IDE", patterns: {
      paths: [{ v: "/theia/", c: 85 }]
    }
  },
  {
    name: "Eclipse Che", category: "IDE", patterns: {
      paths: [{ v: "/che/", c: 85 }]
    }
  },
  {
    name: "Gitpod", category: "IDE", patterns: {
      network: [{ v: "gitpod.io", c: 95 }]
    }
  },
  {
    name: "Replit", category: "IDE", patterns: {
      network: [{ v: "replit.com", c: 95 }]
    }
  },
  {
    name: "StackBlitz", category: "IDE", patterns: {
      network: [{ v: "stackblitz.com", c: 95 }]
    }
  },
  {
    name: "CodeSandbox", category: "IDE", patterns: {
      network: [{ v: "codesandbox.io", c: 95 }]
    }
  },
  {
    name: "Glitch", category: "Hosting", patterns: {
      network: [{ v: "glitch.com", c: 95 }]
    }
  },
  {
    name: "Fleek", category: "Hosting", patterns: {
      network: [{ v: "fleek.co", c: 95 }]
    }
  },
  {
    name: "Surge", category: "Hosting", patterns: {
      network: [{ v: "surge.sh", c: 95 }]
    }
  },
  {
    name: "Neocities", category: "Hosting", patterns: {
      network: [{ v: "neocities.org", c: 95 }]
    }
  },
  {
    name: "InfinityFree", category: "Hosting", patterns: {
      network: [{ v: "infinityfree.net", c: 95 }]
    }
  },
  {
    name: "000webhost", category: "Hosting", patterns: {
      network: [{ v: "000webhostapp.com", c: 95 }]
    }
  },
  {
    name: "Hostinger", category: "Hosting", patterns: {
      network: [{ v: "hostinger.com", c: 95 }]
    }
  },
  {
    name: "Bluehost", category: "Hosting", patterns: {
      network: [{ v: "bluehost.com", c: 95 }]
    }
  },
  {
    name: "SiteGround", category: "Hosting", patterns: {
      network: [{ v: "siteground.com", c: 95 }]
    }
  },
  {
    name: "WP Engine", category: "Hosting", patterns: {
      headers: [{ v: "x-wpengine", c: 95 }]
    }
  },
  {
    name: "Kinsta", category: "Hosting", patterns: {
      headers: [{ v: "x-kinsta-cache", c: 95 }]
    }
  },
  {
    name: "Pantheon", category: "Hosting", patterns: {
      headers: [{ v: "x-pantheon-", c: 95 }]
    }
  },
  {
    name: "Acquia", category: "Hosting", patterns: {
      headers: [{ v: "x-acquia-", c: 95 }]
    }
  },
  {
    name: "Platform.sh", category: "PaaS", patterns: {
      headers: [{ v: "x-platformsh", c: 95 }]
    }
  },
  {
    name: "Heroku", category: "PaaS", patterns: {
      headers: [{ v: "via: 1.1 vegur", c: 80 }],
      network: [{ v: "herokuapp.com", c: 95 }]
    }
  },
  {
    name: "DigitalOcean App Platform", category: "PaaS", patterns: {
      headers: [{ v: "x-do-app-origin", c: 95 }]
    }
  },
  {
    name: "Google App Engine", category: "PaaS", patterns: {
      headers: [{ v: "x-appengine", c: 95 }]
    }
  },
  {
    name: "AWS Elastic Beanstalk", category: "PaaS", patterns: {
      headers: [{ v: "x-elastic-beanstalk", c: 95 }]
    }
  },
  {
    name: "Microsoft Azure App Service", category: "PaaS", patterns: {
      headers: [{ v: "x-ms-request-id", c: 90 }]
    }
  },
  {
    name: "IBM Cloud", category: "Cloud", patterns: {
      headers: [{ v: "x-ibm-", c: 95 }]
    }
  },
  {
    name: "Oracle Cloud", category: "Cloud", patterns: {
      headers: [{ v: "x-oracle-", c: 95 }]
    }
  },
  {
    name: "Alibaba Cloud", category: "Cloud", patterns: {
      headers: [{ v: "x-acs-", c: 95 }]
    }
  },
  {
    name: "Tencent Cloud", category: "Cloud", patterns: {
      headers: [{ v: "x-tc-", c: 95 }]
    }
  },
  {
    name: "Hetzner", category: "Hosting", patterns: {
      network: [{ v: "hetzner.com", c: 95 }]
    }
  },
  {
    name: "OVHcloud", category: "Hosting", patterns: {
      network: [{ v: "ovhcloud.com", c: 95 }]
    }
  },
  {
    name: "Linode", category: "Hosting", patterns: {
      network: [{ v: "linode.com", c: 95 }]
    }
  },
  {
    name: "Vultr", category: "Hosting", patterns: {
      network: [{ v: "vultr.com", c: 95 }]
    }
  },
  {
    name: "Scaleway", category: "Hosting", patterns: {
      network: [{ v: "scaleway.com", c: 95 }]
    }
  },
  {
    name: "Contabo", category: "Hosting", patterns: {
      network: [{ v: "contabo.com", c: 95 }]
    }
  },
  {
    name: "Namecheap", category: "Domain", patterns: {
      network: [{ v: "namecheap.com", c: 95 }]
    }
  },
  {
    name: "GoDaddy", category: "Domain", patterns: {
      network: [{ v: "godaddy.com", c: 95 }]
    }
  },
  {
    name: "Cloudflare Registrar", category: "Domain", patterns: {
      network: [{ v: "cloudflare.com", c: 95 }]
    }
  },
  {
    name: "AWS Route 53", category: "DNS", patterns: {
      network: [{ v: "route53", c: 80 }]
    }
  },
  {
    name: "Google Domains", category: "Domain", patterns: {
      network: [{ v: "domains.google", c: 95 }]
    }
  },
  {
    name: "Freenom", category: "Domain", patterns: {
      network: [{ v: "freenom.com", c: 95 }]
    }
  },
  {
    name: "Dynadot", category: "Domain", patterns: {
      network: [{ v: "dynadot.com", c: 95 }]
    }
  },
  {
    name: "Porkbun", category: "Domain", patterns: {
      network: [{ v: "porkbun.com", c: 95 }]
    }
  },
  {
    name: "Gandi", category: "Domain", patterns: {
      network: [{ v: "gandi.net", c: 95 }]
    }
  },
  {
    name: "Hover", category: "Domain", patterns: {
      network: [{ v: "hover.com", c: 95 }]
    }
  },
  {
    name: "EasyWP", category: "Hosting", patterns: {
      network: [{ v: "easywp.com", c: 95 }]
    }
  },
  {
    name: "Cloudways", category: "Hosting", patterns: {
      network: [{ v: "cloudways.com", c: 95 }]
    }
  },
  {
    name: "RunCloud", category: "Hosting", patterns: {
      network: [{ v: "runcloud.io", c: 95 }]
    }
  },
  {
    name: "Ploi", category: "Hosting", patterns: {
      network: [{ v: "ploi.io", c: 95 }]
    }
  },
  {
    name: "Forge", category: "Hosting", patterns: {
      network: [{ v: "forge.laravel.com", c: 95 }]
    }
  },
  {
    name: "Cleavr", category: "Hosting", patterns: {
      network: [{ v: "cleavr.io", c: 95 }]
    }
  },
  {
    name: "SpinupWP", category: "Hosting", patterns: {
      network: [{ v: "spinupwp.com", c: 95 }]
    }
  },
  {
    name: "GridPane", category: "Hosting", patterns: {
      network: [{ v: "gridpane.com", c: 95 }]
    }
  },
  {
    name: "ServerPilot", category: "Hosting", patterns: {
      network: [{ v: "serverpilot.io", c: 95 }]
    }
  },
  {
    name: "Moss", category: "Hosting", patterns: {
      network: [{ v: "moss.sh", c: 95 }]
    }
  },
  {
    name: "Laravel Vapor", category: "Serverless", patterns: {
      network: [{ v: "vapor.laravel.com", c: 95 }]
    }
  },
  {
    name: "Bref", category: "Serverless", patterns: {
      js: [{ v: "bref", c: 90 }]
    }
  },
  {
    name: "OpenFaaS", category: "Serverless", patterns: {
      paths: [{ v: "/function/", c: 85 }]
    }
  },
  {
    name: "Fn Project", category: "Serverless", patterns: {
      paths: [{ v: "/fn/", c: 85 }]
    }
  },
  {
    name: "Knative", category: "Serverless", patterns: {
      headers: [{ v: "knative", c: 90 }]
    }
  },
  {
    name: "Tekton", category: "CI/CD", patterns: {
      paths: [{ v: "/tekton/", c: 85 }]
    }
  },
  {
    name: "Buildkite", category: "CI/CD", patterns: {
      network: [{ v: "buildkite.com", c: 95 }]
    }
  },
  {
    name: "Semaphore", category: "CI/CD", patterns: {
      network: [{ v: "semaphoreci.com", c: 95 }]
    }
  },
  {
    name: "AppVeyor", category: "CI/CD", patterns: {
      network: [{ v: "appveyor.com", c: 95 }]
    }
  },
  {
    name: "Scrutinizer", category: "Code Quality", patterns: {
      network: [{ v: "scrutinizer-ci.com", c: 95 }]
    }
  },
  {
    name: "Code Climate", category: "Code Quality", patterns: {
      network: [{ v: "codeclimate.com", c: 95 }]
    }
  },
  {
    name: "Codacy", category: "Code Quality", patterns: {
      network: [{ v: "codacy.com", c: 95 }]
    }
  },
  {
    name: "Coverity", category: "Code Quality", patterns: {
      network: [{ v: "coverity.com", c: 95 }]
    }
  },
  {
    name: "Snyk", category: "Security", patterns: {
      network: [{ v: "snyk.io", c: 95 }]
    }
  },
  {
    name: "WhiteSource", category: "Security", patterns: {
      network: [{ v: "whitesourcesoftware.com", c: 95 }]
    }
  },
  {
    name: "SonarCloud", category: "Code Quality", patterns: {
      network: [{ v: "sonarcloud.io", c: 95 }]
    }
  },
  {
    name: "SonarQube", category: "Code Quality", patterns: {
      paths: [{ v: "/sonar/", c: 85 }]
    }
  },
  {
    name: "Dependabot", category: "Security", patterns: {
      network: [{ v: "dependabot.com", c: 95 }]
    }
  },
  {
    name: "Renovate", category: "Security", patterns: {
      network: [{ v: "renovatebot.com", c: 95 }]
    }
  },
  {
    name: "Greenkeeper", category: "Security", patterns: {
      network: [{ v: "greenkeeper.io", c: 95 }]
    }
  },
  {
    name: "PyUp", category: "Security", patterns: {
      network: [{ v: "pyup.io", c: 95 }]
    }
  },
  {
    name: "Tidelift", category: "Security", patterns: {
      network: [{ v: "tidelift.com", c: 95 }]
    }
  },
  {
    name: "Snyk Advisor", category: "Security", patterns: {
      network: [{ v: "snyk.io/advisor", c: 95 }]
    }
  },
  {
    name: "Libraries.io", category: "Security", patterns: {
      network: [{ v: "libraries.io", c: 95 }]
    }
  },
  {
    name: "BundlePhobia", category: "Performance", patterns: {
      network: [{ v: "bundlephobia.com", c: 95 }]
    }
  },
  {
    name: "PackagePhobia", category: "Performance", patterns: {
      network: [{ v: "packagephobia.com", c: 95 }]
    }
  },
  {
    name: "npm trends", category: "Analytics", patterns: {
      network: [{ v: "npmtrends.com", c: 95 }]
    }
  },
  {
    name: "Moiva", category: "Analytics", patterns: {
      network: [{ v: "moiva.io", c: 95 }]
    }
  },
  {
    name: "Best of JS", category: "Analytics", patterns: {
      network: [{ v: "bestofjs.org", c: 95 }]
    }
  },
  {
    name: "Openbase", category: "Analytics", patterns: {
      network: [{ v: "openbase.com", c: 95 }]
    }
  },
  {
    name: "StackShare", category: "Analytics", patterns: {
      network: [{ v: "stackshare.io", c: 95 }]
    }
  },
  {
    name: "TechStack", category: "Analytics", patterns: {
      network: [{ v: "techstack.io", c: 95 }]
    }
  },
  {
    name: "Wappalyzer", category: "Analytics", patterns: {
      network: [{ v: "wappalyzer.com", c: 95 }]
    }
  },
  {
    name: "BuiltWith", category: "Analytics", patterns: {
      network: [{ v: "builtwith.com", c: 95 }]
    }
  },
  {
    name: "SimilarTech", category: "Analytics", patterns: {
      network: [{ v: "similartech.com", c: 95 }]
    }
  },
  {
    name: "WhatRuns", category: "Analytics", patterns: {
      network: [{ v: "whatruns.com", c: 95 }]
    }
  },
  {
    name: "PageSpeed Insights", category: "Performance", patterns: {
      network: [{ v: "pagespeed.web.dev", c: 95 }]
    }
  },
  {
    name: "GTmetrix", category: "Performance", patterns: {
      network: [{ v: "gtmetrix.com", c: 95 }]
    }
  },
  {
    name: "WebPageTest", category: "Performance", patterns: {
      network: [{ v: "webpagetest.org", c: 95 }]
    }
  },
  {
    name: "Pingdom Tools", category: "Performance", patterns: {
      network: [{ v: "tools.pingdom.com", c: 95 }]
    }
  },
  {
    name: "Dotcom-Tools", category: "Performance", patterns: {
      network: [{ v: "dotcom-tools.com", c: 95 }]
    }
  },
  {
    name: "Dareboost", category: "Performance", patterns: {
      network: [{ v: "dareboost.com", c: 95 }]
    }
  },
  {
    name: "Yellow Lab Tools", category: "Performance", patterns: {
      network: [{ v: "yellowlab.tools", c: 95 }]
    }
  },
  {
    name: "Sitespeed.io", category: "Performance", patterns: {
      network: [{ v: "sitespeed.io", c: 95 }]
    }
  },
  {
    name: "Lighthouse", category: "Performance", patterns: {
      js: [{ v: "lighthouse", c: 90 }]
    }
  },
  {
    name: "Calibre", category: "Performance", patterns: {
      network: [{ v: "calibreapp.com", c: 95 }]
    }
  },
  {
    name: "SpeedCurve", category: "Performance", patterns: {
      network: [{ v: "speedcurve.com", c: 95 }]
    }
  },
  {
    name: "DebugBear", category: "Performance", patterns: {
      network: [{ v: "debugbear.com", c: 95 }]
    }
  },
  {
    name: "Treo", category: "Performance", patterns: {
      network: [{ v: "treo.sh", c: 95 }]
    }
  },
  {
    name: "MachMetrics", category: "Performance", patterns: {
      network: [{ v: "machmetrics.com", c: 95 }]
    }
  },
  {
    name: "RUMvision", category: "Performance", patterns: {
      network: [{ v: "rumvision.com", c: 95 }]
    }
  },
  {
    name: "Request Metrics", category: "Performance", patterns: {
      network: [{ v: "requestmetrics.com", c: 95 }]
    }
  },
  {
    name: "Akita", category: "Observability", patterns: {
      network: [{ v: "akitasoftware.com", c: 95 }]
    }
  },
  {
    name: "Lightstep", category: "Observability", patterns: {
      network: [{ v: "lightstep.com", c: 95 }]
    }
  },
  {
    name: "Instana", category: "Observability", patterns: {
      network: [{ v: "instana.com", c: 95 }]
    }
  },
  {
    name: "Dynatrace", category: "Observability", patterns: {
      network: [{ v: "dynatrace.com", c: 95 }]
    }
  },
  {
    name: "AppDynamics", category: "Observability", patterns: {
      network: [{ v: "appdynamics.com", c: 95 }]
    }
  },
  {
    name: "New Relic One", category: "Observability", patterns: {
      network: [{ v: "newrelic.com", c: 95 }]
    }
  },
  {
    name: "Elastic APM", category: "Observability", patterns: {
      network: [{ v: "elastic.co/apm", c: 95 }]
    }
  },
  {
    name: "Sentry Performance", category: "Observability", patterns: {
      network: [{ v: "sentry.io/performance", c: 95 }]
    }
  },
  {
    name: "Datadog APM", category: "Observability", patterns: {
      network: [{ v: "datadoghq.com/apm", c: 95 }]
    }
  },
  {
    name: "Honeycomb Query", category: "Observability", patterns: {
      network: [{ v: "ui.honeycomb.io", c: 95 }]
    }
  },
  {
    name: "Axiom", category: "Observability", patterns: {
      network: [{ v: "axiom.co", c: 95 }]
    }
  },
  {
    name: "Chronosphere", category: "Observability", patterns: {
      network: [{ v: "chronosphere.io", c: 95 }]
    }
  },
  {
    name: "Cribl", category: "Observability", patterns: {
      network: [{ v: "cribl.io", c: 95 }]
    }
  },
  {
    name: "Mezmo", category: "Observability", patterns: {
      network: [{ v: "mezmo.com", c: 95 }]
    }
  },
  {
    name: "LogDNA", category: "Logging", patterns: {
      network: [{ v: "logdna.com", c: 95 }]
    }
  },
  {
    name: "Sumo Logic Continuous Intelligence", category: "Observability", patterns: {
      network: [{ v: "sumologic.com", c: 95 }]
    }
  },
  {
    name: "SignalFx", category: "Observability", patterns: {
      network: [{ v: "signalfx.com", c: 95 }]
    }
  },
  {
    name: "Wavefront", category: "Observability", patterns: {
      network: [{ v: "wavefront.com", c: 95 }]
    }
  },
  {
    name: "Sysdig", category: "Observability", patterns: {
      network: [{ v: "sysdig.com", c: 95 }]
    }
  },
  {
    name: "Falco", category: "Security", patterns: {
      network: [{ v: "falco.org", c: 95 }]
    }
  },
  {
    name: "Aqua Security", category: "Security", patterns: {
      network: [{ v: "aquasec.com", c: 95 }]
    }
  },
  {
    name: "Twistlock", category: "Security", patterns: {
      network: [{ v: "twistlock.com", c: 95 }]
    }
  },
  {
    name: "StackRox", category: "Security", patterns: {
      network: [{ v: "stackrox.com", c: 95 }]
    }
  },
  {
    name: "NeuVector", category: "Security", patterns: {
      network: [{ v: "neuvector.com", c: 95 }]
    }
  },
  {
    name: "Alcide", category: "Security", patterns: {
      network: [{ v: "alcide.io", c: 95 }]
    }
  },
  {
    name: "Tigera", category: "Security", patterns: {
      network: [{ v: "tigera.io", c: 95 }]
    }
  },
  {
    name: "Isovalent", category: "Security", patterns: {
      network: [{ v: "isovalent.com", c: 95 }]
    }
  },
  {
    name: "Cilium", category: "Security", patterns: {
      network: [{ v: "cilium.io", c: 95 }]
    }
  },
  {
    name: "Linkerd", category: "Service Mesh", patterns: {
      network: [{ v: "linkerd.io", c: 95 }]
    }
  },
  {
    name: "Istio", category: "Service Mesh", patterns: {
      headers: [{ v: "x-istio-", c: 95 }]
    }
  },
  {
    name: "Consul", category: "Service Mesh", patterns: {
      network: [{ v: "consul.io", c: 95 }]
    }
  },
  {
    name: "Kuma", category: "Service Mesh", patterns: {
      network: [{ v: "kuma.io", c: 95 }]
    }
  },
  {
    name: "Traefik", category: "Load Balancer", patterns: {
      headers: [{ v: "x-traefik", c: 95 }]
    }
  },
  {
    name: "HAProxy", category: "Load Balancer", patterns: {
      headers: [{ v: "server: HAProxy", c: 95 }]
    }
  },
  {
    name: "Envoy", category: "Proxy", patterns: {
      headers: [{ v: "x-envoy-", c: 95 }]
    }
  },
  {
    name: "Nginx Ingress", category: "Ingress", patterns: {
      headers: [{ v: "x-ingress-", c: 90 }]
    }
  },
  {
    name: "Kong", category: "API Gateway", patterns: {
      headers: [{ v: "x-kong-", c: 95 }]
    }
  },
  {
    name: "Tyk", category: "API Gateway", patterns: {
      headers: [{ v: "x-tyk-", c: 95 }]
    }
  },
  {
    name: "Apigee", category: "API Gateway", patterns: {
      network: [{ v: "apigee.com", c: 95 }]
    }
  },
  {
    name: "MuleSoft", category: "API Gateway", patterns: {
      network: [{ v: "mulesoft.com", c: 95 }]
    }
  },
  {
    name: "WSO2", category: "API Gateway", patterns: {
      network: [{ v: "wso2.com", c: 95 }]
    }
  },
  {
    name: "3scale", category: "API Gateway", patterns: {
      network: [{ v: "3scale.net", c: 95 }]
    }
  },
  {
    name: "KrakenD", category: "API Gateway", patterns: {
      network: [{ v: "krakend.io", c: 95 }]
    }
  },
  {
    name: "Gravitee", category: "API Gateway", patterns: {
      network: [{ v: "gravitee.io", c: 95 }]
    }
  },
  {
    name: "Fusio", category: "API Gateway", patterns: {
      network: [{ v: "fusio-project.org", c: 95 }]
    }
  },
  {
    name: "DreamFactory", category: "API Gateway", patterns: {
      network: [{ v: "dreamfactory.com", c: 95 }]
    }
  },
  {
    name: "Hasura", category: "GraphQL", patterns: {
      headers: [{ v: "x-hasura-", c: 95 }]
    }
  },
  {
    name: "GraphQL Mesh", category: "GraphQL", patterns: {
      network: [{ v: "graphql-mesh.com", c: 95 }]
    }
  },
  {
    name: "Apollo Federation", category: "GraphQL", patterns: {
      headers: [{ v: "apollo-federation", c: 95 }]
    }
  },
  {
    name: "Mercurius", category: "GraphQL", patterns: {
      js: [{ v: "mercurius", c: 95 }]
    }
  },
  {
    name: "Postgraphile", category: "GraphQL", patterns: {
      network: [{ v: "graphile.org", c: 95 }]
    }
  },
  {
    name: "Prisma Cloud", category: "Database", patterns: {
      network: [{ v: "prisma.io", c: 95 }]
    }
  },
  {
    name: "Fauna", category: "Database", patterns: {
      network: [{ v: "fauna.com", c: 95 }]
    }
  },
  {
    name: "DynamoDB", category: "Database", patterns: {
      headers: [{ v: "x-amz-target: DynamoDB", c: 95 }]
    }
  },
  {
    name: "Cassandra", category: "Database", patterns: {
      network: [{ v: "cassandra.apache.org", c: 95 }]
    }
  },
  {
    name: "ScyllaDB", category: "Database", patterns: {
      network: [{ v: "scylladb.com", c: 95 }]
    }
  },
  {
    name: "YugabyteDB", category: "Database", patterns: {
      network: [{ v: "yugabyte.com", c: 95 }]
    }
  },
  {
    name: "CockroachDB Cloud", category: "Database", patterns: {
      network: [{ v: "cockroachlabs.cloud", c: 95 }]
    }
  },
  {
    name: "TiDB", category: "Database", patterns: {
      network: [{ v: "pingcap.com", c: 95 }]
    }
  },
  {
    name: "SingleStore", category: "Database", patterns: {
      network: [{ v: "singlestore.com", c: 95 }]
    }
  },
  {
    name: "MemSQL", category: "Database", patterns: {
      network: [{ v: "memsql.com", c: 95 }]
    }
  },
  {
    name: "ClickHouse", category: "Database", patterns: {
      network: [{ v: "clickhouse.com", c: 95 }]
    }
  },
  {
    name: "TimescaleDB", category: "Database", patterns: {
      network: [{ v: "timescale.com", c: 95 }]
    }
  },
  {
    name: "InfluxDB", category: "Database", patterns: {
      network: [{ v: "influxdata.com", c: 95 }]
    }
  },
  {
    name: "QuestDB", category: "Database", patterns: {
      network: [{ v: "questdb.io", c: 95 }]
    }
  },
  {
    name: "Materialize", category: "Database", patterns: {
      network: [{ v: "materialize.com", c: 95 }]
    }
  },
  {
    name: "RisingWave", category: "Database", patterns: {
      network: [{ v: "risingwave.com", c: 95 }]
    }
  },
  {
    name: "KsqlDB", category: "Database", patterns: {
      network: [{ v: "ksqldb.io", c: 95 }]
    }
  },
  {
    name: "Firebolt", category: "Database", patterns: {
      network: [{ v: "firebolt.io", c: 95 }]
    }
  },
  {
    name: "Starburst", category: "Database", patterns: {
      network: [{ v: "starburst.io", c: 95 }]
    }
  },
  {
    name: "Dremio", category: "Database", patterns: {
      network: [{ v: "dremio.com", c: 95 }]
    }
  },
  {
    name: "Presto", category: "Database", patterns: {
      network: [{ v: "prestodb.io", c: 95 }]
    }
  },
  {
    name: "Trino", category: "Database", patterns: {
      network: [{ v: "trino.io", c: 95 }]
    }
  },
  {
    name: "Databricks", category: "Data Platform", patterns: {
      network: [{ v: "databricks.com", c: 95 }]
    }
  },
  {
    name: "Snowflake", category: "Data Platform", patterns: {
      network: [{ v: "snowflake.com", c: 95 }]
    }
  },
  {
    name: "BigQuery", category: "Data Platform", patterns: {
      network: [{ v: "bigquery.googleapis.com", c: 95 }]
    }
  },
  {
    name: "Redshift", category: "Data Platform", patterns: {
      network: [{ v: "redshift.amazonaws.com", c: 95 }]
    }
  },
  {
    name: "Synapse", category: "Data Platform", patterns: {
      network: [{ v: "synapse.azure.com", c: 95 }]
    }
  },
  {
    name: "Firebase Firestore", category: "Database", patterns: {
      network: [{ v: "firestore.googleapis.com", c: 95 }]
    }
  },
  {
    name: "Firebase Realtime Database", category: "Database", patterns: {
      network: [{ v: "firebaseio.com", c: 95 }]
    }
  },
  {
    name: "Cloud Firestore", category: "Database", patterns: {
      network: [{ v: "firestore.googleapis.com", c: 95 }]
    }
  },
  {
    name: "Realm", category: "Database", patterns: {
      network: [{ v: "realm.io", c: 95 }]
    }
  },
  {
    name: "ObjectBox", category: "Database", patterns: {
      network: [{ v: "objectbox.io", c: 95 }]
    }
  },
  {
    name: "WatermelonDB", category: "Database", patterns: {
      js: [{ v: "watermelondb", c: 95 }]
    }
  },
  {
    name: "RxDB", category: "Database", patterns: {
      js: [{ v: "rxdb", c: 95 }]
    }
  },
  {
    name: "PouchDB", category: "Database", patterns: {
      js: [{ v: "pouchdb", c: 95 }]
    }
  },
  {
    name: "Dexie.js", category: "Database", patterns: {
      js: [{ v: "dexie", c: 95 }]
    }
  },
  {
    name: "LocalForage", category: "Database", patterns: {
      js: [{ v: "localforage", c: 95 }]
    }
  },
  {
    name: "NeDB", category: "Database", patterns: {
      js: [{ v: "nedb", c: 95 }]
    }
  },
  {
    name: "Lowdb", category: "Database", patterns: {
      js: [{ v: "lowdb", c: 95 }]
    }
  },
  {
    name: "LokiJS", category: "Database", patterns: {
      js: [{ v: "lokijs", c: 95 }]
    }
  },
  {
    name: "AlaSQL", category: "Database", patterns: {
      js: [{ v: "alasql", c: 95 }]
    }
  },
  {
    name: "SQL.js", category: "Database", patterns: {
      js: [{ v: "sql.js", c: 95 }]
    }
  },
  {
    name: "DuckDB", category: "Database", patterns: {
      js: [{ v: "duckdb", c: 95 }]
    }
  },
  {
    name: "Lovefield", category: "Database", patterns: {
      js: [{ v: "lovefield", c: 95 }]
    }
  },
  {
    name: "TaffyDB", category: "Database", patterns: {
      js: [{ v: "taffydb", c: 95 }]
    }
  },
  {
    name: "JSData", category: "Database", patterns: {
      js: [{ v: "js-data", c: 95 }]
    }
  },
  {
    name: "Ember Data", category: "Data", patterns: {
      js: [{ v: "ember-data", c: 95 }]
    }
  },
  {
    name: "MirageJS", category: "Mocking", patterns: {
      js: [{ v: "miragejs", c: 95 }]
    }
  },
  {
    name: "MSW", category: "Mocking", patterns: {
      js: [{ v: "msw", c: 95 }]
    }
  },
  {
    name: "JSON Server", category: "Mocking", patterns: {
      network: [{ v: "localhost:3000", c: 30 }]
    }
  },
  {
    name: "Faker", category: "Mocking", patterns: {
      js: [{ v: "faker", c: 95 }]
    }
  },
  {
    name: "Chance", category: "Mocking", patterns: {
      js: [{ v: "chance", c: 95 }]
    }
  },
  {
    name: "Casual", category: "Mocking", patterns: {
      js: [{ v: "casual", c: 95 }]
    }
  },
  {
    name: "Rosie", category: "Mocking", patterns: {
      js: [{ v: "rosie", c: 95 }]
    }
  },
  {
    name: "Factory Bot", category: "Mocking", patterns: {
      js: [{ v: "factorybot", c: 95 }]
    }
  },
  {
    name: "TestCafe", category: "Testing", patterns: {
      js: [{ v: "testcafe", c: 95 }]
    }
  },
  {
    name: "Cypress", category: "Testing", patterns: {
      js: [{ v: "cypress", c: 95 }]
    }
  },
  {
    name: "Playwright", category: "Testing", patterns: {
      js: [{ v: "playwright", c: 95 }]
    }
  },
  {
    name: "Puppeteer", category: "Testing", patterns: {
      js: [{ v: "puppeteer", c: 95 }]
    }
  },
  {
    name: "Selenium", category: "Testing", patterns: {
      js: [{ v: "selenium", c: 95 }]
    }
  },
  {
    name: "WebdriverIO", category: "Testing", patterns: {
      js: [{ v: "webdriverio", c: 95 }]
    }
  },
  {
    name: "Nightwatch", category: "Testing", patterns: {
      js: [{ v: "nightwatch", c: 95 }]
    }
  },
  {
    name: "Jest", category: "Testing", patterns: {
      js: [{ v: "jest", c: 95 }]
    }
  },
  {
    name: "Mocha", category: "Testing", patterns: {
      js: [{ v: "mocha", c: 95 }]
    }
  },
  {
    name: "Jasmine", category: "Testing", patterns: {
      js: [{ v: "jasmine", c: 95 }]
    }
  },
  {
    name: "Karma", category: "Testing", patterns: {
      js: [{ v: "karma", c: 95 }]
    }
  },
  {
    name: "Protractor", category: "Testing", patterns: {
      js: [{ v: "protractor", c: 95 }]
    }
  },
  {
    name: "Ava", category: "Testing", patterns: {
      js: [{ v: "ava", c: 95 }]
    }
  },
  {
    name: "Tap", category: "Testing", patterns: {
      js: [{ v: "tap", c: 95 }]
    }
  },
  {
    name: "Tape", category: "Testing", patterns: {
      js: [{ v: "tape", c: 95 }]
    }
  },
  {
    name: "QUnit", category: "Testing", patterns: {
      js: [{ v: "qunit", c: 95 }]
    }
  },
  {
    name: "Unit.js", category: "Testing", patterns: {
      js: [{ v: "unit.js", c: 95 }]
    }
  },
  {
    name: "Sinon", category: "Testing", patterns: {
      js: [{ v: "sinon", c: 95 }]
    }
  },
  {
    name: "Chai", category: "Testing", patterns: {
      js: [{ v: "chai", c: 95 }]
    }
  },
  {
    name: "Should.js", category: "Testing", patterns: {
      js: [{ v: "should", c: 95 }]
    }
  },
  {
    name: "Expect.js", category: "Testing", patterns: {
      js: [{ v: "expect", c: 95 }]
    }
  },
  {
    name: "Unexpected", category: "Testing", patterns: {
      js: [{ v: "unexpected", c: 95 }]
    }
  },
  {
    name: "Enzyme", category: "Testing", patterns: {
      js: [{ v: "enzyme", c: 95 }]
    }
  },
  {
    name: "React Testing Library", category: "Testing", patterns: {
      js: [{ v: "@testing-library/react", c: 95 }]
    }
  },
  {
    name: "Vue Test Utils", category: "Testing", patterns: {
      js: [{ v: "@vue/test-utils", c: 95 }]
    }
  },
  {
    name: "Angular Testing", category: "Testing", patterns: {
      js: [{ v: "@angular/core/testing", c: 95 }]
    }
  },
  {
    name: "Storybook", category: "Development", patterns: {
      js: [{ v: "storybook", c: 95 }],
      paths: [{ v: "/storybook/", c: 85 }]
    }
  },
  {
    name: "Chromatic", category: "Testing", patterns: {
      network: [{ v: "chromatic.com", c: 95 }]
    }
  },
  {
    name: "Percy", category: "Testing", patterns: {
      network: [{ v: "percy.io", c: 95 }]
    }
  },
  {
    name: "Applitools", category: "Testing", patterns: {
      network: [{ v: "applitools.com", c: 95 }]
    }
  },
  {
    name: "BrowserStack", category: "Testing", patterns: {
      network: [{ v: "browserstack.com", c: 95 }]
    }
  },
  {
    name: "Sauce Labs", category: "Testing", patterns: {
      network: [{ v: "saucelabs.com", c: 95 }]
    }
  },
  {
    name: "LambdaTest", category: "Testing", patterns: {
      network: [{ v: "lambdatest.com", c: 95 }]
    }
  },
  {
    name: "TestingBot", category: "Testing", patterns: {
      network: [{ v: "testingbot.com", c: 95 }]
    }
  },
  {
    name: "CrossBrowserTesting", category: "Testing", patterns: {
      network: [{ v: "crossbrowsertesting.com", c: 95 }]
    }
  },
  {
    name: "Browserling", category: "Testing", patterns: {
      network: [{ v: "browserling.com", c: 95 }]
    }
  },
  {
    name: "Browsersync", category: "Development", patterns: {
      js: [{ v: "browsersync", c: 95 }]
    }
  },
  {
    name: "LiveReload", category: "Development", patterns: {
      js: [{ v: "livereload", c: 95 }]
    }
  },
  {
    name: "Hot Module Replacement", category: "Development", patterns: {
      js: [{ v: "hot.accept", c: 80 }]
    }
  },
  {
    name: "Nodemon", category: "Development", patterns: {
      js: [{ v: "nodemon", c: 95 }]
    }
  },
  {
    name: "PM2", category: "Process Manager", patterns: {
      headers: [{ v: "x-powered-by: PM2", c: 95 }]
    }
  },
  {
    name: "Forever", category: "Process Manager", patterns: {
      js: [{ v: "forever", c: 95 }]
    }
  },
  {
    name: "Supervisor", category: "Process Manager", patterns: {
      js: [{ v: "supervisor", c: 95 }]
    }
  },
  {
    name: "Systemd", category: "Init System", patterns: {
      paths: [{ v: "/systemd/", c: 50 }]
    }
  },
  {
    name: "Docker Compose", category: "Container", patterns: {
      network: [{ v: "docker-compose", c: 80 }]
    }
  },
  {
    name: "Kubernetes Helm", category: "Package Manager", patterns: {
      headers: [{ v: "helm", c: 90 }]
    }
  },
  {
    name: "Terraform", category: "IaC", patterns: {
      network: [{ v: "terraform.io", c: 95 }]
    }
  },
  {
    name: "Vagrant", category: "IaC", patterns: {
      network: [{ v: "vagrantup.com", c: 95 }]
    }
  },
  {
    name: "Packer", category: "IaC", patterns: {
      network: [{ v: "packer.io", c: 95 }]
    }
  },
  {
    name: "Consul", category: "Service Discovery", patterns: {
      network: [{ v: "consul.io", c: 95 }]
    }
  },
  {
    name: "Vault", category: "Security", patterns: {
      network: [{ v: "vaultproject.io", c: 95 }]
    }
  },
  {
    name: "Boundary", category: "Security", patterns: {
      network: [{ v: "boundaryproject.io", c: 95 }]
    }
  },
  {
    name: "Waypoint", category: "IaC", patterns: {
      network: [{ v: "waypointproject.io", c: 95 }]
    }
  },
  {
    name: "Nomad", category: "Orchestration", patterns: {
      network: [{ v: "nomadproject.io", c: 95 }]
    }
  },
  {
    name: "Serf", category: "Cluster", patterns: {
      network: [{ v: "serf.io", c: 95 }]
    }
  },
  {
    name: "Otto", category: "IaC", patterns: {
      network: [{ v: "ottoproject.io", c: 95 }]
    }
  },
  {
    name: "Mitchellh", category: "Tools", patterns: {
      network: [{ v: "mitchellh.com", c: 95 }]
    }
  },
  {
    name: "Hashicorp", category: "Vendor", patterns: {
      network: [{ v: "hashicorp.com", c: 95 }]
    }
  },
  {
    name: "Grunt", category: "Build Tool", patterns: {
      js: [{ v: "grunt", c: 95 }]
    }
  },
  {
    name: "Gulp", category: "Build Tool", patterns: {
      js: [{ v: "gulp", c: 95 }]
    }
  },
  {
    name: "Broccoli", category: "Build Tool", patterns: {
      js: [{ v: "broccoli", c: 95 }]
    }
  },
  {
    name: "Brunch", category: "Build Tool", patterns: {
      js: [{ v: "brunch", c: 95 }]
    }
  },
  {
    name: "Mimosa", category: "Build Tool", patterns: {
      js: [{ v: "mimosa", c: 95 }]
    }
  },
  {
    name: "Lineman", category: "Build Tool", patterns: {
      js: [{ v: "lineman", c: 95 }]
    }
  },
  {
    name: "Yeoman", category: "Scaffolding", patterns: {
      js: [{ v: "yeoman", c: 95 }]
    }
  },
  {
    name: "Slush", category: "Scaffolding", patterns: {
      js: [{ v: "slush", c: 95 }]
    }
  },
  {
    name: "Plop", category: "Scaffolding", patterns: {
      js: [{ v: "plop", c: 95 }]
    }
  },
  {
    name: "Hygen", category: "Scaffolding", patterns: {
      js: [{ v: "hygen", c: 95 }]
    }
  },
  {
    name: "Sao", category: "Scaffolding", patterns: {
      js: [{ v: "sao", c: 95 }]
    }
  },
  {
    name: "Cookiecutter", category: "Scaffolding", patterns: {
      js: [{ v: "cookiecutter", c: 95 }]
    }
  },
  {
    name: "Bower", category: "Package Manager", patterns: {
      js: [{ v: "bower", c: 95 }]
    }
  },
  {
    name: "Yarn", category: "Package Manager", patterns: {
      js: [{ v: "yarn", c: 95 }]
    }
  },
  {
    name: "pnpm", category: "Package Manager", patterns: {
      js: [{ v: "pnpm", c: 95 }]
    }
  },
  {
    name: "Lerna", category: "Monorepo", patterns: {
      js: [{ v: "lerna", c: 95 }]
    }
  },
  {
    name: "Nx", category: "Monorepo", patterns: {
      js: [{ v: "nx", c: 95 }]
    }
  },
  {
    name: "Turborepo", category: "Monorepo", patterns: {
      js: [{ v: "turborepo", c: 95 }]
    }
  },
  {
    name: "Rush", category: "Monorepo", patterns: {
      js: [{ v: "rush", c: 95 }]
    }
  },
  {
    name: "Bazel", category: "Build Tool", patterns: {
      js: [{ v: "bazel", c: 95 }]
    }
  },
  {
    name: "Buck", category: "Build Tool", patterns: {
      js: [{ v: "buck", c: 95 }]
    }
  },
  {
    name: "Please", category: "Build Tool", patterns: {
      js: [{ v: "please", c: 95 }]
    }
  },
  {
    name: "Pants", category: "Build Tool", patterns: {
      js: [{ v: "pants", c: 95 }]
    }
  },
  {
    name: "Gradle", category: "Build Tool", patterns: {
      js: [{ v: "gradle", c: 95 }]
    }
  },
  {
    name: "Maven", category: "Build Tool", patterns: {
      js: [{ v: "maven", c: 95 }]
    }
  },
  {
    name: "Ant", category: "Build Tool", patterns: {
      js: [{ v: "ant", c: 95 }]
    }
  },
  {
    name: "SBT", category: "Build Tool", patterns: {
      js: [{ v: "sbt", c: 95 }]
    }
  },
  {
    name: "Mill", category: "Build Tool", patterns: {
      js: [{ v: "mill", c: 95 }]
    }
  },
  {
    name: "CBT", category: "Build Tool", patterns: {
      js: [{ v: "cbt", c: 95 }]
    }
  },
  {
    name: "Leiningen", category: "Build Tool", patterns: {
      js: [{ v: "leiningen", c: 95 }]
    }
  },
  {
    name: "Boot", category: "Build Tool", patterns: {
      js: [{ v: "boot", c: 95 }]
    }
  },
  {
    name: "Rake", category: "Build Tool", patterns: {
      js: [{ v: "rake", c: 95 }]
    }
  },
  {
    name: "Make", category: "Build Tool", patterns: {
      js: [{ v: "make", c: 95 }]
    }
  },
  {
    name: "CMake", category: "Build Tool", patterns: {
      js: [{ v: "cmake", c: 95 }]
    }
  },
  {
    name: "Ninja", category: "Build Tool", patterns: {
      js: [{ v: "ninja", c: 95 }]
    }
  },
  {
    name: "Meson", category: "Build Tool", patterns: {
      js: [{ v: "meson", c: 95 }]
    }
  },
  {
    name: "SCons", category: "Build Tool", patterns: {
      js: [{ v: "scons", c: 95 }]
    }
  },
  {
    name: "Waf", category: "Build Tool", patterns: {
      js: [{ v: "waf", c: 95 }]
    }
  },
  {
    name: "Premake", category: "Build Tool", patterns: {
      js: [{ v: "premake", c: 95 }]
    }
  },
  {
    name: "GNU Autotools", category: "Build Tool", patterns: {
      js: [{ v: "autotools", c: 95 }]
    }
  },
  {
    name: "QMake", category: "Build Tool", patterns: {
      js: [{ v: "qmake", c: 95 }]
    }
  },
  {
    name: "Jam", category: "Build Tool", patterns: {
      js: [{ v: "jam", c: 95 }]
    }
  },
  {
    name: "B2", category: "Build Tool", patterns: {
      js: [{ v: "b2", c: 95 }]
    }
  },
  {
    name: "Boost.Build", category: "Build Tool", patterns: {
      js: [{ v: "boost-build", c: 95 }]
    }
  },
  {
    name: "Tup", category: "Build Tool", patterns: {
      js: [{ v: "tup", c: 95 }]
    }
  },
  {
    name: "Fbuild", category: "Build Tool", patterns: {
      js: [{ v: "fbuild", c: 95 }]
    }
  },
  {
    name: "Shake", category: "Build Tool", patterns: {
      js: [{ v: "shake", c: 95 }]
    }
  },
  {
    name: "Rattle", category: "Build Tool", patterns: {
      js: [{ v: "rattle", c: 95 }]
    }
  },
  {
    name: "Jake", category: "Build Tool", patterns: {
      js: [{ v: "jake", c: 95 }]
    }
  },
  {
    name: "RingoJS", category: "Runtime", patterns: {
      js: [{ v: "ringo", c: 95 }]
    }
  },
  {
    name: "Narwhal", category: "Runtime", patterns: {
      js: [{ v: "narwhal", c: 95 }]
    }
  },
  {
    name: "SilkJS", category: "Runtime", patterns: {
      js: [{ v: "silkjs", c: 95 }]
    }
  },
  {
    name: "TeaJS", category: "Runtime", patterns: {
      js: [{ v: "teajs", c: 95 }]
    }
  },
  {
    name: "Node.js", category: "Runtime", patterns: {
      headers: [{ v: "x-powered-by: Node.js", c: 90 }]
    }
  },
  {
    name: "Deno", category: "Runtime", patterns: {
      headers: [{ v: "server: deno", c: 95 }]
    }
  },
  {
    name: "Bun", category: "Runtime", patterns: {
      headers: [{ v: "server: Bun", c: 95 }]
    }
  },
  {
    name: "Electron", category: "Desktop", patterns: {
      js: [{ v: "electron", c: 95 }]
    }
  },
  {
    name: "NW.js", category: "Desktop", patterns: {
      js: [{ v: "nw", c: 95 }]
    }
  },
  {
    name: "Neutralinojs", category: "Desktop", patterns: {
      js: [{ v: "neutralino", c: 95 }]
    }
  },
  {
    name: "Tauri", category: "Desktop", patterns: {
      js: [{ v: "tauri", c: 95 }]
    }
  },
  {
    name: "React Native", category: "Mobile", patterns: {
      js: [{ v: "react-native", c: 95 }]
    }
  },
  {
    name: "Expo", category: "Mobile", patterns: {
      js: [{ v: "expo", c: 95 }]
    }
  },
  {
    name: "Ionic", category: "Mobile", patterns: {
      js: [{ v: "ionic", c: 95 }]
    }
  },
  {
    name: "Capacitor", category: "Mobile", patterns: {
      js: [{ v: "capacitor", c: 95 }]
    }
  },
  {
    name: "Cordova", category: "Mobile", patterns: {
      js: [{ v: "cordova", c: 95 }]
    }
  },
  {
    name: "PhoneGap", category: "Mobile", patterns: {
      js: [{ v: "phonegap", c: 95 }]
    }
  },
  {
    name: "NativeScript", category: "Mobile", patterns: {
      js: [{ v: "nativescript", c: 95 }]
    }
  },
  {
    name: "Flutter", category: "Mobile", patterns: {
      js: [{ v: "flutter", c: 95 }]
    }
  },
  {
    name: "Xamarin", category: "Mobile", patterns: {
      js: [{ v: "xamarin", c: 95 }]
    }
  },
  {
    name: "Unity", category: "Game", patterns: {
      js: [{ v: "unity", c: 95 }]
    }
  },
  {
    name: "Unreal", category: "Game", patterns: {
      js: [{ v: "unreal", c: 95 }]
    }
  },
  {
    name: "Godot", category: "Game", patterns: {
      js: [{ v: "godot", c: 95 }]
    }
  },
  {
    name: "Phaser", category: "Game", patterns: {
      js: [{ v: "phaser", c: 95 }]
    }
  },
  {
    name: "PixiJS", category: "Game", patterns: {
      js: [{ v: "pixi", c: 95 }]
    }
  },
  {
    name: "Babylon.js", category: "3D", patterns: {
      js: [{ v: "babylon", c: 95 }]
    }
  },
  {
    name: "PlayCanvas", category: "3D", patterns: {
      js: [{ v: "playcanvas", c: 95 }]
    }
  },
  {
    name: "A-Frame", category: "VR", patterns: {
      js: [{ v: "aframe", c: 95 }]
    }
  },
  {
    name: "AR.js", category: "AR", patterns: {
      js: [{ v: "arjs", c: 95 }]
    }
  },
  {
    name: "MindAR", category: "AR", patterns: {
      js: [{ v: "mindar", c: 95 }]
    }
  },
  {
    name: "Model Viewer", category: "3D", patterns: {
      html: [{ v: "model-viewer", c: 95 }]
    }
  },
  {
    name: "Sketchfab", category: "3D", patterns: {
      network: [{ v: "sketchfab.com", c: 95 }]
    }
  },
  {
    name: "Poly Haven", category: "Assets", patterns: {
      network: [{ v: "polyhaven.com", c: 95 }]
    }
  },
  {
    name: "Mixamo", category: "Animation", patterns: {
      network: [{ v: "mixamo.com", c: 95 }]
    }
  },
  {
    name: "Ready Player Me", category: "Avatar", patterns: {
      network: [{ v: "readyplayer.me", c: 95 }]
    }
  },
  {
    name: "Avataaars", category: "Avatar", patterns: {
      network: [{ v: "avataaars.com", c: 95 }]
    }
  },
  {
    name: "DiceBear", category: "Avatar", patterns: {
      network: [{ v: "dicebear.com", c: 95 }]
    }
  },
  {
    name: "Multiavatar", category: "Avatar", patterns: {
      network: [{ v: "multiavatar.com", c: 95 }]
    }
  },
  {
    name: "Boring Avatars", category: "Avatar", patterns: {
      js: [{ v: "boring-avatars", c: 95 }]
    }
  },
  {
    name: "React Avatar Editor", category: "Avatar", patterns: {
      js: [{ v: "react-avatar-editor", c: 95 }]
    }
  },
  {
    name: "React Avatar", category: "Avatar", patterns: {
      js: [{ v: "react-avatar", c: 95 }]
    }
  },
  {
    name: "Vue Avatar", category: "Avatar", patterns: {
      js: [{ v: "vue-avatar", c: 95 }]
    }
  },
  {
    name: "Angular Avatar", category: "Avatar", patterns: {
      js: [{ v: "ngx-avatar", c: 95 }]
    }
  },
  {
    name: "Emoji Mart", category: "Emoji", patterns: {
      js: [{ v: "emoji-mart", c: 95 }]
    }
  },
  {
    name: "Emoji Picker React", category: "Emoji", patterns: {
      js: [{ v: "emoji-picker-react", c: 95 }]
    }
  },
  {
    name: "Twemoji", category: "Emoji", patterns: {
      js: [{ v: "twemoji", c: 95 }]
    }
  },
  {
    name: "Noto Emoji", category: "Font", patterns: {
      network: [{ v: "noto-emoji", c: 95 }]
    }
  },
  {
    name: "JoyPixels", category: "Emoji", patterns: {
      network: [{ v: "joypixels.com", c: 95 }]
    }
  },
  {
    name: "EmojiOne", category: "Emoji", patterns: {
      network: [{ v: "emojione.com", c: 95 }]
    }
  },
  {
    name: "Gemoji", category: "Emoji", patterns: {
      js: [{ v: "gemoji", c: 95 }]
    }
  },
  {
    name: "Marked", category: "Markdown", patterns: {
      js: [{ v: "marked", c: 95 }]
    }
  },
  {
    name: "Markdown-it", category: "Markdown", patterns: {
      js: [{ v: "markdown-it", c: 95 }]
    }
  },
  {
    name: "Showdown", category: "Markdown", patterns: {
      js: [{ v: "showdown", c: 95 }]
    }
  },
  {
    name: "Remark", category: "Markdown", patterns: {
      js: [{ v: "remark", c: 95 }]
    }
  },
  {
    name: "Rehype", category: "HTML", patterns: {
      js: [{ v: "rehype", c: 95 }]
    }
  },
  {
    name: "Unified", category: "Content", patterns: {
      js: [{ v: "unified", c: 95 }]
    }
  },
  {
    name: "MDX", category: "Markdown", patterns: {
      js: [{ v: "mdx", c: 95 }]
    }
  },
  {
    name: "MDsveX", category: "Markdown", patterns: {
      js: [{ v: "mdsvex", c: 95 }]
    }
  },
  {
    name: "MDX Bundler", category: "Markdown", patterns: {
      js: [{ v: "mdx-bundler", c: 95 }]
    }
  },
  {
    name: "Contentlayer", category: "Content", patterns: {
      js: [{ v: "contentlayer", c: 95 }]
    }
  },
  {
    name: "Velite", category: "Content", patterns: {
      js: [{ v: "velite", c: 95 }]
    }
  },
  {
    name: "Fumadocs", category: "Documentation", patterns: {
      js: [{ v: "fumadocs", c: 95 }]
    }
  },
  {
    name: "Nextra", category: "Documentation", patterns: {
      js: [{ v: "nextra", c: 95 }]
    }
  },
  {
    name: "Docusaurus", category: "Documentation", patterns: {
      js: [{ v: "docusaurus", c: 95 }]
    }
  },
  {
    name: "VuePress", category: "Documentation", patterns: {
      js: [{ v: "vuepress", c: 95 }]
    }
  },
  {
    name: "VitePress", category: "Documentation", patterns: {
      js: [{ v: "vitepress", c: 95 }]
    }
  },
  {
    name: "Docsify", category: "Documentation", patterns: {
      js: [{ v: "docsify", c: 95 }]
    }
  },
  {
    name: "Docute", category: "Documentation", patterns: {
      js: [{ v: "docute", c: 95 }]
    }
  },
  {
    name: "Docz", category: "Documentation", patterns: {
      js: [{ v: "docz", c: 95 }]
    }
  },
  {
    name: "Styleguidist", category: "Documentation", patterns: {
      js: [{ v: "react-styleguidist", c: 95 }]
    }
  },
  {
    name: "Histoire", category: "Documentation", patterns: {
      js: [{ v: "histoire", c: 95 }]
    }
  },
  {
    name: "Ladle", category: "Documentation", patterns: {
      js: [{ v: "ladle", c: 95 }]
    }
  },
  {
    name: "Preview.js", category: "Development", patterns: {
      js: [{ v: "previewjs", c: 95 }]
    }
  },
  {
    name: "Sandpack", category: "Development", patterns: {
      js: [{ v: "sandpack", c: 95 }]
    }
  },
  {
    name: "Stackblitz SDK", category: "Development", patterns: {
      js: [{ v: "@stackblitz/sdk", c: 95 }]
    }
  },
  {
    name: "CodeSandbox SDK", category: "Development", patterns: {
      js: [{ v: "codesandbox-import-utils", c: 95 }]
    }
  },
  {
    name: "Replit SDK", category: "Development", patterns: {
      js: [{ v: "replit", c: 95 }]
    }
  },
  {
    name: "GitHub Gist", category: "Code", patterns: {
      network: [{ v: "gist.github.com", c: 95 }]
    }
  },
  {
    name: "Pastebin", category: "Code", patterns: {
      network: [{ v: "pastebin.com", c: 95 }]
    }
  },
  {
    name: "Hastebin", category: "Code", patterns: {
      network: [{ v: "hastebin.com", c: 95 }]
    }
  },
  {
    name: "Carbon", category: "Code", patterns: {
      network: [{ v: "carbon.now.sh", c: 95 }]
    }
  },
  {
    name: "Ray.so", category: "Code", patterns: {
      network: [{ v: "ray.so", c: 95 }]
    }
  },
  {
    name: "Snappify", category: "Code", patterns: {
      network: [{ v: "snappify.com", c: 95 }]
    }
  },
  {
    name: "CodeSnap", category: "Code", patterns: {
      js: [{ v: "codesnap", c: 95 }]
    }
  },
  {
    name: "Polacode", category: "Code", patterns: {
      js: [{ v: "polacode", c: 95 }]
    }
  },
  {
    name: "Shiki", category: "Syntax Highlight", patterns: {
      js: [{ v: "shiki", c: 95 }]
    }
  },
  {
    name: "Prism", category: "Syntax Highlight", patterns: {
      js: [{ v: "prismjs", c: 95 }]
    }
  },
  {
    name: "Highlight.js", category: "Syntax Highlight", patterns: {
      js: [{ v: "highlight.js", c: 95 }]
    }
  },
  {
    name: "Rainbow", category: "Syntax Highlight", patterns: {
      js: [{ v: "rainbow", c: 95 }]
    }
  },
  {
    name: "SyntaxHighlighter", category: "Syntax Highlight", patterns: {
      js: [{ v: "syntaxhighlighter", c: 95 }]
    }
  },
  {
    name: "CodeMirror", category: "Editor", patterns: {
      js: [{ v: "codemirror", c: 95 }]
    }
  },
  {
    name: "Monaco Editor", category: "Editor", patterns: {
      js: [{ v: "monaco-editor", c: 95 }]
    }
  },
  {
    name: "Ace Editor", category: "Editor", patterns: {
      js: [{ v: "ace", c: 95 }]
    }
  },
  {
    name: "Quill", category: "Editor", patterns: {
      js: [{ v: "quill", c: 95 }]
    }
  },
  {
    name: "Tiptap", category: "Editor", patterns: {
      js: [{ v: "tiptap", c: 95 }]
    }
  },
  {
    name: "ProseMirror", category: "Editor", patterns: {
      js: [{ v: "prosemirror", c: 95 }]
    }
  },
  {
    name: "Slate", category: "Editor", patterns: {
      js: [{ v: "slate", c: 95 }]
    }
  },
  {
    name: "Draft.js", category: "Editor", patterns: {
      js: [{ v: "draft-js", c: 95 }]
    }
  },
  {
    name: "Lexical", category: "Editor", patterns: {
      js: [{ v: "lexical", c: 95 }]
    }
  },
  {
    name: "Plate", category: "Editor", patterns: {
      js: [{ v: "plate", c: 95 }]
    }
  },
  {
    name: "Remirror", category: "Editor", patterns: {
      js: [{ v: "remirror", c: 95 }]
    }
  },
  {
    name: "TinyMCE", category: "Editor", patterns: {
      js: [{ v: "tinymce", c: 95 }]
    }
  },
  {
    name: "CKEditor", category: "Editor", patterns: {
      js: [{ v: "ckeditor", c: 95 }]
    }
  },
  {
    name: "Froala", category: "Editor", patterns: {
      js: [{ v: "froala", c: 95 }]
    }
  },
  {
    name: "Summernote", category: "Editor", patterns: {
      js: [{ v: "summernote", c: 95 }]
    }
  },
  {
    name: "Trumbowyg", category: "Editor", patterns: {
      js: [{ v: "trumbowyg", c: 95 }]
    }
  },
  {
    name: "SimpleMDE", category: "Editor", patterns: {
      js: [{ v: "simplemde", c: 95 }]
    }
  },
  {
    name: "EasyMDE", category: "Editor", patterns: {
      js: [{ v: "easymde", c: 95 }]
    }
  },
  {
    name: "Toast UI Editor", category: "Editor", patterns: {
      js: [{ v: "toast-ui/editor", c: 95 }]
    }
  },
  {
    name: "React PDF", category: "PDF", patterns: {
      js: [{ v: "@react-pdf/renderer", c: 95 }]
    }
  },
  {
    name: "PDF.js", category: "PDF", patterns: {
      js: [{ v: "pdfjs", c: 95 }]
    }
  },
  {
    name: "PDF-lib", category: "PDF", patterns: {
      js: [{ v: "pdf-lib", c: 95 }]
    }
  },
  {
    name: "jsPDF", category: "PDF", patterns: {
      js: [{ v: "jspdf", c: 95 }]
    }
  },
  {
    name: "React PDF Viewer", category: "PDF", patterns: {
      js: [{ v: "@react-pdf-viewer", c: 95 }]
    }
  },
  {
    name: "React Spreadsheet", category: "Spreadsheet", patterns: {
      js: [{ v: "react-spreadsheet", c: 95 }]
    }
  },
  {
    name: "Handsontable", category: "Spreadsheet", patterns: {
      js: [{ v: "handsontable", c: 95 }]
    }
  },
  {
    name: "AG Grid", category: "Table", patterns: {
      js: [{ v: "ag-grid", c: 95 }]
    }
  },
  {
    name: "TanStack Table", category: "Table", patterns: {
      js: [{ v: "@tanstack/react-table", c: 95 }]
    }
  },
  {
    name: "React Table", category: "Table", patterns: {
      js: [{ v: "react-table", c: 95 }]
    }
  },
  {
    name: "React Data Grid", category: "Table", patterns: {
      js: [{ v: "react-data-grid", c: 95 }]
    }
  },
  {
    name: "React Virtualized", category: "Virtualization", patterns: {
      js: [{ v: "react-virtualized", c: 95 }]
    }
  },
  {
    name: "React Window", category: "Virtualization", patterns: {
      js: [{ v: "react-window", c: 95 }]
    }
  },
  {
    name: "Vue Virtual Scroller", category: "Virtualization", patterns: {
      js: [{ v: "vue-virtual-scroller", c: 95 }]
    }
  },
  {
    name: "ngx-virtual-scroller", category: "Virtualization", patterns: {
      js: [{ v: "ngx-virtual-scroller", c: 95 }]
    }
  },
  {
    name: "React Infinite Scroll", category: "Infinite Scroll", patterns: {
      js: [{ v: "react-infinite-scroll-component", c: 95 }]
    }
  },
  {
    name: "Vue Infinite Loading", category: "Infinite Scroll", patterns: {
      js: [{ v: "vue-infinite-loading", c: 95 }]
    }
  },
  {
    name: "Infinite Scroll", category: "Infinite Scroll", patterns: {
      js: [{ v: "infinite-scroll", c: 95 }]
    }
  },
  {
    name: "React Select", category: "Select", patterns: {
      js: [{ v: "react-select", c: 95 }]
    }
  },
  {
    name: "React Dropzone", category: "Upload", patterns: {
      js: [{ v: "react-dropzone", c: 95 }]
    }
  },
  {
    name: "Uppy", category: "Upload", patterns: {
      js: [{ v: "uppy", c: 95 }]
    }
  },
  {
    name: "FilePond", category: "Upload", patterns: {
      js: [{ v: "filepond", c: 95 }]
    }
  },
  {
    name: "Dropzone", category: "Upload", patterns: {
      js: [{ v: "dropzone", c: 95 }]
    }
  },
  {
    name: "Fine Uploader", category: "Upload", patterns: {
      js: [{ v: "fine-uploader", c: 95 }]
    }
  },
  {
    name: "Resumable.js", category: "Upload", patterns: {
      js: [{ v: "resumablejs", c: 95 }]
    }
  },
  {
    name: "Plupload", category: "Upload", patterns: {
      js: [{ v: "plupload", c: 95 }]
    }
  },
  {
    name: "Flow.js", category: "Upload", patterns: {
      js: [{ v: "flow.js", c: 95 }]
    }
  },
  {
    name: "Tus", category: "Upload", patterns: {
      js: [{ v: "tus-js-client", c: 95 }]
    }
  },
  {
    name: "Transloadit", category: "Upload", patterns: {
      network: [{ v: "transloadit.com", c: 95 }]
    }
  },
  {
    name: "Uploadcare", category: "Upload", patterns: {
      network: [{ v: "uploadcare.com", c: 95 }]
    }
  },
  {
    name: "Filestack", category: "Upload", patterns: {
      network: [{ v: "filestack.com", c: 95 }]
    }
  },
  {
    name: "Cloudinary Upload Widget", category: "Upload", patterns: {
      js: [{ v: "cloudinary/upload-widget", c: 95 }]
    }
  },
  {
    name: "Imgix Management", category: "Media", patterns: {
      network: [{ v: "api.imgix.com", c: 95 }]
    }
  },
  {
    name: "Kraken.io", category: "Media", patterns: {
      network: [{ v: "kraken.io", c: 95 }]
    }
  },
  {
    name: "TinyPNG", category: "Media", patterns: {
      network: [{ v: "tinypng.com", c: 95 }]
    }
  },
  {
    name: "ImageKit", category: "Media", patterns: {
      network: [{ v: "imagekit.io", c: 95 }]
    }
  },
  {
    name: "Imgproxy", category: "Media", patterns: {
      network: [{ v: "imgproxy.net", c: 95 }]
    }
  },
  {
    name: "Weserv", category: "Media", patterns: {
      network: [{ v: "weserv.nl", c: 95 }]
    }
  },
  {
    name: "Thumbor", category: "Media", patterns: {
      network: [{ v: "thumbor.org", c: 95 }]
    }
  },
  {
    name: "Sirv", category: "Media", patterns: {
      network: [{ v: "sirv.com", c: 95 }]
    }
  },
  {
    name: "Bunny Stream", category: "Video", patterns: {
      network: [{ v: "bunny.net", c: 95 }]
    }
  },
  {
    name: "Mux", category: "Video", patterns: {
      network: [{ v: "mux.com", c: 95 }]
    }
  },
  {
    name: "Vidstack", category: "Video", patterns: {
      js: [{ v: "vidstack", c: 95 }]
    }
  },
  {
    name: "Plyr", category: "Video", patterns: {
      js: [{ v: "plyr", c: 95 }]
    }
  },
  {
    name: "Video.js", category: "Video", patterns: {
      js: [{ v: "videojs", c: 95 }]
    }
  },
  {
    name: "MediaElement.js", category: "Video", patterns: {
      js: [{ v: "mediaelement", c: 95 }]
    }
  },
  {
    name: "Hls.js", category: "Video", patterns: {
      js: [{ v: "hls.js", c: 95 }]
    }
  },
  {
    name: "Dash.js", category: "Video", patterns: {
      js: [{ v: "dashjs", c: 95 }]
    }
  },
  {
    name: "Shaka Player", category: "Video", patterns: {
      js: [{ v: "shaka-player", c: 95 }]
    }
  },
  {
    name: "JW Player", category: "Video", patterns: {
      js: [{ v: "jwplayer", c: 95 }]
    }
  },
  {
    name: "Brightcove", category: "Video", patterns: {
      network: [{ v: "brightcove.com", c: 95 }]
    }
  },
  {
    name: "Vimeo Player", category: "Video", patterns: {
      js: [{ v: "@vimeo/player", c: 95 }]
    }
  },
  {
    name: "YouTube Player", category: "Video", patterns: {
      js: [{ v: "youtube/iframe_api", c: 95 }]
    }
  },
  {
    name: "Wistia", category: "Video", patterns: {
      network: [{ v: "wistia.com", c: 95 }]
    }
  },
  {
    name: "Dailymotion", category: "Video", patterns: {
      network: [{ v: "dailymotion.com", c: 95 }]
    }
  },
  {
    name: "Twitch Embed", category: "Video", patterns: {
      network: [{ v: "twitch.tv/embed", c: 95 }]
    }
  },
  {
    name: "Spotify Embed", category: "Audio", patterns: {
      network: [{ v: "spotify.com/embed", c: 95 }]
    }
  },
  {
    name: "SoundCloud Embed", category: "Audio", patterns: {
      network: [{ v: "soundcloud.com/player", c: 95 }]
    }
  },
  {
    name: "Bandcamp Embed", category: "Audio", patterns: {
      network: [{ v: "bandcamp.com/EmbeddedPlayer", c: 95 }]
    }
  },
  {
    name: "Apple Music Embed", category: "Audio", patterns: {
      network: [{ v: "embed.music.apple.com", c: 95 }]
    }
  },
  {
    name: "Tidal Embed", category: "Audio", patterns: {
      network: [{ v: "embed.tidal.com", c: 95 }]
    }
  },
  {
    name: "Deezer Embed", category: "Audio", patterns: {
      network: [{ v: "deezer.com/plugins/player", c: 95 }]
    }
  },
  {
    name: "Audiomack Embed", category: "Audio", patterns: {
      network: [{ v: "audiomack.com/embed", c: 95 }]
    }
  },
  {
    name: "Mixcloud Embed", category: "Audio", patterns: {
      network: [{ v: "mixcloud.com/widget", c: 95 }]
    }
  },
  {
    name: "Podcast Embed", category: "Audio", patterns: {
      network: [{ v: "podbean.com", c: 95 }]
    }
  },
  {
    name: "Simplecast Embed", category: "Audio", patterns: {
      network: [{ v: "simplecast.com", c: 95 }]
    }
  },
  {
    name: "Transistor Embed", category: "Audio", patterns: {
      network: [{ v: "transistor.fm", c: 95 }]
    }
  },
  {
    name: "Captivate Embed", category: "Audio", patterns: {
      network: [{ v: "captivate.fm", c: 95 }]
    }
  },
  {
    name: "Buzzsprout Embed", category: "Audio", patterns: {
      network: [{ v: "buzzsprout.com", c: 95 }]
    }
  },
  {
    name: "Libsyn Embed", category: "Audio", patterns: {
      network: [{ v: "libsyn.com", c: 95 }]
    }
  },
  {
    name: "Spreaker Embed", category: "Audio", patterns: {
      network: [{ v: "spreaker.com", c: 95 }]
    }
  },
  {
    name: "Anchor Embed", category: "Audio", patterns: {
      network: [{ v: "anchor.fm", c: 95 }]
    }
  },
  {
    name: "Redcircle Embed", category: "Audio", patterns: {
      network: [{ v: "redcircle.com", c: 95 }]
    }
  },
  {
    name: "Whooshkaa Embed", category: "Audio", patterns: {
      network: [{ v: "whooshkaa.com", c: 95 }]
    }
  },
  {
    name: "Omny Studio Embed", category: "Audio", patterns: {
      network: [{ v: "omny.fm", c: 95 }]
    }
  },
  {
    name: "Megaphone Embed", category: "Audio", patterns: {
      network: [{ v: "megaphone.fm", c: 95 }]
    }
  },
  {
    name: "ART19 Embed", category: "Audio", patterns: {
      network: [{ v: "art19.com", c: 95 }]
    }
  },
  {
    name: "Podigee Embed", category: "Audio", patterns: {
      network: [{ v: "podigee.com", c: 95 }]
    }
  },
  {
    name: "Podomatic Embed", category: "Audio", patterns: {
      network: [{ v: "podomatic.com", c: 95 }]
    }
  },
  {
    name: "Acast Embed", category: "Audio", patterns: {
      network: [{ v: "acast.com", c: 95 }]
    }
  },
  {
    name: "Blubrry Embed", category: "Audio", patterns: {
      network: [{ v: "blubrry.com", c: 95 }]
    }
  },
  {
    name: "Fireside Embed", category: "Audio", patterns: {
      network: [{ v: "fireside.fm", c: 95 }]
    }
  },
  {
    name: "Castos Embed", category: "Audio", patterns: {
      network: [{ v: "castos.com", c: 95 }]
    }
  },
  {
    name: "Podlove Embed", category: "Audio", patterns: {
      network: [{ v: "podlove.org", c: 95 }]
    }
  },
  {
    name: "RadioPublic Embed", category: "Audio", patterns: {
      network: [{ v: "radiopublic.com", c: 95 }]
    }
  },
  {
    name: "Stitcher Embed", category: "Audio", patterns: {
      network: [{ v: "stitcher.com", c: 95 }]
    }
  },
  {
    name: "TuneIn Embed", category: "Audio", patterns: {
      network: [{ v: "tunein.com", c: 95 }]
    }
  },
  {
    name: "iHeartRadio Embed", category: "Audio", patterns: {
      network: [{ v: "iheart.com", c: 95 }]
    }
  },
  {
    name: "Pandora Embed", category: "Audio", patterns: {
      network: [{ v: "pandora.com", c: 95 }]
    }
  },
  {
    name: "Slacker Embed", category: "Audio", patterns: {
      network: [{ v: "slacker.com", c: 95 }]
    }
  },
  {
    name: "Live365 Embed", category: "Audio", patterns: {
      network: [{ v: "live365.com", c: 95 }]
    }
  },
  {
    name: "Radio.co Embed", category: "Audio", patterns: {
      network: [{ v: "radio.co", c: 95 }]
    }
  },
  {
    name: "RadioKing Embed", category: "Audio", patterns: {
      network: [{ v: "radioking.com", c: 95 }]
    }
  },
  {
    name: "CloudRadio Embed", category: "Audio", patterns: {
      network: [{ v: "cloudradio.com", c: 95 }]
    }
  },
  {
    name: "Airtime Pro Embed", category: "Audio", patterns: {
      network: [{ v: "airtime.pro", c: 95 }]
    }
  },
  {
    name: "SonicPanel Embed", category: "Audio", patterns: {
      network: [{ v: "sonicpanel.com", c: 95 }]
    }
  },
  {
    name: "Centova Cast Embed", category: "Audio", patterns: {
      network: [{ v: "centova.com", c: 95 }]
    }
  },
  {
    name: "Shoutcast Embed", category: "Audio", patterns: {
      network: [{ v: "shoutcast.com", c: 95 }]
    }
  },
  {
    name: "Icecast Embed", category: "Audio", patterns: {
      network: [{ v: "icecast.org", c: 95 }]
    }
  },
  {
    name: "Azuracast Embed", category: "Audio", patterns: {
      network: [{ v: "azuracast.com", c: 95 }]
    }
  },
  {
    name: "LibreTime Embed", category: "Audio", patterns: {
      network: [{ v: "libretime.org", c: 95 }]
    }
  },
  {
    name: "Rivendell Embed", category: "Audio", patterns: {
      network: [{ v: "rivendellaudio.org", c: 95 }]
    }
  },
  {
    name: "Mixxx Embed", category: "Audio", patterns: {
      network: [{ v: "mixxx.org", c: 95 }]
    }
  },
  {
    name: "VirtualDJ Embed", category: "Audio", patterns: {
      network: [{ v: "virtualdj.com", c: 95 }]
    }
  },
  {
    name: "Serato Embed", category: "Audio", patterns: {
      network: [{ v: "serato.com", c: 95 }]
    }
  },
  {
    name: "Traktor Embed", category: "Audio", patterns: {
      network: [{ v: "traktor.com", c: 95 }]
    }
  },
  {
    name: "Rekordbox Embed", category: "Audio", patterns: {
      network: [{ v: "rekordbox.com", c: 95 }]
    }
  },
  {
    name: "DJay Embed", category: "Audio", patterns: {
      network: [{ v: "djay.com", c: 95 }]
    }
  },
  {
    name: "Cross DJ Embed", category: "Audio", patterns: {
      network: [{ v: "mixvibes.com", c: 95 }]
    }
  },
  {
    name: "Deckadance Embed", category: "Audio", patterns: {
      network: [{ v: "deckadance.com", c: 95 }]
    }
  },
  {
    name: "FL Studio Embed", category: "Audio", patterns: {
      network: [{ v: "flstudio.com", c: 95 }]
    }
  },
  {
    name: "Ableton Embed", category: "Audio", patterns: {
      network: [{ v: "ableton.com", c: 95 }]
    }
  },
  {
    name: "Logic Pro Embed", category: "Audio", patterns: {
      network: [{ v: "apple.com/logic-pro", c: 95 }]
    }
  },
  {
    name: "GarageBand Embed", category: "Audio", patterns: {
      network: [{ v: "apple.com/mac/garageband", c: 95 }]
    }
  },
  {
    name: "Cubase Embed", category: "Audio", patterns: {
      network: [{ v: "steinberg.net/cubase", c: 95 }]
    }
  },
  {
    name: "Nuendo Embed", category: "Audio", patterns: {
      network: [{ v: "steinberg.net/nuendo", c: 95 }]
    }
  },
  {
    name: "Pro Tools Embed", category: "Audio", patterns: {
      network: [{ v: "avid.com/pro-tools", c: 95 }]
    }
  },
  {
    name: "Studio One Embed", category: "Audio", patterns: {
      network: [{ v: "presonus.com/studioone", c: 95 }]
    }
  },
  {
    name: "Reaper Embed", category: "Audio", patterns: {
      network: [{ v: "reaper.fm", c: 95 }]
    }
  },
  {
    name: "Reason Embed", category: "Audio", patterns: {
      network: [{ v: "reasonstudios.com", c: 95 }]
    }
  },
  {
    name: "Bitwig Embed", category: "Audio", patterns: {
      network: [{ v: "bitwig.com", c: 95 }]
    }
  },
  {
    name: "Ardour Embed", category: "Audio", patterns: {
      network: [{ v: "ardour.org", c: 95 }]
    }
  },
  {
    name: "LMMS Embed", category: "Audio", patterns: {
      network: [{ v: "lmms.io", c: 95 }]
    }
  },
  {
    name: "Audacity Embed", category: "Audio", patterns: {
      network: [{ v: "audacityteam.org", c: 95 }]
    }
  },
  {
    name: "Ocenaudio Embed", category: "Audio", patterns: {
      network: [{ v: "ocenaudio.com", c: 95 }]
    }
  },
  {
    name: "WavePad Embed", category: "Audio", patterns: {
      network: [{ v: "nch.com.au/wavepad", c: 95 }]
    }
  },
  {
    name: "Sound Forge Embed", category: "Audio", patterns: {
      network: [{ v: "magix.com/sound-forge", c: 95 }]
    }
  },
  {
    name: "Adobe Audition Embed", category: "Audio", patterns: {
      network: [{ v: "adobe.com/audition", c: 95 }]
    }
  },
  {
    name: "Hindenburg Embed", category: "Audio", patterns: {
      network: [{ v: "hindenburg.com", c: 95 }]
    }
  },
  {
    name: "Descript Embed", category: "Audio", patterns: {
      network: [{ v: "descript.com", c: 95 }]
    }
  },
  {
    name: "Alitu Embed", category: "Audio", patterns: {
      network: [{ v: "alitu.com", c: 95 }]
    }
  },
  {
    name: "SquadCast Embed", category: "Audio", patterns: {
      network: [{ v: "squadcast.fm", c: 95 }]
    }
  },
  {
    name: "Zencastr Embed", category: "Audio", patterns: {
      network: [{ v: "zencastr.com", c: 95 }]
    }
  },
  {
    name: "Riverside Embed", category: "Audio", patterns: {
      network: [{ v: "riverside.fm", c: 95 }]
    }
  },
  {
    name: "Cleanfeed Embed", category: "Audio", patterns: {
      network: [{ v: "cleanfeed.net", c: 95 }]
    }
  },
  {
    name: "Podcastle Embed", category: "Audio", patterns: {
      network: [{ v: "podcastle.ai", c: 95 }]
    }
  },
  {
    name: "Resonate Embed", category: "Audio", patterns: {
      network: [{ v: "resonate.is", c: 95 }]
    }
  },
  {
    name: "Audius Embed", category: "Audio", patterns: {
      network: [{ v: "audius.co", c: 95 }]
    }
  },
  {
    name: "SoundClick Embed", category: "Audio", patterns: {
      network: [{ v: "soundclick.com", c: 95 }]
    }
  },
  {
    name: "ReverbNation Embed", category: "Audio", patterns: {
      network: [{ v: "reverbnation.com", c: 95 }]
    }
  },
  {
    name: "BandLab Embed", category: "Audio", patterns: {
      network: [{ v: "bandlab.com", c: 95 }]
    }
  },
  {
    name: "Soundtrap Embed", category: "Audio", patterns: {
      network: [{ v: "soundtrap.com", c: 95 }]
    }
  },
  {
    name: "Amped Studio Embed", category: "Audio", patterns: {
      network: [{ v: "ampedstudio.com", c: 95 }]
    }
  },
  {
    name: "Soundation Embed", category: "Audio", patterns: {
      network: [{ v: "soundation.com", c: 95 }]
    }
  },
  {
    name: "AudioTool Embed", category: "Audio", patterns: {
      network: [{ v: "audiotool.com", c: 95 }]
    }
  },
  {
    name: "Online Sequencer Embed", category: "Audio", patterns: {
      network: [{ v: "onlinesequencer.net", c: 95 }]
    }
  },
  {
    name: "BeepBox Embed", category: "Audio", patterns: {
      network: [{ v: "beepbox.co", c: 95 }]
    }
  },
  {
    name: "Jummbox Embed", category: "Audio", patterns: {
      network: [{ v: "jummb.us", c: 95 }]
    }
  },
  {
    name: "Chrome Music Lab Embed", category: "Audio", patterns: {
      network: [{ v: "musiclab.chromeexperiments.com", c: 95 }]
    }
  },
  {
    name: "Web Audio API", category: "Audio", patterns: {
      js: [{ v: "AudioContext", c: 95 }]
    }
  },
  {
    name: "Tone.js", category: "Audio", patterns: {
      js: [{ v: "tone", c: 95 }]
    }
  },
  {
    name: "Howler.js", category: "Audio", patterns: {
      js: [{ v: "howler", c: 95 }]
    }
  },
  {
    name: "SoundJS", category: "Audio", patterns: {
      js: [{ v: "createjs.Sound", c: 95 }]
    }
  },
  {
    name: "Wavesurfer.js", category: "Audio", patterns: {
      js: [{ v: "wavesurfer", c: 95 }]
    }
  },
  {
    name: "Peaks.js", category: "Audio", patterns: {
      js: [{ v: "peaks", c: 95 }]
    }
  },
  {
    name: "AudioMotion", category: "Audio", patterns: {
      js: [{ v: "audiomotion", c: 95 }]
    }
  },
  {
    name: "VexFlow", category: "Music Notation", patterns: {
      js: [{ v: "vexflow", c: 95 }]
    }
  },
  {
    name: "ABCjs", category: "Music Notation", patterns: {
      js: [{ v: "abcjs", c: 95 }]
    }
  },
  {
    name: "OpenSheetMusicDisplay", category: "Music Notation", patterns: {
      js: [{ v: "opensheetmusicdisplay", c: 95 }]
    }
  },
  {
    name: "Alphatab", category: "Music Notation", patterns: {
      js: [{ v: "alphatab", c: 95 }]
    }
  },
  {
    name: "Verovio", category: "Music Notation", patterns: {
      js: [{ v: "verovio", c: 95 }]
    }
  },
  {
    name: "Midi.js", category: "MIDI", patterns: {
      js: [{ v: "midi", c: 95 }]
    }
  },
  {
    name: "WebMIDI", category: "MIDI", patterns: {
      js: [{ v: "WebMidi", c: 95 }]
    }
  },
  {
    name: "JZZ", category: "MIDI", patterns: {
      js: [{ v: "jzz", c: 95 }]
    }
  },
  {
    name: "Heartbeat", category: "Audio", patterns: {
      js: [{ v: "heartbeat", c: 95 }]
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

module.exports = { FINGERPRINTS, STRONG_SIGNALS, NETWORK_FINGERPRINTS };