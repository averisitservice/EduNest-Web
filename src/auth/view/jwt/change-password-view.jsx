import { zodResolver } from '@hookform/resolvers/zod';
import { useBoolean } from 'minimal-shared/hooks';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, IconButton, InputAdornment, Link } from '@mui/material';
import { useNavigate } from 'react-router';
import { PasswordIcon } from 'src/assets/icons';
import { toast } from 'src/components/snackbar';
import { FormHead } from 'src/auth/components/form-head';
import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import apiService from 'src/services/ApiService';
import { paths } from 'src/routes/paths';

export const ChangePasswordSchema = zod
  .object({
    oldPassword: zod.string().min(1, { message: 'Old password is required.' }),
    password: zod
      .string()
      .min(1, { message: 'Password is required.' })
      .min(8, { message: 'Password must be at least 8 characters.' }),
    confirmPassword: zod.string().min(1, { message: 'Confirm password is required.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
  .refine((data) => data.oldPassword !== data.password, {
    message: 'New password must be different from the old password.',
    path: ['password'],
  });

export function DentistChangePasswordView() {
  const showPassword = useBoolean();
  const showConfirmPassword = useBoolean();
  const showOldPassword = useBoolean();
  const navigate = useNavigate();

  const defaultValues = {
    oldPassword: '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setError,
  } = methods;

  const onSubmit = handleSubmit(async (values) => {
    const { data, errors } = await apiService.resetPasswordAsync({
      oldPassword: values.oldPassword,
      newPassword: values.password,
    });

    if (data) {
      toast.success('Password changed successfully.');
      navigate(paths.dashboard.teacher.root);
    } else if (errors) {
      const list = Array.isArray(errors) ? errors : [errors];
      list.forEach((error) => {
        const field = error.param === 'newPassword' ? 'password' : error.param;
        setError(field, { message: error.msg });
      });
    }
  });

  return (
    <>
      <FormHead
        icon={<PasswordIcon />}
        title="Change your password"
        description="Please enter your old password and set a new password for your account."
      />

      <Form methods={methods} onSubmit={onSubmit}>
        <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
          <Field.Text
            name="oldPassword"
            label="Old Password"
            type={showOldPassword.value ? 'text' : 'password'}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={showOldPassword.onToggle} edge="end">
                      <Iconify
                        icon={showOldPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Field.Text
            name="password"
            label="New Password"
            type={showPassword.value ? 'text' : 'password'}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={showPassword.onToggle} edge="end">
                      <Iconify
                        icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Field.Text
            name="confirmPassword"
            label="Confirm New Password"
            type={showConfirmPassword.value ? 'text' : 'password'}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={showConfirmPassword.onToggle} edge="end">
                      <Iconify
                        icon={
                          showConfirmPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <LoadingButton
            fullWidth
            color="inherit"
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Change password
          </LoadingButton>
        </Box>
      </Form>
    </>
  );
}
