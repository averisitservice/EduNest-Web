import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/global-config';
import { AttendanceView } from 'src/sections/attendance/view';

const metadata = { title: `Attendance | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <AttendanceView />
    </>
  );
}
