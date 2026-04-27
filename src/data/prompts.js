export const PROMPTS = {
  landing: `Create a landing page for [product type]:
- Hero: H1 + subtitle + 2 CTAs
- Features: 3×2 grid
- Social proof: logos / testimonials
- Pricing: 3 tiers
- Contact form with validation
- Footer

Stack: Next.js 15, shadcn/ui, Tailwind v4
Requirements: LCP < 2.5s, WCAG 2.2 AA, JSON-LD, dark mode`,

  mui_site: `Create a [landing / dashboard / admin panel] with @mui/material.

Stack: Next.js 15, @mui/material, TypeScript
Sections: [list]
Brand color: [hex]

Requirements:
- createTheme() with custom palette
- ThemeProvider + CssBaseline in layout
- Import from @mui/material/Button (tree-shaking)
- Server components where no interactivity
- WCAG 2.2 AA, LCP < 2.5s`,

  mui_dashboard: `Create an admin dashboard with:
- @mui/x-data-grid: [entity] table with sort/filter
- @mui/x-charts: [bar/line/pie] chart for [metric]
- @mui/material: AppBar, Drawer navigation, stat Cards
- Dark mode via createTheme({ mode })

Data: [describe structure or "mock data"]
Routes: Next.js App Router`,

  design_system: `Create a design system for [brand]:
Colors: [primary, accent — hex or description]
Style: [minimalist / bold / corporate]
Font: [Inter / system / custom]

Create:
1. CSS tokens (oklch, --color-*, --font-*, --radius-*)
2. Tailwind @theme block
3. Typography scale (clamp())
4. Base components: Button, Input, Card, Badge
5. Dark mode tokens`,

  component: `Create component [Name] for [description].
- Server component if no interactivity, else "use client"
- Semantic HTML
- Tailwind v4 with design tokens
- ARIA and focus states
- prefers-reduced-motion support
- TypeScript props`,

  performance: `Optimize LCP for [page/component]:
- Hero image: avif/webp, preload, correct sizes
- Fonts: variable, display=swap, preload
- Critical CSS inline
- Remove render-blocking resources
- Prefetch next pages`,

  a11y: `Accessibility audit:
1. Contrast ≥ 4.5:1 (oklch)
2. Semantics: nav, main, article, section, h1–h6
3. Skip link to #main-content
4. Focus traps on modals/drawers
5. Alt text, aria-labels
6. Keyboard navigation
7. prefers-reduced-motion
8. Screen reader test (VoiceOver/NVDA)`,

  seo: `SEO optimization:
- <title> 60 chars, <meta description> 150–160
- Open Graph: og:title, og:description, og:image, og:url
- Twitter Card: summary_large_image
- JSON-LD: WebPage + Organization (+ Product if needed)
- Canonical URL, robots meta
- Sitemap.xml, hreflang for i18n`,

  security: `Configure security headers in next.config.ts:
- CSP: default-src 'self', script-src, style-src, img-src
- HSTS: max-age=63072000; includeSubDomains
- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN
- Permissions-Policy
Zod validation for all Server Actions and API routes.`,

  deploy: `Prepare deploy to [Vercel / Cloudflare / Netlify]:
1. next.config.ts: headers, redirects, image domains
2. .env.production variables
3. GitHub Actions: lint → typecheck → build → lighthouse → deploy
4. Cache: stale-while-revalidate for static assets
5. Edge Functions for geo / A/B tests`
};
