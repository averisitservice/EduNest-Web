import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input';
import apiService from 'src/services/ApiService';
import { dispatch } from 'src/store';
import { login } from 'src/store/reducers/authReducer';
import { useNavigate } from 'react-router';

import { FormHead } from '../../components/form-head';
import { getErrorMessage } from '../../utils';

// ----------------------------------------------------------------------

export const SignUpSchema = zod.object({
  firstName: zod.string().min(1, { message: 'First name is required.' }),
  surName: zod.string().min(1, { message: 'Surname is required.' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required.' })
    .email({ message: 'Email must be a valid email address.' }),
  password: zod
    .string()
    .min(1, { message: 'Password is required.' })
    .min(6, { message: 'Password must be at least 6 characters.' }),
  phone: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }),
  pin: zod
    .string()
    .trim()
    .min(6, { message: 'Pin must have six characters.' })
    .regex(/^[0-9]+$/, { message: 'Pin should not contain special characters.' })
    .optional(),
});

// ----------------------------------------------------------------------

export function JwtSignUpView() {
  const router = useRouter();
  const navigate = useNavigate();
  const showPassword = useBoolean();

  const [errorMessage, setErrorMessage] = useState('');

  const defaultValues = {
    firstName: '',
    surName: '',
    email: '',
    password: '',
    phone: '',
    pin: '',
  };

  const methods = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // const createRedirectPath = (query) => {
  //   const queryString = new URLSearchParams({ email: query }).toString();

  //   return `${paths.auth.verify}?${queryString}`;
  // };

  const onSubmit = handleSubmit(async (values) => {
    try {
      const { data, errors } = await apiService.signUpAsync(values);
      if (data) {
        const token = { session: data.session, refresh: data.refresh };
        dispatch(login({ user: data.user, token }));
        navigate('/dashboard');
      } else if (errors) {
        errors.map((error) => {
          setErrorMessage(error.msg);
        });
      }
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{ display: 'flex', gap: { xs: 3, sm: 2 }, flexDirection: { xs: 'column', sm: 'row' } }}
      >
        <Field.Text
          name="firstName"
          label="First name"
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <Field.Text name="surName" label="Surname" slotProps={{ inputLabel: { shrink: true } }} />
      </Box>

      <Field.Text name="email" label="Email address" slotProps={{ inputLabel: { shrink: true } }} />

      <Field.Text
        name="password"
        label="Password"
        placeholder="6+ characters"
        type={showPassword.value ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },

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
      <Field.Phone name="phone" label="Phone number" />
      <Field.Text
        name="pin"
        label="Pin"
        slotProps={{ inputLabel: { shrink: true }, htmlInput: { maxLength: 6 } }}
      />

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Create account..."
      >
        Create account
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        title="Get started by sign-up"
        description={
          <>
            {`Already have an account? `}

            <Link component={RouterLink} href={paths.auth.signIn} variant="subtitle2">
              Get started
            </Link>
          </>
        }
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
