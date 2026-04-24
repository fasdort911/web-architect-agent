# Prompts for Web Architect AI Agent 2026

## Basic Prompts

### Landing Page

```
Create a landing page for [product type] with these sections:
1. Hero with H1, subtitle, 2 CTA buttons
2. Features grid with 4-6 benefits
3. Social proof (client logos or testimonials)
4. Pricing tables (3 tiers)
5. Contact form with email and message
6. Footer with navigation

Requirements:
- Mobile-first responsive design
- LCP < 2.5s
- WCAG 2.2 AA compliant
- SEO optimized (JSON-LD, meta tags)
- Dark mode via prefers-color-scheme
```

### Add a Component

```
Create a server component [ComponentName] for [describe functionality].

Requirements:
- Server component by default
- Semantic HTML
- Accessibility (aria-labels, focus states)
- Tailwind v4 with design tokens
- prefers-reduced-motion support
```

### Server Action

```
Create a server action for [e.g. "submitting a form to CRM"].

Input fields: [list fields]
Validation: Zod schema
Logic: [describe]
Response: { success: boolean, error?: string }

Requirements:
- Zod validation
- Error handling
- Rate limiting (if applicable)
- No secrets on the client
```

---

## Design Systems (MUI, catalog)

### Choosing a Design System

```
I'm building [project type: dashboard / landing / ecommerce / gov-portal / admin-panel].
Target audience: [description].
Brand: [logo/colors/style or "no brand book"].
Special requirements: [tables / charts / forms / internationalization / etc.].

Recommend a design system, explain the choice.
Provide install command and minimal setup.
```

### Material UI — Full Site

```
Create [landing / dashboard / admin panel] using @mui/material.

Stack: Next.js 15, @mui/material, @emotion/react, TypeScript
Sections: [list sections]
Brand color: [hex or description]

Requirements:
- Custom theme via createTheme()
- ThemeProvider + CssBaseline in layout
- Tree-shaking: import from @mui/material/Button (not root)
- Server components where no interactivity needed
- WCAG 2.2 AA, LCP < 2.5s
```

### Material UI — Data Grid

```
Create a data table with @mui/x-data-grid for [describe data].

Install: npm install @mui/x-data-grid @mui/material @emotion/react @emotion/styled

Requirements:
- Columns: [list fields and types]
- Sorting and filtering
- Pagination: [rows per page]
- [If needed] CSV export
- [If needed] Row selection with actions
- TypeScript row types
- Loading skeleton and empty state
```

### Material UI — Charts

```
Create a [bar / line / pie / scatter] chart with @mui/x-charts.

Install: npm install @mui/x-charts

Data: [describe structure]
Axes: [X — what, Y — what]
Legend: [yes/no]
Colors: [match theme or custom]
Responsive: [yes, via ResponsiveChartContainer]

Add: loading state, empty state, proper aria-labels.
```

### Material UI — Date Pickers

```
Add [DatePicker / TimePicker / DateRangePicker] with @mui/x-date-pickers.

Install: npm install @mui/x-date-pickers dayjs

Requirements:
- Adapter: dayjs
- [If needed] Date range (DateRangePicker)
- Locale: [en / ru / other]
- Validation: min/max date
- Integration with react-hook-form / Server Action
- Accessibility (keyboard navigation)
```

### Joy UI — Modern UI without Material Design

```
Create [component / page] with @mui/joy.

Install: npm install @mui/joy @emotion/react @emotion/styled

Requirements:
- Custom palette via extendTheme()
- Do not mix with @mui/material
- Components: [list]
- Dark mode via useColorScheme()
- TypeScript, WCAG 2.2 AA
```

### MUI Base — Headless Component

```
Create [component] with @mui/base (headless, no built-in styles).

Install: npm install @mui/base

Goal: full design control while keeping component logic.
Component: [Button / Modal / Menu / Select / Slider / other]
Styling: [Tailwind v4 / CSS Modules / styled-components]

Requirements:
- Full accessibility (ARIA, keyboard)
- Custom design matching brand book
- TypeScript types
```

### Third-Party Design System Integration

```
Integrate [system name from catalog, e.g. IBM Carbon / Shopify Polaris / Mantine] into Next.js 15.

1. Find docs: web_search "[system] Next.js integration"
2. Read: web_fetch [docs url]
3. Install required packages
4. Set up provider/theme
5. Create example component: [component]

Requirements:
- Minimal bundle (only needed packages)
- Correct Server/Client split
- WCAG 2.2 AA
```

