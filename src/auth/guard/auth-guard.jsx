import { useState } from 'react';
import { useSelector } from 'react-redux';
import { usePathname, useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { RoleBasedGuard } from '.';

const signInPaths = { jwt: paths.auth.signIn };

export function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const { loggedInTeacher } = useSelector((state) => state.AuthReducer);
  const [isChecking, setIsChecking] = useState(true);
  const [isCheckPermission, setIsCheckPermission] = useState(true);

  const createRedirectPath = (currentPath) => {
    const queryString = new URLSearchParams({ returnTo: pathname }).toString();
    return `${currentPath}?${queryString}`;
  };

  if (!isCheckPermission) {
    return <RoleBasedGuard hasContent sx={{ py: 10 }} />;
  }

  return <>{children}</>;
}
