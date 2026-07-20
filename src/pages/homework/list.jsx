import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/global-config';
import { HomeworkView } from 'src/sections/homework/view';

const metadata = { title: `Homework & Notes | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <HomeworkView />
    </>
  );
}
