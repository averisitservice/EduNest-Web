import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router';
import { AuthGuard, GuestGuard } from 'src/auth/guard';
import { SplashScreen } from 'src/components/loading-screen';
import { AuthSplitLayout } from 'src/layouts/auth-split';

const Jwt = {
  SignInPage: lazy(() => import('src/pages/auth/sign-in')),
  ForgotPasswordPage: lazy(() => import('src/pages/auth/forgot-password')),
  ChangePasswordPage: lazy(() => import('src/pages/auth/change-password')),
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

const ChangePasswordSection = () => {
  return (
    <AuthGuard>
      <AuthSplitLayout
        slotProps={{
          section: {
            title: '',
            subtitle: '',
          },
        }}
      >
        <Jwt.ChangePasswordPage />
      </AuthSplitLayout>
    </AuthGuard>
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
    {
      path: 'change-password',
      element: <ChangePasswordSection />,
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
