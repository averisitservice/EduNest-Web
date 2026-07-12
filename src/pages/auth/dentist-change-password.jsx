import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/global-config';
import { DentistChangePasswordView } from 'src/auth/view/jwt';

// ----------------------------------------------------------------------

const metadata = { title: `Change password | Layout split - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DentistChangePasswordView />
    </>
  );
}
