# web-architect-agent

MCP server for building high-performance, accessible, conversion-optimized web apps.

No external APIs — all knowledge is built-in. Works in **any language**: ask in English, Russian, Spanish — it responds in kind.

---

## What's inside

6 tools available to any MCP-compatible client:

| Tool | Description |
|------|-------------|
| `selection_matrix` | Pick the right design system for your project type |
| `mui_package` | MUI ecosystem: install commands, components, theme setup |
| `design_system_info` | Deep dive into any specific design system |
| `list_design_systems` | Browse 200+ systems from awesome-design-systems catalog |
| `prompts` | Ready-to-use prompts for landing pages, dashboards, audits |
| `principles` | Core web architecture principles: performance, a11y, CRO, security |

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
