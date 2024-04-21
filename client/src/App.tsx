import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import styled from 'styled-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';

import GlobalStyles from './GlobalStyles';
import AppLayout from './layouts/AppLayout';
import { Subdomain, getSubdomain } from './utils/getSubdomain';
import Main from './routes/Main';
import Admin from './routes/Admin';
import Owner from './routes/Owner';
import { AuthWithBaseUrl } from './routes/AuthWithBaseUrl';
import NotFoundPage from './pages/NotFoundPage';
import { Exception } from './data/Exception';
import ErrorPageWithPadding from './pages/ErrorPageWithPadding';

const StyledApp = styled.div``;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      retry: false,
      retryOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
});

const subdomain = getSubdomain();
let displayRoute = Main;
// let displayRoute = Owner;
// let displayRoute = Admin;
// let displayRoute = AuthWithBaseUrl;
switch (subdomain) {
  case Subdomain.ADMIN:
    displayRoute = Admin;
    break;
  case Subdomain.OWNER:
    displayRoute = Owner;
    break;
  case Subdomain.AUTH:
    displayRoute = AuthWithBaseUrl;
    break;
  default:
    displayRoute = Main;
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<AppLayout />}>
        <Route
          errorElement={
            <ErrorPageWithPadding
              error={
                new Exception('There was an unknown application error.', -1)
              }
            />
          }
        >
          {displayRoute}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </>
  )
);

function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    window.setTimeout(() => {
      document.querySelector('#global-loader')?.remove();
      setIsAppLoading(false);
    }, 700);
  }, []);

  if (isAppLoading) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyles />
      <StyledApp>
        <Toaster
          toastOptions={{
            duration: 3000,
            style: {
              whiteSpace: 'nowrap',
              position: 'relative',
              zIndex: '20000',
            },
          }}
        />
        <RouterProvider router={router} />
      </StyledApp>
    </QueryClientProvider>
  );
}

export default App;
