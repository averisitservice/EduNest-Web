import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/global-config';
import { ExamsView } from 'src/sections/exam/view';

const metadata = { title: `Exams | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <ExamsView />
    </>
  );
}
