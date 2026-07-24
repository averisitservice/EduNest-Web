import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { CONFIG } from 'src/global-config';
import { paths } from 'src/routes/paths';
import { SplashScreen } from 'src/components/loading-screen';
import { useSelector } from 'react-redux';
import enums from 'src/utils/enums';

// ----------------------------------------------------------------------

export function GuestGuard({ children }) {
  const router = useRouter();

  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || CONFIG.auth.redirectPath;
  const { loggedInTeacher } = useSelector((state) => state.AuthReducer);

  const [isChecking, setIsChecking] = useState(true);
  const checkPermissions = async () => {
    if (loggedInTeacher) {
      if (returnTo === '/' || returnTo === '/dashboard') {
        router.replace(paths.dashboard.teacher.root);
      } else {
        router.replace(returnTo);
      }
      return;
    }
    setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions();
  }, [loggedInTeacher]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
