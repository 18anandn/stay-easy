import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useVerifyUser } from '../../features/auth/hooks/useVerifyUser';
import Spinner from '../../components/loaders/Spinner';
import { useCurrentUser } from '../../features/auth/hooks/useCurrentUser';
import NotFoundPage from '../NotFoundPage';

const StyledUserVerificationPage = styled.div`
  padding: 30px 8%;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  & > h1 {
    text-align: center;
    font-size: 2.5rem;
  }

  & > p {
    text-align: center;
    font-size: 1.3rem;
  }

  & > *:first-child {
    margin-top: auto;
  }

  & > *:last-child {
    margin-bottom: auto;
  }

  .custom-spinner {
    margin-inline: auto;
    height: min-content;
    width: min-content;
  }
`;

const UserVerificationPage: React.FC = () => {
  const { userId } = useParams();
  const { isLoading: isLoadingCurrentUser, currentUser } = useCurrentUser();
  const {
    isLoading: isVerifyingUser,
    isSuccess,
    isError,
    error,
  } = useVerifyUser(
    userId,
    new URLSearchParams(window.location.search).get('token'),
    { enabled: isLoadingCurrentUser || currentUser ? false : true }
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      window.setTimeout(() => {
        navigate('/login', { replace: true });
      }, 5000);
    }
  }, [isSuccess, navigate]);

  if (currentUser) {
    return <NotFoundPage />;
  }

  return (
    <StyledUserVerificationPage>
      {isLoadingCurrentUser ? (
        <Spinner />
      ) : (
        <>
          {isVerifyingUser && (
            <>
              <h1>Verifying your account...</h1>
              <Spinner />
            </>
          )}
          {isSuccess && (
            <>
              <h1>Your account has beed verified.</h1>
              <p>You will be shortly redirected to the login page....</p>
              <Spinner />
            </>
          )}
          {isError && (
            <>
              <h1>Error occured</h1>
              <p>{error.message}</p>
            </>
          )}
        </>
      )}
    </StyledUserVerificationPage>
  );
};

export default UserVerificationPage;
