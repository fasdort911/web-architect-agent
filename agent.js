/**
 * Web Architect MCP Server 2026
 * Инструменты для создания сайтов: дизайн-системы, MUI, промпты, принципы
 * Без внешних API — все знания встроены
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from '@modelcontextprotocol/sdk/types.js';

// ─── БАЗА ЗНАНИЙ ──────────────────────────────────────────────────────────────

const SELECTION_MATRIX = {
  "landing / кастом-дизайн": {
    stack: "shadcn/ui + Radix UI + Tailwind v4",
    install: "npx shadcn@latest init",
    note: "Максимальная гибкость дизайна, минимальный бандл"
  },
  "enterprise / b2b": {
    stack: "@mui/material + @mui/x",
    install: "npm install @mui/material @emotion/react @emotion/styled",
    note: "40+ компонентов, корпоративный стиль, Material Design"
  },
  "dashboard / admin panel": {
    stack: "@mui/material + @mui/x-data-grid + @mui/x-charts",
    install: "npm install @mui/material @emotion/react @emotion/styled @mui/x-data-grid @mui/x-charts",
    note: "Таблицы, графики, фильтры — всё из коробки"
  },
  "финансы / analytics": {
    stack: "IBM Carbon или Intuit Harmony",
    install: "npm install @carbon/react",
    note: "Специализированы под финансовые интерфейсы"
  },
  "e-commerce": {
    stack: "Shopify Polaris или Tailwind-first",
    install: "npm install @shopify/polaris",
    note: "Polaris — если Shopify; иначе Tailwind + кастом"
  },
  "microsoft-стиль / office": {
    stack: "Fluent UI",
    install: "npm install @fluentui/react-components",
    note: "Официальная дизайн-система Microsoft"
  },
  "government / public sector": {
    stack: "GOV.UK Design System или USWDS",
    install: "npm install govuk-frontend",
    note: "Строгие требования доступности, проверенные паттерны"
  },
  "минимальный бандл / без зависимостей": {
    stack: "Tailwind v4 + custom CSS tokens",
    install: "npm install tailwindcss@next @tailwindcss/vite",
    note: "Zero-dependency UI, полный контроль"
  },
  "headless / свой дизайн с готовой логикой": {
    stack: "@mui/base или Radix UI",
    install: "npm install @mui/base",
    note: "Логика компонентов без стилей — стилизуй как угодно"
  }
};

const MUI_PACKAGES = {
  "@mui/material": {
    description: "Google Material Design, 40+ компонентов",
    install: "npm install @mui/material @emotion/react @emotion/styled",
    optional: "npm install @fontsource/roboto @mui/icons-material",
    components: [
      "Button, IconButton, Fab",
      "TextField, Checkbox, Radio, Select, Slider, Switch, Autocomplete",
      "Table, DataGrid (из @mui/x)",
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

// В layout.tsx ("use client"):
<ThemeProvider theme={theme}><CssBaseline />{children}</ThemeProvider>`,
    treeshaking: "Импортируй из @mui/material/Button, не из @mui/material"
  },
  "@mui/base": {
    description: "Headless компоненты без стилей — полный контроль дизайна",
    install: "npm install @mui/base",
    components: ["Button, Input, Select, Menu, Modal, Slider, Tabs, Tooltip"],
    note: "Используй с Tailwind или CSS Modules для стилизации"
  },
  "@mui/joy": {
    description: "Joy Design System — современный стиль без Material Design (beta)",
    install: "npm install @mui/joy @emotion/react @emotion/styled",
    note: "НЕ смешивать с @mui/material в одном проекте",
    theming: `import { extendTheme, CssVarsProvider } from '@mui/joy/styles';
const theme = extendTheme({ colorSchemes: { light: { palette: { primary: { 500: '#your-color' } } } } });
<CssVarsProvider theme={theme}>{children}</CssVarsProvider>`
  },
  "@mui/x-data-grid": {
    description: "Высокопроизводительные таблицы данных",
    install: "npm install @mui/x-data-grid",
    installPro: "npm install @mui/x-data-grid-pro  # сортировка, группировка, экспорт",
    features: ["Сортировка, фильтрация, пагинация", "Row selection", "Виртуализация (миллионы строк)", "Экспорт CSV/Excel (Pro)", "Row grouping (Pro)"],
    example: `import { DataGrid } from '@mui/x-data-grid';
const columns = [{ field: 'id' }, { field: 'name', headerName: 'Имя', width: 150 }];
<DataGrid rows={rows} columns={columns} pageSizeOptions={[10, 25, 50]} />`
  },
  "@mui/x-charts": {
    description: "Графики и визуализация данных",
    install: "npm install @mui/x-charts",
    types: ["BarChart", "LineChart", "PieChart", "ScatterChart", "SparkLineChart"],
    example: `import { BarChart } from '@mui/x-charts/BarChart';
<BarChart xAxis={[{ data: ['Q1','Q2','Q3'] }]} series={[{ data: [4, 3, 5] }]} width={500} height={300} />`
  },
  "@mui/x-date-pickers": {
    description: "Calendar и date/time inputs",
    install: "npm install @mui/x-date-pickers dayjs",
    components: ["DatePicker", "TimePicker", "DateTimePicker", "DateRangePicker"],
    example: `import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
<LocalizationProvider dateAdapter={AdapterDayjs}>
  <DatePicker label="Дата" />
</LocalizationProvider>`
  },
  "@mui/x-tree-view": {
    description: "Иерархические данные (TreeView)",
    install: "npm install @mui/x-tree-view",
    example: `import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
<SimpleTreeView>
  <TreeItem itemId="1" label="Родитель">
    <TreeItem itemId="2" label="Дочерний" />
  </TreeItem>
</SimpleTreeView>`
  }
};

const DESIGN_SYSTEMS_CATALOG = [
  { name: "IBM Carbon",          url: "carbondesignsystem.com",        domain: "enterprise",    install: "npm install @carbon/react" },
  { name: "Atlassian",           url: "atlassian.design",              domain: "enterprise",    install: "npm install @atlaskit/button" },
  { name: "AWS Cloudscape",      url: "cloudscape.design",            domain: "cloud",         install: "npm install @cloudscape-design/components" },
  { name: "Shopify Polaris",     url: "polaris.shopify.com",          domain: "e-commerce",    install: "npm install @shopify/polaris" },
  { name: "GitHub Primer",       url: "primer.style",                 domain: "dev-tools",     install: "npm install @primer/react" },
  { name: "GitLab Pajamas",      url: "design.gitlab.com",           domain: "dev-tools",     install: "npm install @gitlab/ui" },
  { name: "Microsoft Fluent UI", url: "fluentui.dev",                 domain: "enterprise",    install: "npm install @fluentui/react-components" },
  { name: "Adobe Spectrum",      url: "spectrum.adobe.com",           domain: "creative",      install: "npm install @adobe/react-spectrum" },
  { name: "Salesforce Lightning",url: "lightningdesignsystem.com",   domain: "crm",           install: "npm install @salesforce-ux/design-system" },
  { name: "Twilio Paste",        url: "paste.twilio.com",             domain: "telecom",       install: "npm install @twilio-paste/core" },
  { name: "Pinterest Gestalt",   url: "gestalt.pinterest.systems",    domain: "social",        install: "npm install gestalt" },
  { name: "GOV.UK Design System",url: "gov.uk/design-system",        domain: "government",    install: "npm install govuk-frontend" },
  { name: "Mantine",             url: "mantine.dev",                  domain: "components",    install: "npm install @mantine/core @mantine/hooks" },
  { name: "Chakra UI",           url: "chakra-ui.com",                domain: "components",    install: "npm install @chakra-ui/react" },
  { name: "Elastic EUI",         url: "elastic.github.io/eui",       domain: "search/data",   install: "npm install @elastic/eui" },
  { name: "Radix UI",            url: "radix-ui.com",                 domain: "headless",      install: "npm install @radix-ui/react-dialog" },
  { name: "shadcn/ui",           url: "ui.shadcn.com",                domain: "headless",      install: "npx shadcn@latest init" },
  { name: "Intuit Harmony",      url: "designsystem.quickbooks.com", domain: "finance",       install: "—" },
  { name: "Morningstar DS",      url: "designsystem.morningstar.com",domain: "finance",       install: "—" },
  { name: "NASA WDS",            url: "nasa.github.io/nasawds-site", domain: "government",    install: "npm install nasawds" }
];

const PRINCIPLES = `
## Web Architect 2026 — Принципы

### МЫШЛЕНИЕ
1. Content → Performance → Accessibility → Conversion
2. Server/Client Boundary: минимум JS на клиенте, Island Architecture / RSC
3. CSS First: Tailwind v4 + :has(), @property, oklch, container queries
4. Zero-Compromise A11y: WCAG 2.2 AA/AAA, семантика, фокус-трапы
5. AI-Search Ready: JSON-LD, семантическая разметка
6. Sustainable Web: lazy loading, modern image formats, carbon footprint
7. Design System Aware: выбирай правильную систему под задачу

### СТЕК (по умолчанию)
- Framework: Next.js 15 (App Router, PPR, Server Actions)
- Styling: Tailwind CSS v4, CSS Variables, oklch, clamp()
- UI Kit: shadcn/ui + Radix UI (или MUI по матрице)
- Animation: Framer Motion / GSAP / CSS @view-timeline
- Build: Turbopack, Biome, pnpm, Lighthouse CI, axe-core
- Deploy: Vercel / Cloudflare / Netlify

### PERFORMANCE БЮДЖЕТ
- LCP < 2.5s, CLS < 0.1, INP < 200ms, JS < 150kb gzipped
- Images: avif/webp, lazy loading, responsive srcset

### ЗАПРЕЩЕНО
- !important в CSS (кроме legacy)
- Хардкод цветов вместо tokens/variables
- Игнорирование prefers-reduced-motion, prefers-color-scheme
- Секреты на клиенте, отсутствие CSP/headers
- Смешивать MUI и shadcn/ui без обоснования

### ФОРМАТ ОТВЕТА
1. 📐 Архитектура (файлы + server/client split)
2. 🎨 Дизайн-система (выбор + tokens, typography, color)
3. 💻 Код (production-ready, typed, a11y/perf)
4. 📦 Деплой/CI (команды, env, headers)
5. 🔍 Чек-лист (LCP/CLS/INP, a11y, SEO, CRO, security)
`;

const PROMPTS = {
  landing: `Создай лендинг для [тип продукта]:
- Hero: H1 + подзаголовок + 2 CTA
- Features: сетка 3×2
- Social proof: логотипы / отзывы
- Pricing: 3 тарифа
- Contact форма с валидацией
- Footer

Стек: Next.js 15, shadcn/ui, Tailwind v4
Требования: LCP < 2.5s, WCAG 2.2 AA, JSON-LD, dark mode`,

  mui_site: `Создай [лендинг / dashboard / admin panel] с @mui/material.

Стек: Next.js 15, @mui/material, TypeScript
Секции: [перечислить]
Брендовый цвет: [hex]

Требования:
- createTheme() с кастомной палитрой
- ThemeProvider + CssBaseline в layout
- Импорт из @mui/material/Button (tree-shaking)
- Server компоненты где нет интерактива
- WCAG 2.2 AA, LCP < 2.5s`,

  mui_dashboard: `Создай admin dashboard с:
- @mui/x-data-grid: таблица [сущность] с сортировкой/фильтрами
- @mui/x-charts: [bar/line/pie] график [метрики]
- @mui/material: AppBar, Drawer навигация, Cards со статистикой
- Dark mode через createTheme({ mode })

Данные: [описать структуру или "моковые"]
Роуты: Next.js App Router`,

  design_system: `Создай дизайн-систему для [бренд]:
Цвета: [primary, accent — hex или описание]
Стиль: [минималистичный / bold / корпоративный]
Шрифт: [Inter / системный / кастомный]

Создай:
1. CSS tokens (oklch, --color-*, --font-*, --radius-*)
2. Tailwind @theme блок
3. Typography scale (clamp())
4. Базовые компоненты: Button, Input, Card, Badge
5. Dark mode токены`,

  component: `Создай компонент [Название] для [описание].
- Серверный если нет интерактива, иначе "use client"
- Семантический HTML
- Tailwind v4 с design tokens
- ARIA и focus states
- prefers-reduced-motion support
- TypeScript props с JSDoc`,

  performance: `Оптимизируй LCP для [страница/компонент]:
- Hero image: avif/webp, preload, правильные sizes
- Шрифты: variable, display=swap, preload
- Critical CSS inline
- Убери render-blocking ресурсы
- Настрой prefetch для следующих страниц`,

  a11y: `Аудит accessibility:
1. Контраст ≥ 4.5:1 (oklch)
2. Семантика: nav, main, article, section, h1–h6
3. Skip link к #main-content
4. Фокус-трапы на модалках/drawer
5. Alt тексты, aria-labels
6. Keyboard навигация
7. prefers-reduced-motion
8. Screen reader тест (VoiceOver/NVDA)`,

  seo: `SEO оптимизация страницы:
- <title> 60 символов, <meta description> 150–160
- Open Graph: og:title, og:description, og:image, og:url
- Twitter Card: summary_large_image
- JSON-LD: WebPage + Organization (+ Product если нужно)
- Canonical URL, robots meta
- Sitemap.xml, hreflang для i18n`,

  security: `Настрой security headers в next.config.ts:
- CSP: default-src 'self', script-src, style-src, img-src
- HSTS: max-age=63072000; includeSubDomains
- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN
- Permissions-Policy
Zod-валидация всех Server Actions и API routes.`,

  deploy: `Подготовь деплой на [Vercel / Cloudflare / Netlify]:
1. next.config.ts: headers, redirects, images domains
2. .env.production переменные
3. GitHub Actions: lint → typecheck → build → lighthouse → deploy
4. Cache: stale-while-revalidate для статики
5. Edge Functions для геолокации / A/B тестов`
};

// ─── MCP СЕРВЕР ───────────────────────────────────────────────────────────────

const server = new Server(
  { name: 'web-architect-2026', version: '2.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_selection_matrix',
      description: 'Матрица выбора дизайн-системы по типу проекта. Вернёт рекомендованный стек и команду установки.',
      inputSchema: {
        type: 'object',
        properties: {
          project_type: {
            type: 'string',
            description: 'Тип проекта (опционально). Если не указан — вернёт всю матрицу. Примеры: "landing", "dashboard", "enterprise", "e-commerce"'
          }
        }
      }
    },
    {
      name: 'get_mui_package',
      description: 'Документация по пакету MUI: компоненты, установка, примеры кода, theming.',
      inputSchema: {
        type: 'object',
        properties: {
          package: {
            type: 'string',
            description: 'Название пакета: @mui/material, @mui/base, @mui/joy, @mui/x-data-grid, @mui/x-charts, @mui/x-date-pickers, @mui/x-tree-view'
          }
        },
        required: ['package']
      }
    },
    {
      name: 'get_design_system_info',
      description: 'Информация о конкретной дизайн-системе из каталога: URL документации, домен применения, команда установки.',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Название системы: "IBM Carbon", "Shopify Polaris", "Fluent UI", "Mantine" и др.'
          },
          domain: {
            type: 'string',
            description: 'Домен применения (опционально): "enterprise", "e-commerce", "government", "finance", "headless" и др.'
          }
        }
      }
    },
    {
      name: 'get_prompts',
      description: 'Готовые промпты-шаблоны для создания сайтов и компонентов.',
      inputSchema: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description: 'Категория: landing, mui_site, mui_dashboard, design_system, component, performance, a11y, seo, security, deploy. Если не указана — список всех категорий.'
          }
        }
      }
    },
    {
      name: 'get_agent_principles',
      description: 'Принципы, правила, стек и формат ответа Web Architect агента 2026.',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    {
      name: 'list_design_systems',
      description: 'Полный каталог дизайн-систем с URL, доменом и командой установки.',
      inputSchema: {
        type: 'object',
        properties: {
          domain: {
            type: 'string',
            description: 'Фильтр по домену (опционально): enterprise, e-commerce, government, finance, headless, components, dev-tools, cloud и др.'
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
          return { content: [{ type: 'text', text: `**${key}**\n\nСтек: ${rec.stack}\nУстановка: \`${rec.install}\`\nПримечание: ${rec.note}` }] };
        }
        return { content: [{ type: 'text', text: `Тип "${args.project_type}" не найден. Доступные: ${Object.keys(SELECTION_MATRIX).join(', ')}` }] };
      }
      const text = Object.entries(SELECTION_MATRIX)
        .map(([type, rec]) => `**${type}**\n  Стек: ${rec.stack}\n  Установка: \`${rec.install}\`\n  ${rec.note}`)
        .join('\n\n');
      return { content: [{ type: 'text', text: `# Матрица выбора дизайн-системы\n\n${text}` }] };
    }

    case 'get_mui_package': {
      const pkg = args?.package;
      const data = MUI_PACKAGES[pkg];
      if (!data) {
        const available = Object.keys(MUI_PACKAGES).join(', ');
        return { content: [{ type: 'text', text: `Пакет "${pkg}" не найден. Доступные: ${available}` }] };
      }
      const lines = [
        `# ${pkg}`,
        `**${data.description}**`,
        `\n**Установка:** \`${data.install}\``,
        data.optional ? `**Опционально:** \`${data.optional}\`` : null,
        data.installPro ? `**Pro:** \`${data.installPro}\`` : null,
        data.components ? `\n**Компоненты:**\n${Array.isArray(data.components) ? data.components.map(c => `- ${c}`).join('\n') : data.components}` : null,
        data.features ? `\n**Возможности:**\n${data.features.map(f => `- ${f}`).join('\n')}` : null,
        data.types ? `\n**Типы графиков:** ${data.types.join(', ')}` : null,
        data.theming ? `\n**Theming:**\n\`\`\`tsx\n${data.theming}\n\`\`\`` : null,
        data.example ? `\n**Пример:**\n\`\`\`tsx\n${data.example}\n\`\`\`` : null,
        data.treeshaking ? `\n**Tree-shaking:** ${data.treeshaking}` : null,
        data.note ? `\n**Примечание:** ${data.note}` : null,
      ].filter(Boolean).join('\n');
      return { content: [{ type: 'text', text: lines }] };
    }

    case 'get_design_system_info': {
      const { name: dsName, domain } = args || {};
      let results = DESIGN_SYSTEMS_CATALOG;

      if (dsName) {
        results = results.filter(ds =>
          ds.name.toLowerCase().includes(dsName.toLowerCase())
        );
      }
      if (domain) {
        results = results.filter(ds =>
          ds.domain.toLowerCase().includes(domain.toLowerCase())
        );
      }
      if (!results.length) {
        return { content: [{ type: 'text', text: 'Ничего не найдено. Используй list_design_systems для просмотра всего каталога.' }] };
      }
      const text = results.map(ds =>
        `**${ds.name}** (${ds.domain})\n  Документация: ${ds.url}\n  Установка: \`${ds.install}\``
      ).join('\n\n');
      return { content: [{ type: 'text', text: text }] };
    }

    case 'get_prompts': {
      const category = args?.category;
      if (!category) {
        const categories = Object.keys(PROMPTS).join(', ');
        return { content: [{ type: 'text', text: `Доступные категории промптов: ${categories}\n\nУкажи category для получения промпта.` }] };
      }
      const prompt = PROMPTS[category];
      if (!prompt) {
        return { content: [{ type: 'text', text: `Категория "${category}" не найдена. Доступные: ${Object.keys(PROMPTS).join(', ')}` }] };
      }
      return { content: [{ type: 'text', text: `# Промпт: ${category}\n\n\`\`\`\n${prompt}\n\`\`\`` }] };
    }

    case 'get_agent_principles': {
      return { content: [{ type: 'text', text: PRINCIPLES }] };
    }

    case 'list_design_systems': {
      const domain = args?.domain;
      let results = DESIGN_SYSTEMS_CATALOG;
      if (domain) {
        results = results.filter(ds => ds.domain.toLowerCase().includes(domain.toLowerCase()));
      }
      const text = results.map(ds =>
        `- **${ds.name}** (${ds.domain}) — ${ds.url} | \`${ds.install}\``
      ).join('\n');
      const header = domain ? `# Дизайн-системы: ${domain}\n\n` : `# Каталог дизайн-систем (${results.length})\n\n`;
      return { content: [{ type: 'text', text: header + text }] };
    }

    default:
      return { content: [{ type: 'text', text: `Инструмент "${name}" не найден.` }], isError: true };
  }
});

// ─── ЗАПУСК ───────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
