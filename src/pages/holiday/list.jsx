import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/global-config';
import { HolidaysView } from 'src/sections/holiday/view';

const metadata = { title: `Holidays | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <HolidaysView />
    </>
  );
}
