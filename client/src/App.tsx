import {
  Navigate,
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
import HomeInfo from './pages/HomeInfo';
import Privacy from './pages/Privacy';
import ErrorPage from './pages/ErrorPage';
import Terms from './pages/Terms';
import Booking from './pages/Booking';
import Trips from './pages/Trips';

const StyledApp = styled.div`
  /* height: 100dvh; */
  width: calc(100dvw - (100dvw - 100%));
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
      staleTime: Infinity,
      cacheTime: Infinity,
      retry: false,
      refetchOnWindowFocus: false,
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
          <Route path="all-homes" element={<Explore />} />
          <Route path="home/:homeId" element={<HomeInfo />} />
          <Route path="book/:homeId" element={<Booking />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="user">
            <Route index element={<Navigate to="trips" />} />
            <Route path="trips" element={<Trips />} />
          </Route>
          <Route path="*" element={<ErrorPage />} />
          <Route
            path="search"
            element={
              <ProtectedRoutes>
                <MapSearch />
              </ProtectedRoutes>
            }
          />
        </Route>
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
