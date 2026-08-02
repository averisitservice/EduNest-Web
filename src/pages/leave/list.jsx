import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/global-config';
import { LeaveView } from 'src/sections/leave/view';

const metadata = { title: `Leave Requests | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <LeaveView />
    </>
  );
}
