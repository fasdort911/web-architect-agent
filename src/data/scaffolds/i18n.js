export const i18n = {
  description: "Next.js 15 + next-intl: multi-language routing, hreflang, locale switcher, typed translations",
  files: {
    "package.json": `{
  "name": "my-i18n-app",
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
    "next-intl": "^3.0.0"
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

    "i18n/config.ts": `export const locales = ['en', 'ru', 'de'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';`,

    "i18n/request.ts": `import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, locales } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !locales.includes(locale as any)) {
    locale = defaultLocale;
  }
  return {
    locale,
    messages: (await import(\`../messages/\${locale}.json\`)).default,
  };
});`,

    "middleware.ts": `import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // /en/about → /about for default locale
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\\\..*).*)'],
};`,

    "next.config.ts": `import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      ],
    }];
  },
};

export default withNextIntl(nextConfig);`,

    "messages/en.json": `{
  "nav": {
    "home": "Home",
    "about": "About",
    "contact": "Contact"
  },
  "hero": {
    "title": "Build something great",
    "subtitle": "Your value proposition in one sentence.",
    "cta": "Get Started"
  },
  "meta": {
    "home": {
      "title": "Home — MySite",
      "description": "Short description for search engines."
    }
  }
}`,

    "messages/ru.json": `{
  "nav": {
    "home": "Главная",
    "about": "О нас",
    "contact": "Контакты"
  },
  "hero": {
    "title": "Создайте что-то великое",
    "subtitle": "Ваше ценностное предложение в одном предложении.",
    "cta": "Начать"
  },
  "meta": {
    "home": {
      "title": "Главная — MySite",
      "description": "Краткое описание для поисковых систем."
    }
  }
}`,

    "messages/de.json": `{
  "nav": {
    "home": "Startseite",
    "about": "Über uns",
    "contact": "Kontakt"
  },
  "hero": {
    "title": "Bauen Sie etwas Großartiges",
    "subtitle": "Ihr Wertversprechen in einem Satz.",
    "cta": "Loslegen"
  },
  "meta": {
    "home": {
      "title": "Startseite — MySite",
      "description": "Kurze Beschreibung für Suchmaschinen."
    }
  }
}`,

    "app/[locale]/layout.tsx": `import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { locales } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import '../globals.css';

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.home' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: \`https://yoursite.com/\${locale}\`,
      languages: Object.fromEntries(locales.map((l) => [l, \`https://yoursite.com/\${l}\`])),
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}`,

    "app/[locale]/page.tsx": `import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';

export default function HomePage() {
  const t = useTranslations();
  return (
    <main>
      <nav>
        <a href="/">{t('nav.home')}</a>
        <a href="/about">{t('nav.about')}</a>
        <LocaleSwitcher />
      </nav>
      <section>
        <h1>{t('hero.title')}</h1>
        <p>{t('hero.subtitle')}</p>
        <a href="/contact">{t('hero.cta')}</a>
      </section>
    </main>
  );
}`,

    "components/LocaleSwitcher.tsx": `'use client';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { locales } from '@/i18n/config';
import type { Locale } from '@/i18n/config';

const labels: Record<Locale, string> = { en: 'EN', ru: 'RU', de: 'DE' };

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(next: Locale) {
    // Replace current locale prefix in path
    const segments = pathname.split('/');
    if (locales.includes(segments[1] as Locale)) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    router.push(segments.join('/') || '/');
  }

  return (
    <div className="flex gap-2">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          className={\`px-2 py-1 text-sm rounded \${l === locale ? 'font-bold underline' : 'text-gray-500 hover:text-gray-900'}\`}
          aria-label={\`Switch to \${labels[l]}\`}
          aria-current={l === locale ? 'true' : undefined}
        >
          {labels[l]}
        </button>
      ))}
    </div>
  );
}`,

    "app/globals.css": `@import "tailwindcss";

@theme {
  --color-bg: oklch(98% 0.005 264);
  --color-text: oklch(15% 0.02 264);
  --color-primary: oklch(55% 0.22 260);
  --font-sans: "InterVariable", system-ui, sans-serif;
}

* { box-sizing: border-box; margin: 0; }
body { background: var(--color-bg); color: var(--color-text); font-family: var(--font-sans); }`
  }
};
