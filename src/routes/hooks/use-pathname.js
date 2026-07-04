import { useLocation } from 'react-router';

// ----------------------------------------------------------------------

export function usePathname() {
  const location = useLocation();
  return location.pathname;
}
