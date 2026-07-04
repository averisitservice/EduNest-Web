import { lazy } from 'react';
import { Navigate } from 'react-router';
import { CONFIG } from 'src/global-config';

import { authRoutes } from './auth';
import { dashboardRoutes } from './dashboard';
import { mainRoutes } from './main';
import { guestRoutes } from './guest';

const Page404 = lazy(() => import('src/pages/error/404'));
export const routesSection = [
  {
    path: '/',
    element: <Navigate to={CONFIG.auth.redirectPath} replace />,
  },

  // Auth
  ...authRoutes,
  ...mainRoutes,
  ...dashboardRoutes,
  ...guestRoutes,
  // No match
  { path: '*', element: <Page404 /> },
];
