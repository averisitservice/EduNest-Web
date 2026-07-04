import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/global-config';
import { SplitForgotPasswordView } from 'src/auth/view/jwt/forgot-password';

// ----------------------------------------------------------------------

const metadata = { title: `Forgot Password |  ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SplitForgotPasswordView />
    </>
  );
}
