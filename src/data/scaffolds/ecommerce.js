export const ecommerce = {
  description: "Next.js 15 e-commerce: product catalog, cart (Zustand), checkout form, Zod validation",
  files: {
    "package.json": `{
  "name": "my-shop",
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
    "zod": "^3.23.0",
    "zustand": "^5.0.0"
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

    "lib/store/cart.ts": `import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  add: (item: Omit<CartItem, 'quantity'>) => void;
  remove: (id: string) => void;
  update: (id: string, quantity: number) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((s) => {
          const existing = s.items.find((i) => i.id === item.id);
          if (existing) {
            return { items: s.items.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) };
          }
          return { items: [...s.items, { ...item, quantity: 1 }] };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      update: (id, quantity) =>
        set((s) => ({
          items: quantity <= 0
            ? s.items.filter((i) => i.id !== id)
            : s.items.map((i) => i.id === id ? { ...i, quantity } : i),
        })),
      clear: () => set({ items: [] }),
      total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'cart' }
  )
);`,

    "lib/types.ts": `export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
}`,

    "lib/products.ts": `import type { Product } from './types';

// Replace with your actual data source: DB, CMS, API
export async function getProducts(category?: string): Promise<Product[]> {
  const products: Product[] = [
    { id: '1', name: 'Product One', description: 'Great product.', price: 29, image: '/products/1.jpg', category: 'clothing', inStock: true },
    { id: '2', name: 'Product Two', description: 'Even better.', price: 49, image: '/products/2.jpg', category: 'clothing', inStock: true },
    { id: '3', name: 'Product Three', description: 'Premium quality.', price: 99, image: '/products/3.jpg', category: 'accessories', inStock: false },
  ];
  return category ? products.filter((p) => p.category === category) : products;
}

export async function getProductById(id: string): Promise<Product | null> {
  const all = await getProducts();
  return all.find((p) => p.id === id) ?? null;
}`,

    "lib/validations.ts": `import { z } from 'zod';

export const checkoutSchema = z.object({
  email: z.string().email('Invalid email'),
  firstName: z.string().min(1, 'Required').max(50),
  lastName: z.string().min(1, 'Required').max(50),
  address: z.string().min(5, 'Enter full address'),
  city: z.string().min(1, 'Required'),
  country: z.string().min(2, 'Required'),
  zip: z.string().min(3, 'Invalid postal code'),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;`,

    "app/page.tsx": `import { getProducts } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';
import { CartButton } from '@/components/CartButton';

export default async function ShopPage() {
  const products = await getProducts();
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <header className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold">Shop</h1>
        <CartButton />
      </header>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 list-none">
        {products.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </main>
  );
}`,

    "app/products/[id]/page.tsx": `import { getProductById, getProducts } from '@/lib/products';
import { notFound } from 'next/navigation';
import { AddToCartButton } from '@/components/AddToCartButton';
import type { Metadata } from 'next';

interface Props { params: Promise<{ id: string }> }

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return {};
  return { title: product.name, description: product.description };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="mt-2 text-2xl font-semibold">\${product.price}</p>
          <p className="mt-4 text-gray-600">{product.description}</p>
          {product.inStock ? (
            <AddToCartButton product={product} />
          ) : (
            <p className="mt-6 text-red-500 font-medium">Out of stock</p>
          )}
        </div>
      </div>
    </main>
  );
}`,

    "app/cart/page.tsx": `import { CartPageClient } from '@/components/CartPageClient';

export const metadata = { title: 'Cart' };

export default function CartPage() {
  return <CartPageClient />;
}`,

    "app/checkout/page.tsx": `import { CheckoutForm } from '@/components/CheckoutForm';

export const metadata = { title: 'Checkout' };

export default function CheckoutPage() {
  return (
    <main className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      <CheckoutForm />
    </main>
  );
}`,

    "app/api/checkout/route.ts": `import { NextRequest, NextResponse } from 'next/server';
import { checkoutSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const result = checkoutSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  // TODO: process payment (Stripe, etc.), create order in DB
  const orderId = crypto.randomUUID();
  return NextResponse.json({ success: true, orderId });
}`,

    "components/ProductCard.tsx": `import Link from 'next/link';
