import { Helmet } from 'react-helmet-async';
import { DentistResetPasswordView } from 'src/auth/view/jwt/dentist-reset-password-view';
import { CONFIG } from 'src/global-config';
// ----------------------------------------------------------------------

const metadata = { title: `Dentist Reset-Password | Jwt - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DentistResetPasswordView />
    </>
  );
}
