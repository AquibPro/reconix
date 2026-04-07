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

module.exports = { FINGERPRINTS, STRONG_SIGNALS, NETWORK_FINGERPRINTS };
