import { Route, Navigate } from 'react-router-dom';
import ProtectedRoutes from '../components/ProtectedRoutes';
import UserRoute from '../features/auth/components/UserRoute';
import UserLayout from '../layouts/UserLayout';
import Booking from '../pages/Booking';
import Explore from '../pages/Explore';
import HomeInfo from '../pages/HomeInfo';
import HomePage from '../pages/HomePage';
import Profile from '../pages/Profile';
import Trip from '../pages/Trip';
import TripsList from '../pages/TripsList';
import MapSearch from '../pages/MapSearch';
import { Auth } from './Auth';
import { lazy } from 'react';

const CreateHotel = lazy(() => import('../pages/CreateHotel'));
const Privacy = lazy(() => import('../pages/Privacy'));
const Terms = lazy(() => import('../pages/Terms'));

const MainRoute = (
  <Route path="/" element={<UserLayout />}>
    <Route index element={<HomePage />} />
    {Auth}
    <Route
      path="register"
      element={
        <ProtectedRoutes>
          <CreateHotel />
        </ProtectedRoutes>
      }
    />
    <Route path="profile" element={<Profile />} />
    <Route path="all-homes" element={<Explore />} />
    <Route path="home/:homeId" element={<HomeInfo />} />
    <Route path="book/:homeId" element={<Booking />} />

    <Route path="user" element={<UserRoute />}>
      <Route index element={<Navigate to="trips" />} />
      <Route path="trips" element={<TripsList />} />
      <Route path="trip/:tripId" element={<Trip />} />
    </Route>
    <Route path="search" element={<MapSearch />} />
    <Route path="privacy" element={<Privacy />} />
    <Route path="terms" element={<Terms />} />
  </Route>
);
export default MainRoute;
