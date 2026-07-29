import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/global-config';
import { ExamEditView } from 'src/sections/exam/view';

const metadata = { title: `Edit Exam | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <ExamEditView />
    </>
  );
}
