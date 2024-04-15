import { Navigate, Route } from 'react-router-dom';
import OwnerAppLayout from '../layouts/owner/OwnerAppLayout';
import OwnerHomeLayout from '../layouts/owner/OwnerHomeLayout';
import OwnerAnalytics from '../pages/owner/OwnerAnalytics';
import OwnerDashboard from '../pages/owner/OwnerDashboard';
import OwnerHome from '../pages/owner/OwnerHome';
import OwnerBookings from '../pages/owner/OwnerBookings';
import { HomeProvider } from '../features/owner/providers/HomeProvider';
import OwnerHomeDetails from '../pages/owner/OwnerHomeDetails';
import OwnerBaseLayout from '../layouts/owner/OwnerBaseLayout';

const Owner = (
  <Route path="/" element={<OwnerAppLayout />}>
    <Route element={<OwnerBaseLayout />}>
      <Route index element={<OwnerHome />} />
      <Route path="details">
        <Route index element={<Navigate to="/" replace />} />
        <Route path=":homeId" element={<OwnerHomeDetails />} />
      </Route>
    </Route>
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
