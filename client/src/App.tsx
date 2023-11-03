import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import styled from 'styled-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import HomePage from './pages/HomePage';
import AppLayout from './ui/AppLayout';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import GlobalStyles from './GlobalStyles';
import { Toaster } from 'react-hot-toast';
import MapSearch from './pages/MapSearch';
import Profile from './pages/Profile';
import ProtectedRoutes from './ui/ProtectedRoutes';
import CreateHotel from './pages/CreateHotel';
import Explore from './pages/Explore';

const StyledApp = styled.div`
  height: 100dvh;
  width: calc(100dvw - (100vw - 100%));
  overflow: hidden;
  /* background: #FBFAF5; */

  /* background: #c9d6ff;
  background: -webkit-linear-gradient(
    to right,
    #fdfbfb,
    #ebedee
  ); 
  background: linear-gradient(
    to right,
    #fdfbfb,
    #ebedee
  ); */
`;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 20 * 1000,
    },
  },
  logger: {
    log: () => {},
    warn: () => {},
    error: () => {},
  },
});

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<Login />} />
          <Route
            path="register"
            element={
              <ProtectedRoutes>
                <CreateHotel />
              </ProtectedRoutes>
            }
          />
          <Route path="signup" element={<SignUp />} />
          <Route path="profile" element={<Profile />} />
          <Route path="explore" element={<Explore />} />
        </Route>
        <Route
          path="/search"
          element={
            <ProtectedRoutes>
              <MapSearch />
            </ProtectedRoutes>
          }
        />
      </Route>,
    ),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        toastOptions={{
          duration: 3000,
          style: {
            whiteSpace: 'nowrap',
          },
        }}
      />
      <GlobalStyles />
      <StyledApp>
        <RouterProvider router={router} />
      </StyledApp>
    </QueryClientProvider>
  );
}

export default App;
