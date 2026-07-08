import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router';
import { AuthGuard } from 'src/auth/guard';
import { LoadingScreen } from 'src/components/loading-screen';
import { DashboardLayout } from 'src/layouts/dashboard';


const IndexPage = lazy(() => import('src/pages'));

const ClassListPage = lazy(() => import('src/pages/class/list'));

const TeacherListPage = lazy(() => import('src/pages/teacher/list'));
const TeacherCreatePage = lazy(() => import('src/pages/teacher/new'));
const TeacherEditPage = lazy(() => import('src/pages/teacher/edit'));
const ProfileEditPage = lazy(() => import('src/pages/teacher/profile'));


const dashboardLayout = () => (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const dashboardRoutes = [
  {
    path: '/',
    element: <AuthGuard>{dashboardLayout()}</AuthGuard>,
    children: [
      {
        path: '/',
        children: [{ index: true, element: <TeacherListPage /> }],
      },
    ],
  },
  {
    path: 'dashboard',
    element: <AuthGuard>{dashboardLayout()}</AuthGuard>,
    children: [
      { index: true, element: <IndexPage /> },
      {
        path: 'class',
        children: [
          { index: true, element: <ClassListPage /> },
          { path: 'list', element: <ClassListPage /> },
        ],
      },
      {
        path: 'teacher',
        children: [
          { index: true, element: <TeacherListPage /> },
          { path: 'list', element: <TeacherListPage /> },
          { path: 'new', element: <TeacherCreatePage /> },
          { path: 'edit/:id', element: <TeacherEditPage /> },
        ],
      },
      {
        path: 'profile',
        children: [{ path: 'edit/:id', element: <ProfileEditPage /> }],
      }
    ],
  },
];
