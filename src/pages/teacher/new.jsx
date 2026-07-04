import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/global-config';
import { TeacherCreateView } from 'src/sections/teacher/view';

const metadata = { title: `Create a New Teacher | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <TeacherCreateView />
    </>
  );
}
