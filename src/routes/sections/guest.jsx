import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router';
import { LoadingScreen } from 'src/components/loading-screen';
import { MainLayout } from 'src/layouts/main';

// ----------------------------------------------------------------------

// Test render page by role
const PermissionDeniedPage = lazy(() => import('src/pages/permission'));

const ComingSoonPage = lazy(() => import('src/pages/coming-soon'));

const ComingSoonLog = lazy(() => import('src/pages/coming-soon-log'));

// ----------------------------------------------------------------------

const paymentLayout = () => (
  <MainLayout isGuestRoute={true}>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </MainLayout>
);

export const guestRoutes = [
  {
    path: '/',
    element: <>{paymentLayout()}</>,
    children: [
      {
        path: 'logs',
        element: <ComingSoonLog />,
      },
      {
        path: 'page',
        element: <ComingSoonPage />,
      },
      { path: 'permission', element: <PermissionDeniedPage /> },
    ],
  },
];
