import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/global-config';
import { ClassListView } from 'src/sections/class/view';


const metadata = { title: `Manage Class | Dashboard - ${CONFIG.appName}` };

export default function Page() {    
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <ClassListView />
    </>
  );
}
