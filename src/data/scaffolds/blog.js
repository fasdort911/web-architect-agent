export const blog = {
  description: "Next.js 15 blog with dynamic routes, MDX-ready, sitemap.xml, RSS feed",
  files: {
    "app/blog/page.tsx": `import { getAllPosts } from '@/lib/posts';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Blog' };

export default async function BlogPage() {
  const posts = await getAllPosts();
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-12">Blog</h1>
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        <ul className="space-y-8 list-none">
          {posts.map((post) => (
            <li key={post.slug}>
              <article>
                <time className="text-sm text-gray-500" dateTime={post.date}>{post.date}</time>
                <h2 className="text-2xl font-semibold mt-1">
                  <Link href={\`/blog/\${post.slug}\`} className="hover:underline">{post.title}</Link>
                </h2>
                <p className="mt-2 text-gray-600">{post.excerpt}</p>
                <Link href={\`/blog/\${post.slug}\`} className="mt-3 inline-block text-blue-600 text-sm hover:underline">
                  Read more →
                </Link>
              </article>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}`,

    "app/blog/[slug]/page.tsx": `import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: 'article' },
  };
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
        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </main>
  );
}`,

    "lib/posts.ts": `import fs from 'fs/promises';
import path from 'path';

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

const POSTS_DIR = path.join(process.cwd(), 'content/posts');

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = raw.match(/^---\\n([\\s\\S]*?)\\n---\\n([\\s\\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta = Object.fromEntries(
    match[1].split('\\n').map((line) => {
      const idx = line.indexOf(': ');
      return [line.slice(0, idx), line.slice(idx + 2)];
    })
  );
  return { meta, body: match[2] };
}

export async function getAllPosts(): Promise<Post[]> {
  const files = await fs.readdir(POSTS_DIR).catch(() => [] as string[]);
  const posts = await Promise.all(
    files.filter((f) => f.endsWith('.md')).map(async (file) => {
      return getPostBySlug(file.replace(/\\.md$/, ''));
    })
  );
  return (posts.filter(Boolean) as Post[]).sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const raw = await fs.readFile(path.join(POSTS_DIR, \`\${slug}.md\`), 'utf-8');
    const { meta, body } = parseFrontmatter(raw);
    return {
      slug,
      title: meta.title ?? slug,
      date: meta.date ?? '',
      excerpt: meta.excerpt ?? '',
      content: body.trim(),
    };
  } catch {
    return null;
  }
}`,

    "app/sitemap.ts": `import { getAllPosts } from '@/lib/posts';
import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://yoursite.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: \`\${BASE_URL}/blog\`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ...posts.map((p) => ({
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

  const items = posts.map((p) => \`
    <item>
      <title><![CDATA[\${p.title}]]></title>
      <link>\${BASE_URL}/blog/\${p.slug}</link>
      <guid isPermaLink="true">\${BASE_URL}/blog/\${p.slug}</guid>
      <pubDate>\${new Date(p.date).toUTCString()}</pubDate>
      <description><![CDATA[\${p.excerpt}]]></description>
    </item>\`).join('');

  const xml = \`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>My Blog</title>
    <link>\${BASE_URL}</link>
    <description>Latest posts</description>
    <atom:link href="\${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    \${items}
  </channel>
</rss>\`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}`,

    "content/posts/hello-world.md": `---
title: Hello World
date: 2026-04-25
excerpt: This is the first post on this blog.
---

Welcome to my blog! This is a sample post written in Markdown.

## Getting Started

Replace the contents of this file with your own posts.
`
  }
};
