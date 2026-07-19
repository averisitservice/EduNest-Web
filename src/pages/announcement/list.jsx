import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/global-config';
import { AnnouncementsView } from 'src/sections/announcement/view';

const metadata = { title: `Announcements | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <AnnouncementsView />
    </>
  );
}
