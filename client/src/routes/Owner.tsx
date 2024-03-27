import { Route } from 'react-router-dom';
import OwnerAppLayout from '../layouts/OwnerAppLayout';
import OwnerHomeLayout from '../layouts/OwnerHomeLayout';
import OwnerAnalytics from '../pages/owner/OwnerAnalytics';
import OwnerDashboard from '../pages/owner/OwnerDashboard';
import OwnerHome from '../pages/owner/OwnerHome';
import OwnerBookings from '../pages/owner/OwnerBookings';
import HomeContextProvider from '../features/owner/context/HomeContextProvider';

const Owner = (
  <Route path="/" element={<OwnerAppLayout />}>
    <Route index element={<OwnerHome />} />
    <Route
      path=":ownerHomeId"
      element={
        <HomeContextProvider>
          <OwnerHomeLayout />
        </HomeContextProvider>
      }
    >
      <Route index element={<OwnerDashboard />} />
      <Route path="analytics" element={<OwnerAnalytics />} />
      <Route path="bookings" element={<OwnerBookings />} />
    </Route>
  </Route>
);

export default Owner;