### Custom Design System from Scratch

```
Create a custom design system for [brand description].

Brand book:
- Logo: [exists / none]
- Colors: [primary, accent, neutral — hex or description]
- Typography: [font or "choose appropriate"]
- Style: [minimalist / bold / corporate / playful]

Create:
1. Design tokens (CSS variables, oklch)
2. Typography scale (clamp(), fluid)
3. Spacing and grid system
4. Base components: Button, Input, Card, Badge
5. Dark mode tokens
6. Tailwind v4 @theme block

Requirements: WCAG 2.2 AA contrast, prefers-reduced-motion.
```

### Migration to MUI

```
Migrate components from [shadcn/ui / Bootstrap / Chakra / custom] to @mui/material.

Current stack: [describe]
Components to migrate: [list]

Steps:
1. Install @mui/material + emotion
2. Replace components with MUI equivalents
3. Preserve existing styles via sx prop or styled()
4. Configure theme to match current design
5. Check a11y — must not regress
6. Run Lighthouse — LCP must not increase
```

---

## Design System

### Create Tokens

```
Create a design system with tokens:

Colors (oklch):
- Primary: [value or description]
- Accent: [value or description]
- Background: [light/dark]
- Text: [contrast ≥ 4.5:1]

Typography:
- Font family: [Inter/system/custom]
- Fluid sizes via clamp()
- Line-height 1.5–1.7

Radii and Shadows:
- Border radius: sm/md/lg
- Box shadows: sm/md/lg

Animations:
- Duration: 150–300ms
- Easing: ease-out
- prefers-reduced-motion fallback
```

### Create Theme

```
Create a dynamic theme with support for:
- prefers-color-scheme (light/dark)
- Manual toggle via state
- CSS variables in :root
- oklch colors for perceptual uniformity
- Smooth transition on switch
```

---

## Performance

### LCP Optimization

```
Optimize LCP for page [path].

Check:
- Hero image optimized (avif/webp)
- Fonts preloaded with display=swap
- Critical CSS inlined
- No render-blocking resources
- Preload key resources
```

### Image Optimization

```
Set up image optimization:

- next/image with correct sizes
- Formats: avif > webp > original
- Lazy loading for below-fold images
- Responsive srcset
- Placeholder: blur or dominant color
- Width/height to prevent CLS
```

### Code Splitting

```
Optimize JavaScript bundle:

- Server components by default
- Dynamic import for heavy libraries
- Tree-shaking unused code
- Route-based code splitting
- Deferred loading of below-fold components
```

---

## Accessibility

### A11y Audit

```
Check accessibility of the current project:

1. Color contrast ≥ 4.5:1
2. Focus traps on all interactive elements
3. Semantic HTML (nav, main, article, section)
4. Skip link to main content
5. Alt text for images
6. Aria-labels where necessary
7. prefers-reduced-motion support
8. Keyboard navigation
9. Focus management for modals
10. Screen reader testing
```

### Fix A11y Issues

```
Fix the following a11y issues:
[list issues from audit]

Requirements:
- WCAG 2.2 AA compliance
- No aria-* where semantics can be used
- Focus traps visible and logical
- Contrast ≥ 4.5:1 in oklch
- Complete keyboard navigation
```

---

## SEO

### SEO Optimization

```
Optimize page for SEO:

Meta tags:
- <title> with keywords (60 chars)
- <meta description> (150–160 chars)
- Canonical URL
- Robots meta (index, follow)

Open Graph:
- og:title, og:description, og:image
- og:url, og:type
- Twitter card summary_large_image

JSON-LD:
- WebPage schema
- Organization schema
- Product/Service schema (if applicable)

Other:
- Semantic HTML structure
- H1–H6 hierarchy
- Internal linking
- Sitemap.xml
```

### JSON-LD Markup

```
Create JSON-LD markup for:

[WebPage / Organization / Product / Article]

Fields:
- @context: https://schema.org
- @type: [type]
- name, description, url
- logo, image (if applicable)
- additional properties per schema
```

---

## Security

### Security Headers

