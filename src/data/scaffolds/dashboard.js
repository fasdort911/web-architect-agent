export const dashboard = {
  description: "Next.js 15 + MUI + @mui/x-data-grid + @mui/x-charts admin dashboard",
  files: {
    "package.json": `{
  "name": "my-dashboard",
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
    "@mui/material": "^6.0.0",
    "@mui/x-data-grid": "^7.0.0",
    "@mui/x-charts": "^7.0.0",
    "@emotion/react": "^11.13.0",
    "@emotion/styled": "^11.13.0"
  },
  "devDependencies": {
    "@biomejs/biome": "^1.9.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "typescript": "^5.6.0"
  }
}`,

    "app/layout.tsx": `import type { Metadata } from 'next';
import { Providers } from './providers';

export const metadata: Metadata = { title: 'Admin Dashboard' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}`,

    "app/providers.tsx": `'use client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: { primary: { main: '#1976d2' }, mode: 'light' },
  typography: { fontFamily: '"InterVariable", system-ui, sans-serif' },
  shape: { borderRadius: 8 },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}`,

    "app/page.tsx": `import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { StatsCards } from '@/components/StatsCards';
import { DataTable } from '@/components/DataTable';
import { RevenueChart } from '@/components/RevenueChart';

export default function Dashboard() {
  return (
    <Box component="main" sx={{ p: 4, maxWidth: 1400, mx: 'auto' }}>
      <Typography variant="h4" component="h1" fontWeight={700} mb={4}>
        Dashboard
      </Typography>
      <StatsCards />
      <Grid container spacing={4} mt={0}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Revenue</Typography>
            <RevenueChart />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" mb={2}>Quick Stats</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Recent Orders</Typography>
            <DataTable />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}`,

    "components/StatsCards.tsx": `import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const stats = [
  { label: 'Total Revenue', value: '$48,295', change: '+12%' },
  { label: 'Active Users', value: '2,847', change: '+5%' },
  { label: 'Orders', value: '1,293', change: '+8%' },
  { label: 'Conversion Rate', value: '3.2%', change: '+0.4%' },
];

export function StatsCards() {
  return (
    <Grid container spacing={3} mb={4}>
      {stats.map((s) => (
        <Grid item xs={12} sm={6} lg={3} key={s.label}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary">{s.label}</Typography>
            <Typography variant="h5" fontWeight={700} mt={1}>{s.value}</Typography>
            <Typography variant="body2" color="success.main" mt={0.5}>{s.change} this month</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}`,

    "components/RevenueChart.tsx": `'use client';
import { LineChart } from '@mui/x-charts/LineChart';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const revenue = [12000, 18000, 15000, 24000, 21000, 28000];

export function RevenueChart() {
  return (
    <LineChart
      xAxis={[{ data: months, scaleType: 'point' }]}
      series={[{ data: revenue, label: 'Revenue ($)', area: true }]}
      height={280}
    />
  );
}`,

    "components/DataTable.tsx": `'use client';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'customer', headerName: 'Customer', flex: 1 },
  { field: 'product', headerName: 'Product', flex: 1 },
  { field: 'amount', headerName: 'Amount', width: 120, valueFormatter: (v) => \`$\${v}\` },
  { field: 'status', headerName: 'Status', width: 130 },
  { field: 'date', headerName: 'Date', width: 130 },
];

const rows = [
  { id: 1, customer: 'Alice Johnson', product: 'Pro Plan', amount: 29, status: 'Paid', date: '2026-04-20' },
  { id: 2, customer: 'Bob Smith', product: 'Starter', amount: 0, status: 'Free', date: '2026-04-19' },
  { id: 3, customer: 'Carol White', product: 'Enterprise', amount: 299, status: 'Paid', date: '2026-04-18' },
];

export function DataTable() {
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      pageSizeOptions={[10, 25]}
      autoHeight
      disableRowSelectionOnClick
    />
  );
}`
  }
};
