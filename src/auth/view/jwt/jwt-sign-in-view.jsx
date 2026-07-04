import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, Box, IconButton, InputAdornment, Typography } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { useBoolean } from 'minimal-shared/hooks';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import apiService from 'src/services/ApiService';
import { login, setTenantDetail } from 'src/store/reducers/authReducer';
import { z as zod } from 'zod';
import { FormHead } from '../../components/form-head';
import utils from 'src/utils/utils';

export const SignInSchema = zod.object({
  email: zod.string().min(1, { message: 'Email is required.' }).email(),
  password: zod
    .string()
    .min(1, { message: 'Password is required.' })
    .min(8, { message: 'Password must be at least 8 characters.' })
});

export function JwtSignInView() {
  const dispatch = useDispatch();
  const showPassword = useBoolean();
  const navigate = useNavigate();

  const webAppVersion = import.meta.env.VITE_APP_VERSION;
  const [errorMessage, setErrorMessage] = useState('');

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (values) => {
    // values.domainName = 'witty-forest-09943ce10.1.azurestaticapps.net';

    const { data, errors } = await apiService.loginAsync(values);

    if (data) {
      const token = { session: data.session, refresh: data.refresh };
      let currentTokenUser = jwtDecode(token.session);
      currentTokenUser = { ...currentTokenUser, ...data.teacher };
      dispatch(login({ teacher: currentTokenUser, token: token }));
      dispatch(setTenantDetail(data.tenant));
      utils.setItemToStorage('tenant', JSON.stringify(data.tenant));
      navigate('/dashboard/teacher');
    } else if (errors) {
      setErrorMessage(errors[0].msg);
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Field.Text name="email" label="Email" maxLength={100} type='email' />
      <Field.Text
        name="password"
        label="Password"
        placeholder="8+ characters"
        type={showPassword.value ? 'text' : 'password'}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={showPassword.onToggle} edge="end">
                  <Iconify icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
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
        loadingIndicator="Sign in..."
      >
        Sign in
      </LoadingButton>

      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} align="center">
        Version {webAppVersion}
      </Typography>
    </Box >
  );

  return (
    <>
      <FormHead
        title="Sign in to your account"
        sx={{ textAlign: { xs: 'center', md: 'left' } }}
      />

      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>
    </>
  );
}
