import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router';

import App from './app';
import { store } from './store';
import { routesSection } from './routes/sections';

// ----------------------------------------------------------------------

const router = createBrowserRouter([
  {
    Component: () => (
      <App>
        <Outlet />
      </App>
    ),
    children: routesSection,
  },
]);

const root = createRoot(document.getElementById('root'));

root.render(
  <ReduxProvider store={store}>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </ReduxProvider>
);
