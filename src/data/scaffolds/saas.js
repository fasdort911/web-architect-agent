export const saas = {
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

    "app/(marketing)/layout.tsx": `export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header>{/* Nav */}</header>
      {children}
      <footer>{/* Footer */}</footer>
    </>
  );
}`,

    "app/(app)/layout.tsx": `import { requireAuth } from '@/lib/auth';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await requireAuth();
  return (
    <div className="flex h-screen">
      <aside>{/* Sidebar nav */}</aside>
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}`,

    "app/(app)/dashboard/page.tsx": `import { requireAuth } from '@/lib/auth';

export const metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const user = await requireAuth();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Welcome, {user.name}</h1>
      {/* Dashboard content */}
    </div>
  );
}`,

    "app/(app)/settings/page.tsx": `import { requireAuth } from '@/lib/auth';

export const metadata = { title: 'Settings' };

export default async function SettingsPage() {
  const user = await requireAuth();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <p className="text-gray-600">Logged in as {user.email}</p>
    </div>
  );
}`,

    "app/api/contact/route.ts": `import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const result = contactSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  // TODO: send email / save to DB
  return NextResponse.json({ success: true });
}`,

    "app/api/user/route.ts": `import { NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ user });
}`,

    "lib/auth.ts": `import { redirect } from 'next/navigation';

export interface User {
  id: string;
  name: string;
  email: string;
}

// Replace with your actual auth: NextAuth, Clerk, Lucia, Better Auth, etc.
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

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;`,

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

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};`,

    "app/globals.css": `@import "tailwindcss";

@theme {
  --color-bg: oklch(98% 0.005 264);
  --color-bg-alt: oklch(94% 0.01 264);
  --color-text: oklch(15% 0.02 264);
  --color-text-muted: oklch(40% 0.03 264);
  --color-primary: oklch(55% 0.22 260);
  --color-primary-hover: oklch(50% 0.22 260);
  --font-sans: "InterVariable", system-ui, sans-serif;
  --radius-md: 0.5rem;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: oklch(12% 0.02 264);
    --color-bg-alt: oklch(18% 0.02 264);
    --color-text: oklch(95% 0.005 264);
    --color-primary: oklch(70% 0.18 260);
  }
}

* { box-sizing: border-box; margin: 0; }
body { background: var(--color-bg); color: var(--color-text); font-family: var(--font-sans); }`
  }
};
