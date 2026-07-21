/* eslint-disable jsx-a11y/no-autofocus */
import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, Link } from '@mui/material';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PasswordIcon } from 'src/assets/icons';
import { FormHead } from 'src/auth/components/form-head';
import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import apiService from 'src/services/ApiService';
import { z as zod } from 'zod';
import { useNavigate } from 'react-router';

// ----------------------------------------------------------------------

export const ResetPasswordSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'Email Address  is required.' })
    .email({ message: 'Email must be a valid email address.' }),
});

// ----------------------------------------------------------------------

export function SplitForgotPasswordView() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

  const onSubmit = handleSubmit(async (values) => {
    setErrorMessage('');
    setSuccessMessage('');

    const { data, errors } = await apiService.forgotPasswordAsync(values);

    if (data) {
      setSuccessMessage(data);
      navigate(paths.auth.signIn);
    } else if (errors) {
      setErrorMessage(Array.isArray(errors) ? (errors[0] && errors[0].msg) : (errors && errors.msg));
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
        description={`Please enter the email address associated with your account and we'll email you a new password.`}
      />

      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      {!!successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

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
