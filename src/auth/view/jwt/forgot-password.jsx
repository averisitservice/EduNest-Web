/* eslint-disable jsx-a11y/no-autofocus */
import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import { Link } from '@mui/material';
import Box from '@mui/material/Box';
import { useForm } from 'react-hook-form';
import { PasswordIcon } from 'src/assets/icons';
import { FormHead } from 'src/auth/components/form-head';
import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { z as zod } from 'zod';

// ----------------------------------------------------------------------

export const ResetPasswordSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'Email Address  is required.' })
    .email({ message: 'Email must be a valid email address.' }),
});

// ----------------------------------------------------------------------

export function SplitForgotPasswordView() {
  const defaultValues = {
    email: '',
  };

  const methods = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(error);
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Field.Text
        name="email"
        label="Email Address"
        placeholder="example@gmail.com"
        autoFocus
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Send request..."
      >
        Send request
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        icon={<PasswordIcon />}
        title="Forgot your Password?"
        description={`Please enter the email address associated with your account. We'll email you a link to reset your password.`}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      <Link
        component={RouterLink}
        href={paths.auth.signIn}
        color="inherit"
        variant="subtitle2"
        sx={[
          {
            mt: 3,
            gap: 0.5,
            mx: 'auto',
            alignItems: 'center',
            display: 'inline-flex',
          },
        ]}
      >
        {<Iconify width={16} icon="eva:arrow-ios-back-fill" />}
        {'Return to Sign in'}
      </Link>
    </>
  );
}
