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

const StudentListPage = lazy(() => import('src/pages/student/list'));
const StudentCreatePage = lazy(() => import('src/pages/student/new'));
const StudentEditPage = lazy(() => import('src/pages/student/edit'));
const TimetableListPage = lazy(() => import('src/pages/timetable/list'));
const AttendanceListPage = lazy(() => import('src/pages/attendance/list'));
const FeesListPage = lazy(() => import('src/pages/fees/list'));
const ExamListPage = lazy(() => import('src/pages/exam/list'));

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
        path: 'student',
        children: [
          { index: true, element: <StudentListPage /> },
          { path: 'list', element: <StudentListPage /> },
          { path: 'new', element: <StudentCreatePage /> },
          { path: 'edit/:id', element: <StudentEditPage /> },
        ],
      },
      {
        path: 'profile',
        children: [{ path: 'edit/:id', element: <ProfileEditPage /> }],
      },
      {
        path: 'timetable',
        children: [{ index: true, element: <TimetableListPage /> }],
      },
      {
        path: 'attendance',
        children: [{ index: true, element: <AttendanceListPage /> }],
      },
      {
        path: 'fees',
        children: [{ index: true, element: <FeesListPage /> }],
      },
      {
        path: 'exam',
        children: [{ index: true, element: <ExamListPage /> }],
      },
    ],
  },
];
