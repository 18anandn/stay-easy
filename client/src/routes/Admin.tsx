import { Route } from 'react-router-dom';
import AdminApplayout from '../layouts/AdminApplayout';
import AdminHome from '../pages/admin/AdminHome';
import HomeVerification from '../pages/admin/HomeVerification';
import { lazy } from 'react';

const Privacy = lazy(() => import('../pages/Privacy'));
const Terms = lazy(() => import('../pages/Terms'));

const Admin = (
  <Route path="/" element={<AdminApplayout />}>
    <Route index element={<AdminHome />} />
    <Route path="home/:homeId" element={<HomeVerification />} />
    <Route path="privacy" element={<Privacy />} />
    <Route path="terms" element={<Terms />} />
  </Route>
);

export default Admin;
