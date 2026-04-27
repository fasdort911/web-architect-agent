export const landing = {
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
  { title: 'Feature One', description: 'Benefit-focused description.' },
  { title: 'Feature Two', description: 'Benefit-focused description.' },
  { title: 'Feature Three', description: 'Benefit-focused description.' },
  { title: 'Feature Four', description: 'Benefit-focused description.' },
  { title: 'Feature Five', description: 'Benefit-focused description.' },
  { title: 'Feature Six', description: 'Benefit-focused description.' },
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
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
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
          <p role="alert" className="text-center text-[var(--color-accent)]">Thanks! We will be in touch soon.</p>
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
            {status === 'error' && (
              <p role="alert" className="text-red-500 text-sm">Something went wrong. Please try again.</p>
            )}
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
};
