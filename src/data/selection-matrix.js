export const SELECTION_MATRIX = {
  "landing / custom design": {
    stack: "shadcn/ui + Radix UI + Tailwind v4",
    install: "npx shadcn@latest init",
    note: "Maximum design flexibility, minimal bundle"
  },
  "enterprise / b2b": {
    stack: "@mui/material + @mui/x",
    install: "npm install @mui/material @emotion/react @emotion/styled",
    note: "40+ components, corporate style, Material Design"
  },
  "dashboard / admin panel": {
    stack: "@mui/material + @mui/x-data-grid + @mui/x-charts",
    install: "npm install @mui/material @emotion/react @emotion/styled @mui/x-data-grid @mui/x-charts",
    note: "Tables, charts, filters — everything out of the box"
  },
  "finance / analytics": {
    stack: "IBM Carbon or Intuit Harmony",
    install: "npm install @carbon/react",
    note: "Specialized for financial interfaces"
  },
  "e-commerce": {
    stack: "Shopify Polaris or Tailwind-first",
    install: "npm install @shopify/polaris",
    note: "Polaris if Shopify ecosystem; otherwise Tailwind + custom"
  },
  "microsoft-style / office": {
    stack: "Fluent UI",
    install: "npm install @fluentui/react-components",
    note: "Official Microsoft design system"
  },
  "government / public sector": {
    stack: "GOV.UK Design System or USWDS",
    install: "npm install govuk-frontend",
    note: "Strict accessibility requirements, battle-tested patterns"
  },
  "minimal bundle / zero dependencies": {
    stack: "Tailwind v4 + custom CSS tokens",
    install: "npm install tailwindcss@next @tailwindcss/vite",
    note: "Zero-dependency UI, full control"
  },
  "headless / custom design with logic": {
    stack: "@mui/base or Radix UI",
    install: "npm install @mui/base",
    note: "Component logic without styles — style however you want"
  }
};
