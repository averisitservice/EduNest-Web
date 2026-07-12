import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/global-config';
import { StudentEditView } from 'src/sections/student/view';

const metadata = { title: `Edit Student | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <StudentEditView />
    </>
  );
}
