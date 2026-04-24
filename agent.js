/**
 * Web Architect MCP Server 2026
 * Tools: selection matrix, MUI docs, design systems catalog,
 *        prompts, principles, fetch_docs, scaffold
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from '@modelcontextprotocol/sdk/types.js';

// ─── KNOWLEDGE BASE ───────────────────────────────────────────────────────────

const KNOWLEDGE_DATE = '2026-04-25';
const VERSION = '3.0.0';

const SELECTION_MATRIX = {
  "landing / custom design": {
    stack: "shadcn/ui + Radix UI + Tailwind v4",
    install: "npx shadcn@latest init",
    note: "Maximum design flexibility, minimal bundle"
  },
  "enterprise / b2b": {
    stack: "@mui/material + @mui/x",
    install: "npm install @mui/material @emotion/react @emotion/styled",
    note: "40+ components, corporate style, Material Design"
  },
  "dashboard / admin panel": {
    stack: "@mui/material + @mui/x-data-grid + @mui/x-charts",
    install: "npm install @mui/material @emotion/react @emotion/styled @mui/x-data-grid @mui/x-charts",
    note: "Tables, charts, filters — everything out of the box"
  },
  "finance / analytics": {
    stack: "IBM Carbon or Intuit Harmony",
    install: "npm install @carbon/react",
    note: "Specialized for financial interfaces"
  },
  "e-commerce": {
    stack: "Shopify Polaris or Tailwind-first",
    install: "npm install @shopify/polaris",
    note: "Polaris if Shopify ecosystem; otherwise Tailwind + custom"
  },
  "microsoft-style / office": {
    stack: "Fluent UI",
    install: "npm install @fluentui/react-components",
    note: "Official Microsoft design system"
  },
  "government / public sector": {
    stack: "GOV.UK Design System or USWDS",
    install: "npm install govuk-frontend",
    note: "Strict accessibility requirements, battle-tested patterns"
  },
  "minimal bundle / zero dependencies": {
    stack: "Tailwind v4 + custom CSS tokens",
    install: "npm install tailwindcss@next @tailwindcss/vite",
    note: "Zero-dependency UI, full control"
  },
  "headless / custom design with logic": {
    stack: "@mui/base or Radix UI",
    install: "npm install @mui/base",
    note: "Component logic without styles — style however you want"
  }
};

const MUI_PACKAGES = {
  "@mui/material": {
    description: "Google Material Design, 40+ components",
    install: "npm install @mui/material @emotion/react @emotion/styled",
    optional: "npm install @fontsource/roboto @mui/icons-material",
    components: [
      "Button, IconButton, Fab",
      "TextField, Checkbox, Radio, Select, Slider, Switch, Autocomplete",
      "Table, DataGrid (from @mui/x)",
      "Card, Paper, Accordion, List",
      "Box, Container, Grid, Stack",
      "Tabs, Drawer, Menu, AppBar, Breadcrumbs, Pagination",
      "Dialog, Alert, Snackbar, CircularProgress, Skeleton, Tooltip",
      "Typography, Avatar, Badge, Chip, Rating, Stepper"
    ],
    theming: `import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: { primary: { main: '#1976d2' }, mode: 'light' },
  typography: { fontFamily: '"InterVariable", system-ui, sans-serif' },
  shape: { borderRadius: 8 },
});

// In layout.tsx ("use client"):
<ThemeProvider theme={theme}><CssBaseline />{children}</ThemeProvider>`,
    treeshaking: "Import from @mui/material/Button, not from @mui/material"
  },
  "@mui/base": {
    description: "Headless components without styles — full design control",
    install: "npm install @mui/base",
    components: ["Button, Input, Select, Menu, Modal, Slider, Tabs, Tooltip"],
    note: "Use with Tailwind or CSS Modules for styling"
  },
  "@mui/joy": {
    description: "Joy Design System — modern style without Material Design (beta)",
    install: "npm install @mui/joy @emotion/react @emotion/styled",
    note: "Do NOT mix with @mui/material in the same project",
    theming: `import { extendTheme, CssVarsProvider } from '@mui/joy/styles';
const theme = extendTheme({ colorSchemes: { light: { palette: { primary: { 500: '#your-color' } } } } });
<CssVarsProvider theme={theme}>{children}</CssVarsProvider>`
  },
  "@mui/x-data-grid": {
    description: "High-performance data tables",
    install: "npm install @mui/x-data-grid",
    installPro: "npm install @mui/x-data-grid-pro  # sorting, grouping, export",
    features: ["Sort, filter, pagination", "Row selection", "Virtualization (millions of rows)", "CSV/Excel export (Pro)", "Row grouping (Pro)"],
    example: `import { DataGrid } from '@mui/x-data-grid';
const columns = [{ field: 'id' }, { field: 'name', headerName: 'Name', width: 150 }];
<DataGrid rows={rows} columns={columns} pageSizeOptions={[10, 25, 50]} />`
  },
  "@mui/x-charts": {
    description: "Charts and data visualization",
    install: "npm install @mui/x-charts",
    types: ["BarChart", "LineChart", "PieChart", "ScatterChart", "SparkLineChart"],
    example: `import { BarChart } from '@mui/x-charts/BarChart';
<BarChart xAxis={[{ data: ['Q1','Q2','Q3'] }]} series={[{ data: [4, 3, 5] }]} width={500} height={300} />`
  },
  "@mui/x-date-pickers": {
    description: "Calendar and date/time inputs",
    install: "npm install @mui/x-date-pickers dayjs",
    components: ["DatePicker", "TimePicker", "DateTimePicker", "DateRangePicker"],
    example: `import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
<LocalizationProvider dateAdapter={AdapterDayjs}>
  <DatePicker label="Date" />
</LocalizationProvider>`
  },
  "@mui/x-tree-view": {
    description: "Hierarchical data (TreeView)",
    install: "npm install @mui/x-tree-view",
    example: `import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
<SimpleTreeView>
  <TreeItem itemId="1" label="Parent">
    <TreeItem itemId="2" label="Child" />
  </TreeItem>
</SimpleTreeView>`
  }
};

const DESIGN_SYSTEMS_CATALOG = [
  { name: "IBM Carbon",           url: "carbondesignsystem.com",        domain: "enterprise",    install: "npm install @carbon/react" },
  { name: "Atlassian",            url: "atlassian.design",              domain: "enterprise",    install: "npm install @atlaskit/button" },
  { name: "AWS Cloudscape",       url: "cloudscape.design",            domain: "cloud",         install: "npm install @cloudscape-design/components" },
  { name: "Shopify Polaris",      url: "polaris.shopify.com",          domain: "e-commerce",    install: "npm install @shopify/polaris" },
  { name: "GitHub Primer",        url: "primer.style",                 domain: "dev-tools",     install: "npm install @primer/react" },
  { name: "GitLab Pajamas",       url: "design.gitlab.com",           domain: "dev-tools",     install: "npm install @gitlab/ui" },
  { name: "Microsoft Fluent UI",  url: "fluentui.dev",                 domain: "enterprise",    install: "npm install @fluentui/react-components" },
  { name: "Adobe Spectrum",       url: "spectrum.adobe.com",           domain: "creative",      install: "npm install @adobe/react-spectrum" },
  { name: "Salesforce Lightning", url: "lightningdesignsystem.com",   domain: "crm",           install: "npm install @salesforce-ux/design-system" },
  { name: "Twilio Paste",         url: "paste.twilio.com",             domain: "telecom",       install: "npm install @twilio-paste/core" },
  { name: "Pinterest Gestalt",    url: "gestalt.pinterest.systems",    domain: "social",        install: "npm install gestalt" },
  { name: "GOV.UK Design System", url: "gov.uk/design-system",        domain: "government",    install: "npm install govuk-frontend" },
  { name: "Mantine",              url: "mantine.dev",                  domain: "components",    install: "npm install @mantine/core @mantine/hooks" },
  { name: "Chakra UI",            url: "chakra-ui.com",                domain: "components",    install: "npm install @chakra-ui/react" },
  { name: "Elastic EUI",          url: "elastic.github.io/eui",       domain: "search/data",   install: "npm install @elastic/eui" },
  { name: "Radix UI",             url: "radix-ui.com",                 domain: "headless",      install: "npm install @radix-ui/react-dialog" },
  { name: "shadcn/ui",            url: "ui.shadcn.com",                domain: "headless",      install: "npx shadcn@latest init" },
  { name: "Intuit Harmony",       url: "designsystem.quickbooks.com", domain: "finance",       install: "—" },
  { name: "Morningstar DS",       url: "designsystem.morningstar.com",domain: "finance",       install: "—" },
  { name: "NASA WDS",             url: "nasa.github.io/nasawds-site", domain: "government",    install: "npm install nasawds" }
];

const PRINCIPLES = `
## Web Architect 2026 — Principles
Knowledge date: ${KNOWLEDGE_DATE} | Version: ${VERSION}

### THINKING
1. Content → Performance → Accessibility → Conversion
2. Server/Client Boundary: minimal JS on client, Island Architecture / RSC
3. CSS First: Tailwind v4 + :has(), @property, oklch, container queries
4. Zero-Compromise A11y: WCAG 2.2 AA/AAA, semantics, focus traps
5. AI-Search Ready: JSON-LD, semantic markup
6. Sustainable Web: lazy loading, modern image formats, carbon footprint
7. Design System Aware: pick the right system for the job

### DEFAULT STACK
- Framework: Next.js 15 (App Router, PPR, Server Actions)
- Styling: Tailwind CSS v4, CSS Variables, oklch, clamp()
- UI Kit: shadcn/ui + Radix UI (or MUI per matrix)
- Animation: Framer Motion / GSAP / CSS @view-timeline
- Build: Turbopack, Biome, pnpm, Lighthouse CI, axe-core
- Deploy: Vercel / Cloudflare / Netlify

### PERFORMANCE BUDGET
- LCP < 2.5s, CLS < 0.1, INP < 200ms, JS < 150kb gzipped
- Images: avif/webp, lazy loading, responsive srcset

### FORBIDDEN
- !important in CSS (except legacy)
- Hardcoded colors instead of tokens/variables
- Ignoring prefers-reduced-motion, prefers-color-scheme
- Secrets on client, missing CSP/headers
- Mixing MUI and shadcn/ui without justification

### RESPONSE FORMAT
1. Architecture (files + server/client split)
2. Design System (choice + tokens, typography, color)
3. Code (production-ready, typed, a11y/perf)
4. Deploy/CI (commands, env, headers)
5. Checklist (LCP/CLS/INP, a11y, SEO, CRO, security)
`;

const PROMPTS = {
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

// ─── SCAFFOLD TEMPLATES ───────────────────────────────────────────────────────

const SCAFFOLDS = {
  "nextjs-landing": {
    description: "Next.js 15 + Tailwind v4 + shadcn/ui landing page",
    files: {
      "package.json": `{
  "name": "my-landing",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "biome check .",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "@biomejs/biome": "^1.9.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "typescript": "^5.6.0"
  }
}`,
      "app/layout.tsx": `import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'My Product — Your Value Proposition',
  description: 'Short description 150-160 chars.',
  openGraph: {
    title: 'My Product',
    description: 'Short description',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`,
      "app/globals.css": `@import "tailwindcss";

@theme {
  --color-bg: oklch(98% 0.005 264);
  --color-bg-alt: oklch(94% 0.01 264);
  --color-text: oklch(15% 0.02 264);
  --color-text-muted: oklch(40% 0.03 264);
  --color-primary: oklch(55% 0.22 260);
  --color-primary-hover: oklch(50% 0.22 260);
  --color-accent: oklch(65% 0.18 140);
  --font-sans: "InterVariable", system-ui, sans-serif;
  --font-mono: "GeistMono", monospace;
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: oklch(12% 0.02 264);
    --color-bg-alt: oklch(18% 0.02 264);
    --color-text: oklch(95% 0.005 264);
    --color-text-muted: oklch(65% 0.02 264);
    --color-primary: oklch(70% 0.18 260);
  }
}

* { box-sizing: border-box; margin: 0; }
body { background: var(--color-bg); color: var(--color-text); font-family: var(--font-sans); }`,
      "app/page.tsx": `import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Pricing from '@/components/Pricing';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import { Organization, WebPage } from '@/components/JsonLd';

export default function Home() {
  return (
    <main id="main-content">
      <a href="#main-content" className="sr-only focus:not-sr-only">Skip to content</a>
      <Organization />
      <WebPage />
      <Hero />
      <Features />
      <Pricing />
      <ContactForm />
      <Footer />
    </main>
  );
}`,
      "components/Hero.tsx": `export default function Hero() {
  return (
    <section aria-label="Hero" className="min-h-[90vh] flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-[clamp(2rem,5vw+1rem,4.5rem)] font-bold leading-tight">
          Your Clear Value Proposition
        </h1>
        <p className="mt-4 text-[clamp(1rem,2vw+0.5rem,1.5rem)] text-[var(--color-text-muted)] max-w-2xl mx-auto">
          One sentence explaining what you do and for whom.
        </p>
        <div className="mt-8 flex gap-4 justify-center flex-wrap">
          <a
            href="#contact"
            className="px-8 py-3 rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Get Started
          </a>
          <a
            href="#features"
            className="px-8 py-3 rounded-[var(--radius-md)] border border-[var(--color-primary)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-bg-alt)] transition-colors"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}`,
      "components/Features.tsx": `const features = [
  { title: 'Feature One', description: 'Benefit-focused description of this feature.' },
  { title: 'Feature Two', description: 'Benefit-focused description of this feature.' },
  { title: 'Feature Three', description: 'Benefit-focused description of this feature.' },
  { title: 'Feature Four', description: 'Benefit-focused description of this feature.' },
  { title: 'Feature Five', description: 'Benefit-focused description of this feature.' },
  { title: 'Feature Six', description: 'Benefit-focused description of this feature.' },
];

export default function Features() {
  return (
    <section id="features" aria-labelledby="features-heading" className="py-24 px-4 bg-[var(--color-bg-alt)]">
      <div className="max-w-6xl mx-auto">
        <h2 id="features-heading" className="text-[clamp(1.5rem,3vw+0.5rem,2.5rem)] font-bold text-center mb-16">
          Why Choose Us
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 list-none">
          {features.map((f) => (
            <li key={f.title} className="p-6 rounded-[var(--radius-lg)] bg-[var(--color-bg)] border border-[var(--color-bg-alt)]">
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-[var(--color-text-muted)]">{f.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}`,
      "components/Pricing.tsx": `const tiers = [
  { name: 'Starter', price: '$0', features: ['Feature A', 'Feature B', '1 user'], cta: 'Get Started', highlighted: false },
  { name: 'Pro', price: '$29/mo', features: ['Everything in Starter', 'Feature C', 'Feature D', '5 users'], cta: 'Start Free Trial', highlighted: true },
  { name: 'Enterprise', price: 'Custom', features: ['Everything in Pro', 'SSO', 'SLA', 'Unlimited users'], cta: 'Contact Sales', highlighted: false },
];

export default function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 id="pricing-heading" className="text-[clamp(1.5rem,3vw+0.5rem,2.5rem)] font-bold text-center mb-16">
          Simple Pricing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={\`p-8 rounded-[var(--radius-lg)] border \${tier.highlighted ? 'border-[var(--color-primary)] shadow-lg' : 'border-[var(--color-bg-alt)]'}\`}
            >
              <h3 className="font-bold text-xl">{tier.name}</h3>
              <p className="mt-2 text-3xl font-bold">{tier.price}</p>
              <ul className="mt-6 space-y-2 text-[var(--color-text-muted)]">
                {tier.features.map((f) => <li key={f}>✓ {f}</li>)}
              </ul>
              <a
                href="#contact"
                className={\`mt-8 block text-center px-6 py-3 rounded-[var(--radius-md)] font-semibold transition-colors \${
                  tier.highlighted
                    ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]'
                    : 'border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-bg-alt)]'
                }\`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}`,
      "components/ContactForm.tsx": `'use client';
import { useState } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="contact" aria-labelledby="contact-heading" className="py-24 px-4 bg-[var(--color-bg-alt)]">
      <div className="max-w-lg mx-auto">
        <h2 id="contact-heading" className="text-[clamp(1.5rem,3vw+0.5rem,2.5rem)] font-bold text-center mb-8">
          Get in Touch
        </h2>
        {status === 'success' ? (
          <p role="alert" className="text-center text-[var(--color-accent)]">Thanks! We'll be in touch soon.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input
                id="email" name="email" type="email" required autoComplete="email"
                className="w-full px-4 py-2 rounded-[var(--radius-md)] border border-[var(--color-bg-alt)] bg-[var(--color-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
              <textarea
                id="message" name="message" rows={4} required
                className="w-full px-4 py-2 rounded-[var(--radius-md)] border border-[var(--color-bg-alt)] bg-[var(--color-bg)] resize-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]"
              />
            </div>
            {status === 'error' && <p role="alert" className="text-red-500 text-sm">Something went wrong. Please try again.</p>}
            <button
              type="submit" disabled={status === 'loading'}
              className="px-8 py-3 rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] disabled:opacity-50 transition-colors"
            >
              {status === 'loading' ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}`,
      "components/Footer.tsx": `export default function Footer() {
  return (
    <footer className="py-8 px-4 border-t border-[var(--color-bg-alt)]">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[var(--color-text-muted)] text-sm">
        <p>© {new Date().getFullYear()} Your Company. All rights reserved.</p>
        <nav aria-label="Footer navigation">
          <ul className="flex gap-6 list-none">
            <li><a href="/privacy" className="hover:text-[var(--color-text)] transition-colors">Privacy</a></li>
            <li><a href="/terms" className="hover:text-[var(--color-text)] transition-colors">Terms</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}`,
      "components/JsonLd.tsx": `export function Organization() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Your Company',
        url: 'https://yoursite.com',
        logo: 'https://yoursite.com/logo.png',
      })}}
    />
  );
}

export function WebPage() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Your Product — Value Proposition',
        description: 'Short description.',
        url: 'https://yoursite.com',
      })}}
    />
  );
}`,
      "next.config.ts": `import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; font-src 'self'; connect-src 'self';"
        },
      ],
    }];
  },
};

export default nextConfig;`,
      "tsconfig.json": `{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`
    }
  },

  "nextjs-dashboard": {
    description: "Next.js 15 + MUI + @mui/x-data-grid + @mui/x-charts admin dashboard",
    files: {
      "package.json": `{
  "name": "my-dashboard",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "biome check .",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@mui/material": "^6.0.0",
    "@mui/x-data-grid": "^7.0.0",
    "@mui/x-charts": "^7.0.0",
    "@emotion/react": "^11.13.0",
    "@emotion/styled": "^11.13.0"
  },
  "devDependencies": {
    "@biomejs/biome": "^1.9.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "typescript": "^5.6.0"
  }
}`,
      "app/layout.tsx": `import type { Metadata } from 'next';
import { Providers } from './providers';

export const metadata: Metadata = { title: 'Admin Dashboard' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}`,
      "app/providers.tsx": `'use client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: { primary: { main: '#1976d2' }, mode: 'light' },
  typography: { fontFamily: '"InterVariable", system-ui, sans-serif' },
  shape: { borderRadius: 8 },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}`,
      "app/page.tsx": `import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { StatsCards } from '@/components/StatsCards';
import { DataTable } from '@/components/DataTable';
import { RevenueChart } from '@/components/RevenueChart';

export default function Dashboard() {
  return (
    <Box component="main" sx={{ p: 4, maxWidth: 1400, mx: 'auto' }}>
      <Typography variant="h4" component="h1" fontWeight={700} mb={4}>
        Dashboard
      </Typography>
      <StatsCards />
      <Grid container spacing={4} mt={0}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Revenue</Typography>
            <RevenueChart />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" mb={2}>Quick Stats</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Recent Orders</Typography>
            <DataTable />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}`,
      "components/StatsCards.tsx": `import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const stats = [
  { label: 'Total Revenue', value: '$48,295', change: '+12%' },
  { label: 'Active Users', value: '2,847', change: '+5%' },
  { label: 'Orders', value: '1,293', change: '+8%' },
  { label: 'Conversion Rate', value: '3.2%', change: '+0.4%' },
];

export function StatsCards() {
  return (
    <Grid container spacing={3} mb={4}>
      {stats.map((s) => (
        <Grid item xs={12} sm={6} lg={3} key={s.label}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary">{s.label}</Typography>
            <Typography variant="h5" fontWeight={700} mt={1}>{s.value}</Typography>
            <Typography variant="body2" color="success.main" mt={0.5}>{s.change} this month</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}`,
      "components/RevenueChart.tsx": `'use client';
import { LineChart } from '@mui/x-charts/LineChart';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const revenue = [12000, 18000, 15000, 24000, 21000, 28000];

export function RevenueChart() {
  return (
    <LineChart
      xAxis={[{ data: months, scaleType: 'point' }]}
      series={[{ data: revenue, label: 'Revenue ($)', area: true }]}
      height={280}
    />
  );
}`,
      "components/DataTable.tsx": `'use client';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'customer', headerName: 'Customer', flex: 1 },
  { field: 'product', headerName: 'Product', flex: 1 },
  { field: 'amount', headerName: 'Amount', width: 120, valueFormatter: (v) => \`$\${v}\` },
  { field: 'status', headerName: 'Status', width: 130 },
  { field: 'date', headerName: 'Date', width: 130 },
];

const rows = [
  { id: 1, customer: 'Alice Johnson', product: 'Pro Plan', amount: 29, status: 'Paid', date: '2026-04-20' },
  { id: 2, customer: 'Bob Smith', product: 'Starter', amount: 0, status: 'Free', date: '2026-04-19' },
  { id: 3, customer: 'Carol White', product: 'Enterprise', amount: 299, status: 'Paid', date: '2026-04-18' },
];

export function DataTable() {
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      pageSizeOptions={[10, 25]}
      autoHeight
      disableRowSelectionOnClick
    />
  );
}`
    }
  },

  "nextjs-saas": {
    description: "Next.js 15 SaaS starter: auth-ready layout, dashboard shell, API routes, Zod validation",
    files: {
      "app/layout.tsx": `import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'MySaaS', template: '%s | MySaaS' },
  description: 'Your SaaS description.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}`,
      "app/(marketing)/page.tsx": `export default function MarketingPage() {
  return <main>Landing page — replace with Hero, Features, Pricing, CTA</main>;
}`,
      "app/(app)/dashboard/page.tsx": `import { requireAuth } from '@/lib/auth';

export default async function DashboardPage() {
  const user = await requireAuth();
  return (
    <main>
      <h1>Welcome, {user.name}</h1>
    </main>
  );
}`,
      "app/api/contact/route.ts": `import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  message: z.string().min(10).max(1000),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const result = schema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  // TODO: send email / save to DB
  return NextResponse.json({ success: true });
}`,
      "lib/auth.ts": `import { redirect } from 'next/navigation';

export interface User { id: string; name: string; email: string; }

// Replace with your actual auth (NextAuth, Clerk, Lucia, etc.)
export async function getUser(): Promise<User | null> {
  return null;
}

export async function requireAuth(): Promise<User> {
  const user = await getUser();
  if (!user) redirect('/login');
  return user;
}`,
      "lib/validations.ts": `import { z } from 'zod';

export const contactSchema = z.object({
  email: z.string().email('Invalid email'),
  message: z.string().min(10, 'Min 10 characters').max(1000, 'Max 1000 characters'),
});

export const signUpSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;`,
      "middleware.ts": `import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/settings', '/api/user'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtected) {
    // Replace with your actual session check
    const hasSession = request.cookies.has('session');
    if (!hasSession) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };`
    }
  },

  "nextjs-blog": {
    description: "Next.js 15 blog with MDX, dynamic routes, RSS, sitemap",
    files: {
      "app/blog/page.tsx": `import { getAllPosts } from '@/lib/posts';
import Link from 'next/link';

export const metadata = { title: 'Blog' };

export default async function BlogPage() {
  const posts = await getAllPosts();
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-12">Blog</h1>
      <ul className="space-y-8">
        {posts.map(post => (
          <li key={post.slug}>
            <article>
              <time className="text-sm text-gray-500" dateTime={post.date}>{post.date}</time>
              <h2 className="text-2xl font-semibold mt-1">
                <Link href={\`/blog/\${post.slug}\`} className="hover:underline">{post.title}</Link>
              </h2>
              <p className="mt-2 text-gray-600">{post.excerpt}</p>
            </article>
          </li>
        ))}
      </ul>
    </main>
  );
}`,
      "app/blog/[slug]/page.tsx": `import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <article>
        <header className="mb-8">
          <time className="text-sm text-gray-500" dateTime={post.date}>{post.date}</time>
          <h1 className="text-4xl font-bold mt-2">{post.title}</h1>
        </header>
        <div className="prose prose-lg" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </main>
  );
}`,
      "lib/posts.ts": `import fs from 'fs/promises';
import path from 'path';

export interface Post { slug: string; title: string; date: string; excerpt: string; content: string; }

const POSTS_DIR = path.join(process.cwd(), 'content/posts');

export async function getAllPosts(): Promise<Post[]> {
  const files = await fs.readdir(POSTS_DIR).catch(() => []);
  const posts = await Promise.all(
    files.filter(f => f.endsWith('.md')).map(async (file) => {
      const slug = file.replace(/\.md$/, '');
      return getPostBySlug(slug);
    })
  );
  return posts.filter(Boolean).sort((a, b) => b!.date.localeCompare(a!.date)) as Post[];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const raw = await fs.readFile(path.join(POSTS_DIR, \`\${slug}.md\`), 'utf-8');
    // Simple frontmatter parse — use gray-matter for production
    const [, frontmatter, ...body] = raw.split('---');
    const meta = Object.fromEntries(frontmatter.trim().split('\\n').map(l => l.split(': ')));
    return { slug, title: meta.title, date: meta.date, excerpt: meta.excerpt, content: body.join('---') };
  } catch { return null; }
}`,
      "app/sitemap.ts": `import { getAllPosts } from '@/lib/posts';
import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://yoursite.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: \`\${BASE_URL}/blog\`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ...posts.map(p => ({
      url: \`\${BASE_URL}/blog/\${p.slug}\`,
      lastModified: new Date(p.date),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}`,
      "app/rss.xml/route.ts": `import { getAllPosts } from '@/lib/posts';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://yoursite.com';

export async function GET() {
  const posts = await getAllPosts();
  const items = posts.map(p => \`
    <item>
      <title><![CDATA[\${p.title}]]></title>
      <link>\${BASE_URL}/blog/\${p.slug}</link>
      <guid>\${BASE_URL}/blog/\${p.slug}</guid>
      <pubDate>\${new Date(p.date).toUTCString()}</pubDate>
      <description><![CDATA[\${p.excerpt}]]></description>
    </item>\`).join('');

  return new Response(\`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>My Blog</title>
  <link>\${BASE_URL}</link>
  <description>Latest posts</description>
  \${items}
</channel></rss>\`, { headers: { 'Content-Type': 'application/xml' } });
}`
    }
  }
};

// ─── MCP SERVER ───────────────────────────────────────────────────────────────

const server = new Server(
  { name: 'web-architect-2026', version: VERSION },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_selection_matrix',
      description: 'Design system selection matrix by project type. Returns recommended stack and install command.',
      inputSchema: {
        type: 'object',
        properties: {
          project_type: {
            type: 'string',
            description: 'Project type (optional). Returns full matrix if omitted. Examples: "landing", "dashboard", "enterprise", "e-commerce"'
          }
        }
      }
    },
    {
      name: 'get_mui_package',
      description: 'MUI package docs: components, install, code examples, theming.',
      inputSchema: {
        type: 'object',
        properties: {
          package: {
            type: 'string',
            description: 'Package name: @mui/material, @mui/base, @mui/joy, @mui/x-data-grid, @mui/x-charts, @mui/x-date-pickers, @mui/x-tree-view'
          }
        },
        required: ['package']
      }
    },
    {
      name: 'get_design_system_info',
      description: 'Info about a specific design system: docs URL, domain, install command.',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'System name: "IBM Carbon", "Shopify Polaris", "Fluent UI", "Mantine", etc.'
          },
          domain: {
            type: 'string',
            description: 'Domain filter (optional): "enterprise", "e-commerce", "government", "finance", "headless", etc.'
          }
        }
      }
    },
    {
      name: 'get_prompts',
      description: 'Ready-to-use prompt templates for building sites and components.',
      inputSchema: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description: 'Category: landing, mui_site, mui_dashboard, design_system, component, performance, a11y, seo, security, deploy. Returns list if omitted.'
          }
        }
      }
    },
    {
      name: 'get_agent_principles',
      description: 'Web Architect 2026 principles, rules, stack, and response format.',
      inputSchema: { type: 'object', properties: {} }
    },
    {
      name: 'list_design_systems',
      description: 'Full design systems catalog with URL, domain and install command.',
      inputSchema: {
        type: 'object',
        properties: {
          domain: {
            type: 'string',
            description: 'Domain filter (optional): enterprise, e-commerce, government, finance, headless, components, dev-tools, cloud, etc.'
          }
        }
      }
    },
    {
      name: 'fetch_docs',
      description: 'Fetch and return the text content of any documentation URL. Use to get latest API docs, changelogs, or component references.',
      inputSchema: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'Full URL to fetch (e.g. https://nextjs.org/docs/app/api-reference/functions/fetch)'
          },
          selector: {
            type: 'string',
            description: 'Optional: CSS-like hint to narrow content — "main", "article", "#content". Does basic tag stripping otherwise.'
          }
        },
        required: ['url']
      }
    },
    {
      name: 'scaffold',
      description: 'Generate a complete project scaffold with all files and code. Returns file tree + full content ready to create.',
      inputSchema: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            description: 'Scaffold type: nextjs-landing, nextjs-dashboard, nextjs-saas, nextjs-blog. Returns available types if omitted.'
          }
        }
      }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'get_selection_matrix': {
      if (args?.project_type) {
        const key = Object.keys(SELECTION_MATRIX).find(k =>
          k.toLowerCase().includes(args.project_type.toLowerCase())
        );
        if (key) {
          const rec = SELECTION_MATRIX[key];
          return { content: [{ type: 'text', text: `**${key}**\n\nStack: ${rec.stack}\nInstall: \`${rec.install}\`\nNote: ${rec.note}` }] };
        }
        return { content: [{ type: 'text', text: `Type "${args.project_type}" not found. Available: ${Object.keys(SELECTION_MATRIX).join(', ')}` }] };
      }
      const text = Object.entries(SELECTION_MATRIX)
        .map(([type, rec]) => `**${type}**\n  Stack: ${rec.stack}\n  Install: \`${rec.install}\`\n  ${rec.note}`)
        .join('\n\n');
      return { content: [{ type: 'text', text: `# Design System Selection Matrix\n\n${text}` }] };
    }

    case 'get_mui_package': {
      const pkg = args?.package;
      const data = MUI_PACKAGES[pkg];
      if (!data) {
        return { content: [{ type: 'text', text: `Package "${pkg}" not found. Available: ${Object.keys(MUI_PACKAGES).join(', ')}` }] };
      }
      const lines = [
        `# ${pkg}`,
        `**${data.description}**`,
        `\n**Install:** \`${data.install}\``,
        data.optional ? `**Optional:** \`${data.optional}\`` : null,
        data.installPro ? `**Pro:** \`${data.installPro}\`` : null,
        data.components ? `\n**Components:**\n${Array.isArray(data.components) ? data.components.map(c => `- ${c}`).join('\n') : data.components}` : null,
        data.features ? `\n**Features:**\n${data.features.map(f => `- ${f}`).join('\n')}` : null,
        data.types ? `\n**Chart types:** ${data.types.join(', ')}` : null,
        data.theming ? `\n**Theming:**\n\`\`\`tsx\n${data.theming}\n\`\`\`` : null,
        data.example ? `\n**Example:**\n\`\`\`tsx\n${data.example}\n\`\`\`` : null,
        data.treeshaking ? `\n**Tree-shaking:** ${data.treeshaking}` : null,
        data.note ? `\n**Note:** ${data.note}` : null,
      ].filter(Boolean).join('\n');
      return { content: [{ type: 'text', text: lines }] };
    }

    case 'get_design_system_info': {
      const { name: dsName, domain } = args || {};
      let results = DESIGN_SYSTEMS_CATALOG;
      if (dsName) results = results.filter(ds => ds.name.toLowerCase().includes(dsName.toLowerCase()));
      if (domain) results = results.filter(ds => ds.domain.toLowerCase().includes(domain.toLowerCase()));
      if (!results.length) {
        return { content: [{ type: 'text', text: 'Nothing found. Use list_design_systems to browse the full catalog.' }] };
      }
      const text = results.map(ds =>
        `**${ds.name}** (${ds.domain})\n  Docs: ${ds.url}\n  Install: \`${ds.install}\``
      ).join('\n\n');
      return { content: [{ type: 'text', text: text }] };
    }

    case 'get_prompts': {
      const category = args?.category;
      if (!category) {
        return { content: [{ type: 'text', text: `Available prompt categories: ${Object.keys(PROMPTS).join(', ')}\n\nSpecify category to get a prompt.` }] };
      }
      const prompt = PROMPTS[category];
      if (!prompt) {
        return { content: [{ type: 'text', text: `Category "${category}" not found. Available: ${Object.keys(PROMPTS).join(', ')}` }] };
      }
      return { content: [{ type: 'text', text: `# Prompt: ${category}\n\n\`\`\`\n${prompt}\n\`\`\`` }] };
    }

    case 'get_agent_principles': {
      return { content: [{ type: 'text', text: PRINCIPLES }] };
    }

    case 'list_design_systems': {
      const domain = args?.domain;
      let results = DESIGN_SYSTEMS_CATALOG;
      if (domain) results = results.filter(ds => ds.domain.toLowerCase().includes(domain.toLowerCase()));
      const text = results.map(ds =>
        `- **${ds.name}** (${ds.domain}) — ${ds.url} | \`${ds.install}\``
      ).join('\n');
      const header = domain ? `# Design Systems: ${domain}\n\n` : `# Design Systems Catalog (${results.length})\n\n`;
      return { content: [{ type: 'text', text: header + text }] };
    }

    case 'fetch_docs': {
      const url = args?.url;
      if (!url || !url.startsWith('http')) {
        return { content: [{ type: 'text', text: 'Invalid URL. Must start with http:// or https://' }], isError: true };
      }
      try {
        const response = await fetch(url, {
          headers: { 'User-Agent': 'web-architect-mcp/3.0 (documentation fetcher)' },
          signal: AbortSignal.timeout(10000),
        });
        if (!response.ok) {
          return { content: [{ type: 'text', text: `HTTP ${response.status}: ${response.statusText}` }], isError: true };
        }
        const contentType = response.headers.get('content-type') ?? '';
        const raw = await response.text();

        let text = raw;
        if (contentType.includes('text/html')) {
          // Strip scripts, styles, nav, footer
          text = raw
            .replace(/<script[\s\S]*?<\/script>/gi, '')
            .replace(/<style[\s\S]*?<\/style>/gi, '')
            .replace(/<nav[\s\S]*?<\/nav>/gi, '')
            .replace(/<footer[\s\S]*?<\/footer>/gi, '')
            .replace(/<header[\s\S]*?<\/header>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/&nbsp;/g, ' ')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/\s{3,}/g, '\n\n')
            .trim();
        }

        // Cap at ~8000 chars to stay within context
        const truncated = text.length > 8000 ? text.slice(0, 8000) + '\n\n[... truncated — content too long]' : text;
        return { content: [{ type: 'text', text: `# ${url}\n\n${truncated}` }] };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { content: [{ type: 'text', text: `Fetch failed: ${message}` }], isError: true };
      }
    }

    case 'scaffold': {
      const type = args?.type;
      if (!type) {
        const list = Object.entries(SCAFFOLDS)
          .map(([key, s]) => `- **${key}**: ${s.description}`)
          .join('\n');
        return { content: [{ type: 'text', text: `# Available Scaffolds\n\n${list}\n\nSpecify type to get files.` }] };
      }
      const scaffold = SCAFFOLDS[type];
      if (!scaffold) {
        return { content: [{ type: 'text', text: `Scaffold "${type}" not found. Available: ${Object.keys(SCAFFOLDS).join(', ')}` }] };
      }
      const files = Object.entries(scaffold.files)
        .map(([path, content]) => `## ${path}\n\`\`\`\n${content}\n\`\`\``)
        .join('\n\n');
      const fileList = Object.keys(scaffold.files).map(f => `  ${f}`).join('\n');
      return {
        content: [{
          type: 'text',
          text: `# Scaffold: ${type}\n${scaffold.description}\n\n## Files\n${fileList}\n\n---\n\n${files}`
        }]
      };
    }

    default:
      return { content: [{ type: 'text', text: `Tool "${name}" not found.` }], isError: true };
  }
});

// ─── START ────────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
