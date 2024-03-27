import { Route } from 'react-router-dom';
import AdminApplayout from '../layouts/AdminApplayout';
import AdminHome from '../pages/admin/AdminHome';
import HomeVerification from '../pages/admin/HomeVerification';

const Admin = (
  <Route path="/" element={<AdminApplayout />}>
    <Route index element={<AdminHome />} />
    <Route path="home/:homeId" element={<HomeVerification />} />
  </Route>
);

export default Admin;
