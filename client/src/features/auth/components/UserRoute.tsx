import { Outlet } from 'react-router-dom';

import ProtectedRoutes from '../../../components/ProtectedRoutes';

const UserRoute: React.FC = () => {
  return (
    <ProtectedRoutes>
      <Outlet />
    </ProtectedRoutes>
  );
};

export default UserRoute;
