import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/global-config';
import { EventsView } from 'src/sections/event/view';

const metadata = { title: `Events | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <EventsView />
    </>
  );
}
