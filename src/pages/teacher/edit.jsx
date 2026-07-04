import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/global-config';
import { TeacherEditView } from 'src/sections/teacher/view';

const metadata = { title: `Edit a Teacher| Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <TeacherEditView />
    </>
  );
}