```
Set up security headers:

Required:
- Content-Security-Policy (CSP)
- Strict-Transport-Security (HSTS)
- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN
- Permissions-Policy
- Referrer-Policy
- Cross-Origin-Opener-Policy

CSP policy:
- default-src 'self'
- script-src 'self' [allowed CDNs]
- style-src 'self' 'unsafe-inline' [CDN]
- font-src [CDN]
- img-src 'self' blob: https:
- connect-src 'self'
```

### Form Validation

```
Create form validation with Zod:

Schema:
- email: z.string().email()
- message: z.string().min(10).max(1000)
- [other fields]

Server Action:
- safeParse for validation
- error.flatten() for messages
- redirect or return { error }
- Rate limiting (if applicable)
- Input sanitization
```

---

## Deploy

### Vercel Deploy

```
Prepare project for Vercel deploy:

1. Check .env variables
2. Configure redirects (if needed)
3. Configure rewrites (if needed)
4. Configure headers (security)
5. Configure caching strategy
6. Check build log
7. Test on preview URL
8. Deploy --prod
```

### CI/CD Pipeline

```
Create CI/CD pipeline:

GitHub Actions:
- lint: biome check
- typecheck: tsc --noEmit
- build: next build
- test: vitest / playwright
- lighthouse: lhci autorun
- deploy: vercel --prod (on main)

Triggers:
- push to main → full pipeline
- PR → lint + typecheck + build
- schedule → lighthouse audit
```

---

## Testing

### Lighthouse CI

```
Configure Lighthouse CI:

collect:
- url: http://localhost:3000/
- numberOfRuns: 3
- startServerCommand: npm run start

assert:
- categories:performance >= 0.9
- categories:accessibility >= 0.95
- categories:best-practices >= 0.95
- categories:seo >= 0.95
- LCP <= 2500ms
- CLS <= 0.1
- INP <= 200ms
```

### E2E Tests

```
Create E2E tests with Playwright:

Test cases:
1. Home page loads
2. Navigation works
3. Form submits with valid data
4. Form shows errors with invalid data
5. Mobile layout renders correctly
6. Dark mode toggles
7. All links work
```

---

## CRO

### Conversion Optimization

```
Optimize page for conversions:

Above the fold:
- Clear H1 with UVP
- Subtitle with benefit
- Primary CTA button
- Social proof (logos/numbers)

Form:
- Minimal fields
- Inline validation
- Clear labels
- Loading state on submit
- Success/error messages

Trust:
- Testimonials / reviews
- Guarantees / SLA
- Security badges
- Privacy policy link

UX:
- Mobile-optimized (touch ≥ 44px)
- Fast load
- Smooth animations
- Clear navigation
```

### A/B Test Structure

```
Prepare page for A/B testing:

- Variant A: current version
- Variant B: [describe changes]

Metrics:
- Conversion rate
- Time on page
- Bounce rate
- Scroll depth

Markup:
- Data-attribute for variant
- Analytics events
- Goal tracking
```

---

## Refactoring

### Migrate Tailwind v3 → v4

```
Migrate Tailwind v3 → v4:

1. Update dependencies
2. Replace tailwind.config.js → @theme in CSS
3. Update postcss.config (tailwindcss → @tailwindcss/postcss)
4. Replace config vars → CSS custom properties
5. Update media queries → container queries
6. Test all components
7. Run Lighthouse audit
```

### Optimize Existing Code

```
Optimize current project:

1. Find client components → move to server where possible
2. Remove unused imports
3. Replace heavy libraries with lighter alternatives
4. Optimize images
5. Set up code splitting
6. Add caching headers
7. Check CSP and security headers
8. Run Lighthouse and fix issues
```

---

## Learning

### Explain a Concept

```
Explain [concept, e.g. "Server Components"]:

- What is it?
- Why is it needed?
- How does it work?
- When to use?
- Code examples
- Best practices
- Common pitfalls
```

### Code Review

```
Do a code review for [file/component]:

Check:
1. Performance (LCP, CLS, INP)
2. Accessibility (WCAG 2.2 AA)
3. Security (CSP, validation)
4. SEO (semantics, meta)
5. CRO (conversion, UX)
6. Code quality (types, linting)
7. Best practices (React, Next.js)

Format:
- What's good
- What to improve
- What to fix
```

---

**Tip**: Combine prompts for complex tasks:
```
1. First: "Create a design system with tokens..."
2. Then: "Create components using these tokens..."
3. Next: "Optimize performance..."
4. Finally: "Check accessibility..."
```
