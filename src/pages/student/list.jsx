import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/global-config';
import { StudentListView } from 'src/sections/student/view';

const metadata = { title: `Manage Students | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <StudentListView />
    </>
  );
}
