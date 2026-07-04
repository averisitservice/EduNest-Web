/* eslint-disable react-hooks/exhaustive-deps */
import Button from '@mui/material/Button';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import { logout } from 'src/store/reducers/authReducer';

export function SignOutButton({ onClose, sx, ...other }) {
  const router = useRouter();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = useCallback(async () => {
    try {
      navigate('/auth/sign-in');
      dispatch(logout());
      onClose?.();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Unable to logout.');
    }
  }, [onClose, router]);

  return (
    <Button
      fullWidth
      variant="soft"
      size="large"
      color="error"
      onClick={handleLogout}
      sx={sx}
      {...other}
    >
      Logout
    </Button>
  );
}
