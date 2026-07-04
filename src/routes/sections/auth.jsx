import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router';
import { GuestGuard } from 'src/auth/guard';
import { SplashScreen } from 'src/components/loading-screen';
import { AuthSplitLayout } from 'src/layouts/auth-split';

const Jwt = {
  SignInPage: lazy(() => import('src/pages/auth/sign-in')),
};

const LoginSection = () => {
  return (
    <GuestGuard>
      <AuthSplitLayout
        slotProps={{
          section: {
            title: '',
            subtitle: '',
          },
        }}
      >
        <Jwt.SignInPage />
      </AuthSplitLayout>
    </GuestGuard>
  );
};

const authJwt = {
  path: '',
  children: [
    {
      path: '',
      element: <LoginSection />,
    },
    {
      path: 'sign-in',
      element: <LoginSection />,
    },
  ],
};

export const authRoutes = [
  {
    path: 'auth',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [authJwt],
  },
];