import type { Product } from '@/lib/types';
import { AddToCartButton } from './AddToCartButton';

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <Link href={\`/products/\${product.id}\`}>
        <div className="aspect-square bg-gray-100">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
        </div>
      </Link>
      <div className="p-4">
        <h2 className="font-semibold">
          <Link href={\`/products/\${product.id}\`} className="hover:underline">{product.name}</Link>
        </h2>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-bold text-lg">\${product.price}</span>
          {product.inStock
            ? <AddToCartButton product={product} />
            : <span className="text-sm text-red-500">Out of stock</span>
          }
        </div>
      </div>
    </article>
  );
}`,

    "components/AddToCartButton.tsx": `'use client';
import { useCart } from '@/lib/store/cart';
import type { Product } from '@/lib/types';

export function AddToCartButton({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  return (
    <button
      onClick={() => add({ id: product.id, name: product.name, price: product.price, image: product.image })}
      className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
    >
      Add to cart
    </button>
  );
}`,

    "components/CartButton.tsx": `'use client';
import Link from 'next/link';
import { useCart } from '@/lib/store/cart';

export function CartButton() {
  const count = useCart((s) => s.count());
  return (
    <Link href="/cart" className="relative inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
      Cart
      {count > 0 && (
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-black text-white text-xs rounded-full flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
}`,

    "components/CartPageClient.tsx": `'use client';
import { useCart } from '@/lib/store/cart';
import Link from 'next/link';

export function CartPageClient() {
  const { items, remove, update, total } = useCart();

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Link href="/" className="text-blue-600 hover:underline">Continue shopping</Link>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8">Cart</h1>
      <ul className="space-y-4 list-none">
        {items.map((item) => (
          <li key={item.id} className="flex gap-4 items-center p-4 border border-gray-200 rounded-xl">
            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-gray-500">\${item.price}</p>
            </div>
            <input
              type="number" min={1} value={item.quantity}
              onChange={(e) => update(item.id, Number(e.target.value))}
              className="w-16 text-center border border-gray-300 rounded-lg px-2 py-1"
            />
            <button onClick={() => remove(item.id)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex justify-between items-center">
        <p className="text-xl font-bold">Total: \${total().toFixed(2)}</p>
        <Link href="/checkout" className="px-8 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors">
          Checkout
        </Link>
      </div>
    </main>
  );
}`,

    "components/CheckoutForm.tsx": `'use client';
import { useState } from 'react';
import { useCart } from '@/lib/store/cart';
import { useRouter } from 'next/navigation';

export function CheckoutForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const { items, total, clear } = useCart();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ ...data, items }),
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await res.json();
    if (!res.ok) { setErrors(json.error?.fieldErrors ?? {}); setStatus('error'); return; }
    clear();
    router.push(\`/thank-you?order=\${json.orderId}\`);
  }

  const fields = [
    { id: 'firstName', label: 'First name', autoComplete: 'given-name' },
    { id: 'lastName', label: 'Last name', autoComplete: 'family-name' },
    { id: 'email', label: 'Email', autoComplete: 'email', type: 'email' },
    { id: 'address', label: 'Address', autoComplete: 'street-address' },
    { id: 'city', label: 'City', autoComplete: 'address-level2' },
    { id: 'country', label: 'Country', autoComplete: 'country' },
    { id: 'zip', label: 'Postal code', autoComplete: 'postal-code' },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {fields.map((f) => (
        <div key={f.id}>
          <label htmlFor={f.id} className="block text-sm font-medium mb-1">{f.label}</label>
          <input
            id={f.id} name={f.id} type={f.type ?? 'text'} autoComplete={f.autoComplete} required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
          />
          {errors[f.id] && <p className="text-red-500 text-sm mt-1">{errors[f.id][0]}</p>}
        </div>
      ))}
      <div className="mt-2 p-4 bg-gray-50 rounded-xl">
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>\${total().toFixed(2)}</span>
        </div>
      </div>
      <button
        type="submit" disabled={status === 'loading'}
        className="px-8 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors"
      >
        {status === 'loading' ? 'Processing…' : 'Place Order'}
      </button>
    </form>
  );
}`
  }
};
