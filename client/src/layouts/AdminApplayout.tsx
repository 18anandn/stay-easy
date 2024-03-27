import { Suspense, useLayoutEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Loader from '../components/loaders/Loader';
import { useCurrentUser } from '../features/auth/hooks/useCurrentUser';
import toast from 'react-hot-toast';
import AppLayout from './AppLayout';

const AdminApplayout: React.FC = () => {
  const { currentUser, isLoading } = useCurrentUser();
  const location = useLocation();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!isLoading) {
      if (!currentUser) {
        const redirectParam = new URLSearchParams();
        redirectParam.set('redirectTo', location.pathname + location.search);
        navigate(`/auth?${redirectParam.toString()}`, { replace: true });
      } else if (currentUser.role.toLowerCase() !== 'admin') {
        toast.error('Unauthorized to access this route', {
          id: 'not-an-admin',
          duration: 4000,
        });
        navigate('/', { replace: true });
      }
    }
  }, [currentUser, isLoading, location.pathname, location.search, navigate]);

  return (
    <AppLayout>
      {isLoading && <Loader />}
      {currentUser && currentUser.role === 'admin' && (
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      )}
    </AppLayout>
  );
};

export default AdminApplayout;
