import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useCurrentUser } from '../features/auth/hooks/useCurrentUser';
import Loader from './loaders/Loader';

interface Props {
  children: ReactNode;
}

const ProtectedRoutes: React.FC<Props> = ({ children }) => {
  const { currentUser, isLoading } = useCurrentUser();
  const location = useLocation();

  if (isLoading) {
    return <Loader color="black" />;
  }

  if (!isLoading && !currentUser) {
    const redirectParam = new URLSearchParams();
    redirectParam.set('redirectTo', location.pathname + location.search);
    return <Navigate to={`/login?${redirectParam.toString()}`} replace />;
  }

  return children;
};

export default ProtectedRoutes;
