import { SELECTION_MATRIX } from '../data/selection-matrix.js';
import { MUI_PACKAGES } from '../data/mui-packages.js';
import { DESIGN_SYSTEMS_CATALOG } from '../data/catalog.js';
import { PROMPTS } from '../data/prompts.js';
import { PRINCIPLES } from '../data/principles.js';
import { SCAFFOLDS } from '../data/scaffolds/index.js';
import { CHECKLISTS } from '../data/checklists.js';

const ok  = (text) => ({ content: [{ type: 'text', text }] });
const err = (text) => ({ content: [{ type: 'text', text }], isError: true });

export async function handleTool(name, args) {
  switch (name) {
    case 'get_selection_matrix':   return handleSelectionMatrix(args);
    case 'get_mui_package':        return handleMuiPackage(args);
    case 'get_design_system_info': return handleDesignSystemInfo(args);
    case 'list_design_systems':    return handleListDesignSystems(args);
    case 'get_prompts':            return handlePrompts(args);
    case 'get_agent_principles':   return ok(PRINCIPLES);
    case 'fetch_docs':             return handleFetchDocs(args);
    case 'scaffold':               return handleScaffold(args);
    case 'get_checklist':          return handleChecklist(args);
    case 'search_npm':             return handleSearchNpm(args);
    default:                       return err(`Tool "${name}" not found.`);
  }
}

// ─── HANDLERS ─────────────────────────────────────────────────────────────────

function handleSelectionMatrix(args) {
  if (args?.project_type) {
    const key = Object.keys(SELECTION_MATRIX).find((k) =>
      k.toLowerCase().includes(args.project_type.toLowerCase())
    );
    if (!key) {
      return ok(`Type "${args.project_type}" not found.\nAvailable: ${Object.keys(SELECTION_MATRIX).join(', ')}`);
    }
    const r = SELECTION_MATRIX[key];
    return ok(`**${key}**\n\nStack: ${r.stack}\nInstall: \`${r.install}\`\nNote: ${r.note}`);
  }
  const text = Object.entries(SELECTION_MATRIX)
    .map(([type, r]) => `**${type}**\n  Stack: ${r.stack}\n  Install: \`${r.install}\`\n  ${r.note}`)
    .join('\n\n');
  return ok(`# Design System Selection Matrix\n\n${text}`);
}

function handleMuiPackage(args) {
  const data = MUI_PACKAGES[args?.package];
  if (!data) {
    return ok(`Package "${args?.package}" not found.\nAvailable: ${Object.keys(MUI_PACKAGES).join(', ')}`);
  }
  const lines = [
    `# ${args.package}`,
    `**${data.description}**`,
    `\n**Install:** \`${data.install}\``,
    data.optional    ? `**Optional:** \`${data.optional}\`` : null,
    data.installPro  ? `**Pro:** \`${data.installPro}\`` : null,
    data.components  ? `\n**Components:**\n${Array.isArray(data.components) ? data.components.map((c) => `- ${c}`).join('\n') : data.components}` : null,
    data.features    ? `\n**Features:**\n${data.features.map((f) => `- ${f}`).join('\n')}` : null,
    data.types       ? `\n**Chart types:** ${data.types.join(', ')}` : null,
    data.theming     ? `\n**Theming:**\n\`\`\`tsx\n${data.theming}\n\`\`\`` : null,
    data.example     ? `\n**Example:**\n\`\`\`tsx\n${data.example}\n\`\`\`` : null,
    data.treeshaking ? `\n**Tree-shaking:** ${data.treeshaking}` : null,
    data.note        ? `\n**Note:** ${data.note}` : null,
  ].filter(Boolean).join('\n');
  return ok(lines);
}

function handleDesignSystemInfo(args) {
  const { name, domain } = args || {};
  let results = DESIGN_SYSTEMS_CATALOG;
  if (name)   results = results.filter((ds) => ds.name.toLowerCase().includes(name.toLowerCase()));
  if (domain) results = results.filter((ds) => ds.domain.toLowerCase().includes(domain.toLowerCase()));
  if (!results.length) return ok('Nothing found. Use list_design_systems to browse the full catalog.');
  const text = results
    .map((ds) => `**${ds.name}** (${ds.domain})\n  Docs: ${ds.url}\n  Install: \`${ds.install}\``)
    .join('\n\n');
  return ok(text);
}

function handleListDesignSystems(args) {
  const domain = args?.domain;
  let results = DESIGN_SYSTEMS_CATALOG;
  if (domain) results = results.filter((ds) => ds.domain.toLowerCase().includes(domain.toLowerCase()));
  const text = results
    .map((ds) => `- **${ds.name}** (${ds.domain}) — ${ds.url} | \`${ds.install}\``)
    .join('\n');
  const header = domain
    ? `# Design Systems: ${domain}\n\n`
    : `# Design Systems Catalog (${results.length})\n\n`;
  return ok(header + text);
}

