import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/global-config';
import { ExamMarksView } from 'src/sections/exam/view';

const metadata = { title: `Marks Entry | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <ExamMarksView />
    </>
  );
}
