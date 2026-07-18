import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/global-config';
import { FeesView } from 'src/sections/fees/view';

const metadata = { title: `Fees | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <FeesView />
    </>
  );
}