function handlePrompts(args) {
  const category = args?.category;
  if (!category) {
    return ok(`Available prompt categories: ${Object.keys(PROMPTS).join(', ')}\n\nSpecify category to get a prompt.`);
  }
  const prompt = PROMPTS[category];
  if (!prompt) {
    return ok(`Category "${category}" not found.\nAvailable: ${Object.keys(PROMPTS).join(', ')}`);
  }
  return ok(`# Prompt: ${category}\n\n\`\`\`\n${prompt}\n\`\`\``);
}

async function handleFetchDocs(args) {
  const url = args?.url;
  if (!url || !url.startsWith('http')) return err('Invalid URL. Must start with http:// or https://');
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'web-architect-mcp/3.0 (documentation fetcher)' },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return err(`HTTP ${response.status}: ${response.statusText}`);

    const contentType = response.headers.get('content-type') ?? '';
    const raw = await response.text();
    let text = raw;

    if (contentType.includes('text/html')) {
      text = raw
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<nav[\s\S]*?<\/nav>/gi, '')
        .replace(/<footer[\s\S]*?<\/footer>/gi, '')
        .replace(/<header[\s\S]*?<\/header>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&').replace(/&quot;/g, '"')
        .replace(/\s{3,}/g, '\n\n')
        .trim();
    }

    const truncated = text.length > 8000 ? text.slice(0, 8000) + '\n\n[... truncated]' : text;
    return ok(`# ${url}\n\n${truncated}`);
  } catch (e) {
    return err(`Fetch failed: ${e instanceof Error ? e.message : String(e)}`);
  }
}

function handleScaffold(args) {
  const type = args?.type;
  if (!type) {
    const list = Object.entries(SCAFFOLDS)
      .map(([key, s]) => `- **${key}**: ${s.description}`)
      .join('\n');
    return ok(`# Available Scaffolds\n\n${list}\n\nSpecify type to get files.`);
  }
  const scaffold = SCAFFOLDS[type];
  if (!scaffold) {
    return ok(`Scaffold "${type}" not found.\nAvailable: ${Object.keys(SCAFFOLDS).join(', ')}`);
  }
  const fileList = Object.keys(scaffold.files).map((f) => `  ${f}`).join('\n');
  const files = Object.entries(scaffold.files)
    .map(([filePath, content]) => `## ${filePath}\n\`\`\`\n${content}\n\`\`\``)
    .join('\n\n');
  return ok(`# Scaffold: ${type}\n${scaffold.description}\n\n## Files\n${fileList}\n\n---\n\n${files}`);
}

function handleChecklist(args) {
  const type = args?.type?.toLowerCase();
  if (!type) {
    const list = Object.entries(CHECKLISTS)
      .map(([key, c]) => `- **${key}**: ${c.title} (${c.items.length} items)`)
      .join('\n');
    return ok(`# Available Checklists\n\n${list}\n\nSpecify type to get the full checklist.`);
  }
  const checklist = CHECKLISTS[type];
  if (!checklist) {
    return ok(`Checklist "${type}" not found.\nAvailable: ${Object.keys(CHECKLISTS).join(', ')}`);
  }
  const items = checklist.items
    .map((item, i) => `### ${i + 1}. ${item.check}\n${item.how}`)
    .join('\n\n');
  return ok(`# ${checklist.title}\n\n${items}`);
}

async function handleSearchNpm(args) {
  const query = args?.query;
  if (!query) return err('query is required');
  const limit = Math.min(args?.limit ?? 5, 20);

  try {
    const url = `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(query)}&size=${limit}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return err(`npm registry error: ${res.status}`);

    const data = await res.json();
    if (!data.objects?.length) return ok(`No packages found for "${query}"`);

    const results = data.objects.map((obj) => {
      const p = obj.package;
      const downloads = obj.downloads?.weekly
        ? `${(obj.downloads.weekly / 1000).toFixed(0)}k/week`
        : '';
      const score = Math.round((obj.score?.final ?? 0) * 100);
      return [
        `**${p.name}** v${p.version} ${downloads ? `· ${downloads}` : ''} · score ${score}%`,
        p.description ?? '',
        p.links?.homepage ? `Homepage: ${p.links.homepage}` : '',
        `Install: \`npm install ${p.name}\``,
      ].filter(Boolean).join('\n');
    }).join('\n\n');

    return ok(`# npm search: "${query}"\n\n${results}`);
  } catch (e) {
    return err(`Search failed: ${e instanceof Error ? e.message : String(e)}`);
  }
}
