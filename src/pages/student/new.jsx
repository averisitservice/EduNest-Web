import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/global-config';
import { StudentCreateView } from 'src/sections/student/view';

const metadata = { title: `Create a New Student | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <StudentCreateView />
    </>
  );
}
