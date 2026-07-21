import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router';
import { GuestGuard } from 'src/auth/guard';
import { SplashScreen } from 'src/components/loading-screen';
import { AuthSplitLayout } from 'src/layouts/auth-split';

const Jwt = {
  SignInPage: lazy(() => import('src/pages/auth/sign-in')),
  ForgotPasswordPage: lazy(() => import('src/pages/auth/forgot-password')),
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

const ForgotPasswordSection = () => {
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
        <Jwt.ForgotPasswordPage />
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
    {
      path: 'forgot-password',
      element: <ForgotPasswordSection />,
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
