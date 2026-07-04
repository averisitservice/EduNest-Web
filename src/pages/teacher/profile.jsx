import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/global-config';
import { ProfileEditView } from 'src/sections/teacher/view/profile-edit-view';

// ----------------------------------------------------------------------

const metadata = { title: `Profile Edit | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProfileEditView />
    </>
  );
}
