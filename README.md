# web-architect-agent

MCP server for building high-performance, accessible, conversion-optimized web apps.

No external APIs — all knowledge is built-in. Works in **any language**: ask in English, Russian, Spanish — it responds in kind.

---

## What's inside

10 tools available to any MCP-compatible client:

| Tool | Description |
|------|-------------|
| `get_selection_matrix` | Pick the right design system for your project type |
| `get_mui_package` | MUI ecosystem: install commands, components, theme setup |
| `get_design_system_info` | Deep dive into any specific design system |
| `list_design_systems` | Browse 200+ systems from awesome-design-systems catalog |
| `get_prompts` | Ready-to-use prompts for landing pages, dashboards, audits |
| `get_agent_principles` | Core web architecture principles: performance, a11y, CRO, security |
| `fetch_docs` | Fetch live documentation from any URL — gets latest API docs, changelogs, component references |
| `scaffold` | Generate complete project scaffold with all files and code ready to use |
| `get_checklist` | Actionable checklist with how-to for each item: performance, a11y, SEO, security, CRO, launch |
| `search_npm` | Search npm registry — returns package name, version, weekly downloads, install command |

### Scaffolds included

| Type | Description |
|------|-------------|
| `nextjs-landing` | Next.js 15 + Tailwind v4 + shadcn/ui — Hero, Features, Pricing, ContactForm, Footer, JSON-LD, security headers |
| `nextjs-dashboard` | Next.js 15 + MUI + Data Grid + Charts — stats cards, table, revenue chart |
| `nextjs-saas` | SaaS starter — auth shell, protected routes, API routes, Zod validation, middleware |
| `nextjs-blog` | Blog with dynamic routes, MDX-ready, sitemap.xml, RSS feed |
| `nextjs-ecommerce` | E-commerce — product catalog, cart (Zustand + persist), checkout, Zod validation |
| `nextjs-i18n` | Multi-language — next-intl, locale routing, hreflang, locale switcher, typed translations |

---

## Install

### Claude Code (recommended)

```bash
claude mcp add web-architect-agent -- node /path/to/web-architect-agent/agent.js
```

### Claude Desktop / any MCP client

Add to your MCP config:

```json
{
  "mcpServers": {
    "web-architect-2026": {
      "command": "node",
      "args": ["/path/to/web-architect-agent/agent.js"]
    }
  }
}
```

### From source

```bash
git clone https://github.com/gvorobev/web-architect-agent.git
cd web-architect-agent
npm install
```

Then register with `claude mcp add` or add to your client config as shown above.

---

## Supported clients

Any client that implements the [Model Context Protocol](https://modelcontextprotocol.io):

- Claude Code
- Claude Desktop
- Cursor
- Windsurf
- Zed
- Continue
- and others

---

## Requirements

- Node.js >= 18

---

## Tech stack covered

Next.js 15, React 19, TypeScript 5.6, Tailwind CSS v4, Zod, Biome, MUI ecosystem, shadcn/ui, Radix UI, 200+ design systems catalog.

---

## License

MIT
