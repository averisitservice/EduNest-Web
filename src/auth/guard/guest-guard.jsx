import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { CONFIG } from 'src/global-config';
import { SplashScreen } from 'src/components/loading-screen';
import { useSelector } from 'react-redux';
import enums from 'src/utils/enums';

// ----------------------------------------------------------------------

export function GuestGuard({ children }) {
  const router = useRouter();

  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || CONFIG.auth.redirectPath;
  const { loggedInUser } = useSelector((state) => state.AuthReducer);

  const [isChecking, setIsChecking] = useState(true);
  const checkPermissions = async () => {
    if (loggedInUser) {
      if (returnTo === '/' || returnTo === '/dashboard') {
        router.replace('/dashboard/tenant');
      } else {
        router.replace(returnTo);
      }
      return;
    }
    setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions();
  }, [loggedInUser]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
