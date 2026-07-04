import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/global-config';
import { TeacherListView } from 'src/sections/teacher/view';


const metadata = { title: `Manage Teacher | Dashboard - ${CONFIG.appName}` };

export default function Page() {    
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <TeacherListView />
    </>
  );
}
