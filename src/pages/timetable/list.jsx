import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/global-config';
import { TimetableView } from 'src/sections/timetable/view';

const metadata = { title: `Manage Timetable | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <TimetableView />
    </>
  );
}
