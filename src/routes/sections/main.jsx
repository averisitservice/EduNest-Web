import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';
import { SimpleLayout } from 'src/layouts/simple';
import { SplashScreen } from 'src/components/loading-screen';
import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

const ComingSoonPage = lazy(() => import('src/pages/coming-soon'));
const ComingSoonLog = lazy(() => import('src/pages/coming-soon-log'));
const MaintenancePage = lazy(() => import('src/pages/maintenance'));

// Error
const Page500 = lazy(() => import('src/pages/error/500'));
const Page403 = lazy(() => import('src/pages/error/403'));
const Page404 = lazy(() => import('src/pages/error/404'));
// Blank
const BlankPage = lazy(() => import('src/pages/blank'));

// ----------------------------------------------------------------------

export const mainRoutes = [
  {
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      {
        element: (
          <SimpleLayout>
            <Outlet />
          </SimpleLayout>
        ),
        children: [{ path: 'blank', element: <BlankPage /> }],
      },
      {
        path: 'coming-soon',
        element: (
          <DashboardLayout slotProps={{ content: { compact: true } }}>
            <ComingSoonPage />
          </DashboardLayout>
        ),
      },
      {
        path: 'coming-soon-log',
        element: (
          <DashboardLayout slotProps={{ content: { compact: true } }}>
            <ComingSoonLog />
          </DashboardLayout>
        ),
      },
      {
        path: 'maintenance',
        element: (
          <DashboardLayout slotProps={{ content: { compact: true } }}>
            <MaintenancePage />
          </DashboardLayout>
        ),
      },
      {
        path: 'error',
        children: [
          { path: '500', element: <Page500 /> },
          { path: '404', element: <Page404 /> },
          { path: '403', element: <Page403 /> },
        ],
      },
    ],
  },
];
