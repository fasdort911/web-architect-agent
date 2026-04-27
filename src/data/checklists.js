export const CHECKLISTS = {
  performance: {
    title: 'Performance Checklist',
    items: [
      { check: 'LCP < 2.5s', how: 'Preload hero image, use avif/webp, avoid render-blocking resources' },
      { check: 'CLS < 0.1', how: 'Set width/height on all images, reserve space for dynamic content, avoid layout shifts from fonts' },
      { check: 'INP < 200ms', how: 'Defer non-critical JS, use scheduler.yield(), avoid long tasks on main thread' },
      { check: 'JS bundle < 150kb gzipped', how: 'Tree-shake imports, dynamic import() for heavy libs, use server components' },
      { check: 'Images: avif/webp with srcset', how: 'Use next/image — auto format conversion, lazy loading, srcset generation' },
      { check: 'Fonts: variable + preload', how: 'font-display: swap, preload woff2, use InterVariable or GeistMono' },
      { check: 'Critical CSS inlined', how: 'Next.js does this automatically with App Router' },
      { check: 'No render-blocking resources', how: 'Move scripts to bottom or use async/defer, inline critical CSS' },
      { check: 'CDN + cache headers', how: 'Cache-Control: public, max-age=31536000 for static; stale-while-revalidate for dynamic' },
      { check: 'Lighthouse score ≥ 90', how: 'Run: npx lhci autorun — fix all red and orange flags before ship' },
    ]
  },

  a11y: {
    title: 'Accessibility Checklist (WCAG 2.2 AA)',
    items: [
      { check: 'Color contrast ≥ 4.5:1 (text), ≥ 3:1 (large text)', how: 'Use oklch for perceptual uniformity. Check: webaim.org/resources/contrastchecker' },
      { check: 'Semantic HTML', how: 'nav, main, article, section, h1–h6, button (not div), a (not span)' },
      { check: 'Skip link to #main-content', how: '<a href="#main-content" class="sr-only focus:not-sr-only">Skip to content</a>' },
      { check: 'All interactive elements keyboard-reachable', how: 'Tab through the page — every button, link, input must be focusable' },
      { check: 'Visible focus indicator', how: 'focus-visible:outline — never remove outline without replacement' },
      { check: 'Focus trap in modals/drawers', how: 'Use Radix Dialog or @mui/material Modal — they handle focus trap automatically' },
      { check: 'Alt text for all images', how: 'Informative images: describe content. Decorative: alt=""' },
      { check: 'Form labels associated with inputs', how: '<label htmlFor="id"> or aria-label as fallback' },
      { check: 'Error messages linked to fields', how: 'aria-describedby="field-error" on input' },
      { check: 'prefers-reduced-motion respected', how: '@media (prefers-reduced-motion: reduce) { * { animation: none } }' },
      { check: 'No content only in color', how: 'Add icons, patterns, or text alongside color meaning' },
      { check: 'Screen reader test', how: 'VoiceOver (Mac/iOS) or NVDA (Windows) — navigate without looking at screen' },
    ]
  },

  seo: {
    title: 'SEO Checklist',
    items: [
      { check: '<title> unique per page, 50–60 chars', how: 'export const metadata = { title: "Page — Brand" }' },
      { check: '<meta description> 150–160 chars', how: 'Include primary keyword, write for humans not bots' },
      { check: 'Open Graph tags', how: 'og:title, og:description, og:image (1200×630px), og:url, og:type' },
      { check: 'Twitter Card', how: 'twitter:card: summary_large_image, twitter:image' },
      { check: 'Canonical URL', how: 'alternates: { canonical: "https://yoursite.com/page" } in metadata' },
      { check: 'Robots meta', how: 'Default: index, follow. Noindex for /admin, /thank-you, duplicates' },
      { check: 'JSON-LD structured data', how: 'WebPage + Organization minimum. Add Product, Article, FAQ as needed' },
      { check: 'Semantic H1–H6 hierarchy', how: 'One H1 per page. H2 for sections. Never skip levels' },
      { check: 'Sitemap.xml', how: 'app/sitemap.ts — Next.js generates automatically from return array' },
      { check: 'Hreflang for multi-language', how: 'alternates: { languages: { en: "/en", ru: "/ru" } }' },
      { check: 'Core Web Vitals green', how: 'LCP < 2.5s, CLS < 0.1, INP < 200ms — Google uses these for ranking' },
      { check: 'Internal linking', how: 'Link to important pages from homepage and nav — helps crawlers' },
    ]
  },

  security: {
    title: 'Security Checklist',
    items: [
      { check: 'Content-Security-Policy header', how: "default-src 'self' — prevents XSS. Start strict, loosen as needed" },
      { check: 'HSTS header', how: 'Strict-Transport-Security: max-age=63072000; includeSubDomains' },
      { check: 'X-Content-Type-Options: nosniff', how: 'Prevents MIME type sniffing attacks' },
      { check: 'X-Frame-Options: SAMEORIGIN', how: 'Prevents clickjacking. Use CSP frame-ancestors as modern alternative' },
      { check: 'Referrer-Policy: strict-origin-when-cross-origin', how: 'Limits referrer info sent to third parties' },
      { check: 'Permissions-Policy', how: 'Disable unused APIs: camera=(), microphone=(), geolocation=()' },
      { check: 'Zod validation on all inputs', how: 'Validate in Server Actions AND API routes — never trust client data' },
      { check: 'No secrets in client code', how: 'NEXT_PUBLIC_ prefix exposes to browser. Use server-only env vars' },
      { check: 'npm audit clean', how: 'Run: npm audit. Fix high/critical. Update deps regularly' },
      { check: 'SQL injection prevention', how: 'Use ORM (Prisma, Drizzle) with parameterized queries — never string concat' },
      { check: 'Rate limiting on API routes', how: 'Use Upstash Redis or Vercel rate limiting middleware' },
      { check: 'Auth on all protected routes', how: 'Middleware checks session before reaching route handlers' },
    ]
  },

  cro: {
    title: 'CRO (Conversion Rate Optimization) Checklist',
    items: [
      { check: 'Clear H1 + UVP above fold', how: 'User sees what you do and why it matters without scrolling' },
      { check: 'Primary CTA visible immediately', how: 'Contrasting color, strong verb: "Start Free Trial" not "Submit"' },
      { check: 'Social proof near CTAs', how: 'Logos of known clients, testimonials, "Join 10,000+ users"' },
      { check: 'Frictionless form', how: 'Minimum fields. Ask email, not phone. Progressive disclosure for long forms' },
      { check: 'Mobile touch targets ≥ 44×44px', how: 'min-height: 44px on all buttons and links' },
      { check: 'Page speed < 3s on 3G', how: 'Slow load = high bounce. Test with WebPageTest on "Fast 3G"' },
      { check: 'Trust signals', how: 'SSL badge, money-back guarantee, privacy policy link, company info' },
      { check: 'Pricing anchoring', how: 'Show crossed-out original price, highlight recommended tier' },
      { check: 'Exit intent / urgency', how: 'Countdown timer (if genuine), "Only 3 spots left" — only if true' },
      { check: 'A/B test structure ready', how: 'data-variant="a|b" attributes, analytics events on CTA clicks' },
      { check: 'Analytics events on key actions', how: 'CTA click, form submit, pricing view, scroll depth' },
      { check: 'Error recovery in forms', how: 'Inline validation, preserve filled data on error, clear error messages' },
    ]
  },

  launch: {
    title: 'Pre-Launch Checklist',
    items: [
      { check: 'Favicon and app icons', how: 'favicon.ico, apple-touch-icon.png, og:image' },
      { check: '404 page exists', how: 'app/not-found.tsx with link back to home' },
      { check: 'Error boundary', how: 'app/error.tsx — catches runtime errors in production' },
      { check: 'Loading states', how: 'app/loading.tsx — shown during server component fetching' },
      { check: 'Environment variables set', how: 'All NEXT_PUBLIC_ and server vars in Vercel dashboard' },
      { check: 'Domain + SSL configured', how: 'Custom domain in Vercel, DNS propagated, HTTPS forced' },
      { check: 'Google Search Console', how: 'Verify domain, submit sitemap.xml' },
      { check: 'Analytics connected', how: 'Plausible / Fathom / GA4 — verify events fire' },
      { check: 'Cross-browser test', how: 'Chrome, Firefox, Safari, Edge — especially Safari on iOS' },
      { check: 'Performance budget met', how: 'Run Lighthouse on prod URL — not localhost' },
      { check: 'All links working', how: 'No 404s in internal nav, footer, CTAs' },
      { check: 'Form submissions tested', how: 'Send test submission, verify delivery, check spam folder' },
    ]
  }
};
