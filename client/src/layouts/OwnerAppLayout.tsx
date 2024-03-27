import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../features/auth/hooks/useCurrentUser';
import { useLayoutEffect } from 'react';
import toast from 'react-hot-toast';

import styled from 'styled-components';
import Spinner from '../components/loaders/Spinner';

const StyledOwnerAppLayout = styled.div`
  display: flex;
  flex-direction: column;

  .outlet {
    flex-grow: 1;
    display: grid;
  }

  .custom-spinner {
    font-size: 0.05rem;
  }
`;

const OwnerAppLayout: React.FC = () => {
  const { currentUser, isLoading } = useCurrentUser();
  const location = useLocation();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!isLoading) {
      if (!currentUser) {
        console.log('here');
        const redirectParam = new URLSearchParams();
        redirectParam.set('redirectTo', location.pathname + location.search);
        window.location.href = `/owner?${redirectParam.toString()}`;
        // navigate(`/auth?${redirectParam.toString()}`, { replace: true });
      } else if (currentUser.role.toLowerCase() !== 'owner') {
        toast.error('Unauthorized to access this route', {
          id: 'not-an-owner',
          duration: 4000,
        });
        navigate('/', { replace: true });
      }
    }
  }, [currentUser, isLoading, location.pathname, location.search, navigate]);

  return (
    <StyledOwnerAppLayout>
      {isLoading && <Spinner />}
      {currentUser && currentUser.role === 'owner' && (
        <div className="outlet">
          <Outlet />
        </div>
      )}
    </StyledOwnerAppLayout>
  );
};

export default OwnerAppLayout;
