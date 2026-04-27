export const MUI_PACKAGES = {
  "@mui/material": {
    description: "Google Material Design, 40+ components",
    install: "npm install @mui/material @emotion/react @emotion/styled",
    optional: "npm install @fontsource/roboto @mui/icons-material",
    components: [
      "Button, IconButton, Fab",
      "TextField, Checkbox, Radio, Select, Slider, Switch, Autocomplete",
      "Table, DataGrid (from @mui/x)",
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

// In layout.tsx ("use client"):
<ThemeProvider theme={theme}><CssBaseline />{children}</ThemeProvider>`,
    treeshaking: "Import from @mui/material/Button, not from @mui/material"
  },

  "@mui/base": {
    description: "Headless components without styles — full design control",
    install: "npm install @mui/base",
    components: ["Button, Input, Select, Menu, Modal, Slider, Tabs, Tooltip"],
    note: "Use with Tailwind or CSS Modules for styling"
  },

  "@mui/joy": {
    description: "Joy Design System — modern style without Material Design (beta)",
    install: "npm install @mui/joy @emotion/react @emotion/styled",
    note: "Do NOT mix with @mui/material in the same project",
    theming: `import { extendTheme, CssVarsProvider } from '@mui/joy/styles';
const theme = extendTheme({ colorSchemes: { light: { palette: { primary: { 500: '#your-color' } } } } });
<CssVarsProvider theme={theme}>{children}</CssVarsProvider>`
  },

  "@mui/x-data-grid": {
    description: "High-performance data tables",
    install: "npm install @mui/x-data-grid",
    installPro: "npm install @mui/x-data-grid-pro  # sorting, grouping, export",
    features: [
      "Sort, filter, pagination",
      "Row selection",
      "Virtualization (millions of rows)",
      "CSV/Excel export (Pro)",
      "Row grouping (Pro)"
    ],
    example: `import { DataGrid } from '@mui/x-data-grid';
const columns = [{ field: 'id' }, { field: 'name', headerName: 'Name', width: 150 }];
<DataGrid rows={rows} columns={columns} pageSizeOptions={[10, 25, 50]} />`
  },

  "@mui/x-charts": {
    description: "Charts and data visualization",
    install: "npm install @mui/x-charts",
    types: ["BarChart", "LineChart", "PieChart", "ScatterChart", "SparkLineChart"],
    example: `import { BarChart } from '@mui/x-charts/BarChart';
<BarChart xAxis={[{ data: ['Q1','Q2','Q3'] }]} series={[{ data: [4, 3, 5] }]} width={500} height={300} />`
  },

  "@mui/x-date-pickers": {
    description: "Calendar and date/time inputs",
    install: "npm install @mui/x-date-pickers dayjs",
    components: ["DatePicker", "TimePicker", "DateTimePicker", "DateRangePicker"],
    example: `import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
<LocalizationProvider dateAdapter={AdapterDayjs}>
  <DatePicker label="Date" />
</LocalizationProvider>`
  },

  "@mui/x-tree-view": {
    description: "Hierarchical data (TreeView)",
    install: "npm install @mui/x-tree-view",
    example: `import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
<SimpleTreeView>
  <TreeItem itemId="1" label="Parent">
    <TreeItem itemId="2" label="Child" />
  </TreeItem>
</SimpleTreeView>`
  }
};
