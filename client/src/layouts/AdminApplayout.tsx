import { Outlet, useNavigate } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import styled from 'styled-components';
import { useCurrentUser } from '../features/auth/hooks/useCurrentUser';
import Spinner from '../components/loaders/Spinner';
import { UserRole } from '../features/auth/enums/UserRole.enum';
import { Exception } from '../data/Exception';
import ErrorPageWithPadding from '../pages/ErrorPageWithPadding';

const StyledRedirect = styled.div`
  padding: 2rem 8%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;

  h1 {
    text-align: center;
    font-size: 2rem;
  }

  .custom-spinner {
    margin: 0 auto;
    height: min-content;
    width: min-content;
  }
`;

const OwnerAppLayout: React.FC = () => {
  const { currentUser, isLoading, isError, error } = useCurrentUser();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!isLoading) {
      if (!currentUser) {
        const redirectParam = new URLSearchParams();
        redirectParam.set('redirectTo', window.location.href);
        window.location.href = `/auth?${redirectParam.toString()}`;
        return;
        // navigate(`/auth?${redirectParam.toString()}`, { replace: true });
      }
      // else if (
      //   !(
      //     currentUser.role === UserRole.OWNER ||
      //     currentUser.role === UserRole.ADMIN
      //   )
      // ) {
      //   toast.error('Unauthorized to access this route', {
      //     id: 'not-an-owner',
      //     duration: 4000,
      //   });
      //   navigate('/', { replace: true });
      // }
    }
  }, [currentUser, isLoading, navigate]);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <ErrorPageWithPadding error={error} />;
  }

  if (currentUser) {
    if (currentUser.role === UserRole.ADMIN) {
      return <Outlet />;
    }

    return (
      <ErrorPageWithPadding
        error={new Exception('Unauthorized to access this page', 403)}
      />
    );
  }

  return (
    <StyledRedirect>
      <h1>Redirecting to auth.....</h1>
      <Spinner />
    </StyledRedirect>
  );
};

export default OwnerAppLayout;
