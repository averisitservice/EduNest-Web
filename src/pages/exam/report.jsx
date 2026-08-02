import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/global-config';
import { ExamReportView } from 'src/sections/exam/view';

const metadata = { title: `Exam Report | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <ExamReportView />
    </>
  );
}
