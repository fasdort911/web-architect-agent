export const TOOL_DEFINITIONS = [
  {
    name: 'get_selection_matrix',
    description: 'Design system selection matrix by project type. Returns recommended stack and install command.',
    inputSchema: {
      type: 'object',
      properties: {
        project_type: {
          type: 'string',
          description: 'Project type (optional). Returns full matrix if omitted. Examples: "landing", "dashboard", "enterprise", "e-commerce"'
        }
      }
    }
  },
  {
    name: 'get_mui_package',
    description: 'MUI package docs: components, install command, code examples, theming.',
    inputSchema: {
      type: 'object',
      properties: {
        package: {
          type: 'string',
          description: 'Package: @mui/material, @mui/base, @mui/joy, @mui/x-data-grid, @mui/x-charts, @mui/x-date-pickers, @mui/x-tree-view'
        }
      },
      required: ['package']
    }
  },
  {
    name: 'get_design_system_info',
    description: 'Info about a specific design system: docs URL, domain, install command.',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'System name: "IBM Carbon", "Shopify Polaris", "Fluent UI", "Mantine", etc.'
        },
        domain: {
          type: 'string',
          description: 'Domain filter (optional): "enterprise", "e-commerce", "government", "finance", "headless", etc.'
        }
      }
    }
  },
  {
    name: 'list_design_systems',
    description: 'Full design systems catalog with URL, domain and install command.',
    inputSchema: {
      type: 'object',
      properties: {
        domain: {
          type: 'string',
          description: 'Domain filter (optional): enterprise, e-commerce, government, finance, headless, components, dev-tools, cloud, etc.'
        }
      }
    }
  },
  {
    name: 'get_prompts',
    description: 'Ready-to-use prompt templates for building sites and components.',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Category: landing, mui_site, mui_dashboard, design_system, component, performance, a11y, seo, security, deploy. Returns list if omitted.'
        }
      }
    }
  },
  {
    name: 'get_agent_principles',
    description: 'Web Architect 2026 principles, stack, rules, and response format.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'fetch_docs',
    description: 'Fetch and return text content of any documentation URL. Gets latest API docs, changelogs, component references.',
    inputSchema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'Full URL to fetch (e.g. https://nextjs.org/docs/app/api-reference/functions/fetch)'
        }
      },
      required: ['url']
    }
  },
  {
    name: 'scaffold',
    description: 'Generate a complete project scaffold with all files and code. Returns full content ready to create.',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          description: 'Scaffold type: nextjs-landing, nextjs-dashboard, nextjs-saas, nextjs-blog. Returns available types if omitted.'
        }
      }
    }
  }
];
