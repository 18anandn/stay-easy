import { Route } from 'react-router-dom';
import OwnerAppLayout from '../layouts/OwnerAppLayout';
import OwnerHomeLayout from '../layouts/OwnerHomeLayout';
import OwnerAnalytics from '../pages/owner/OwnerAnalytics';
import OwnerDashboard from '../pages/owner/OwnerDashboard';
import OwnerHome from '../pages/owner/OwnerHome';
import OwnerBookings from '../pages/owner/OwnerBookings';
import { HomeProvider } from '../features/owner/providers/HomeProvider';

const Owner = (
  <Route path="/" element={<OwnerAppLayout />}>
    <Route index element={<OwnerHome />} />
    <Route
      path=":ownerHomeId"
      element={
        <HomeProvider>
          <OwnerHomeLayout />
        </HomeProvider>
      }
    >
      <Route index element={<OwnerDashboard />} />
      <Route path="analytics" element={<OwnerAnalytics />} />
      <Route path="bookings" element={<OwnerBookings />} />
    </Route>
  </Route>
);

export default Owner;
