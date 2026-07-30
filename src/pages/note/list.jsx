import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/global-config';
import { NotesView } from 'src/sections/note/view';

const metadata = { title: `Notes | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <NotesView />
    </>
  );
}
