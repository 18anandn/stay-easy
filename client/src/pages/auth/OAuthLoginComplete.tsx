import { useEffect } from 'react';
import { AuthMessage } from '../../features/auth/enums/AuthMessage.enum';
import { useNavigate, useParams } from 'react-router-dom';
import RedirectingBox from '../../components/loaders/RedirectingBox';
import { Subdomain, getSubdomain } from '../../utils/getSubdomain';
import styled from 'styled-components';
import Spinner from '../../components/loaders/Spinner';

const StyledOAuth = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  & > * {
    margin-inline: auto;
  }

  h1 {
    text-align: center;
  }

  p {
    white-space: pre-line;
  }

  & > *:first-child {
    margin-top: auto;
  }

  & > *:last-child {
    margin-bottom: auto;
  }

  .custom-spinner {
    height: min-content;
    width: min-content;
  }
`;

const parentWindow: Window | undefined | null = window.opener;
const OAuthLoginComplete: React.FC = () => {
  const { authstatus } = useParams();
  const navigate = useNavigate();
  const errorMessage = new URLSearchParams(window.location.search).get('error');

  useEffect(() => {
    if (parentWindow) {
      if (authstatus === 'success') {
        parentWindow.postMessage(AuthMessage.SUCCESS, '*');
        window.setTimeout(() => {
          window.close();
        }, 1200);
      } else {
        parentWindow.postMessage(AuthMessage.FAILURE, '*');
      }
    } else {
      if (getSubdomain() === Subdomain.MAIN) {
        navigate('/', { replace: true });
      } else {
        window.location.replace('/auth');
      }
    }
  }, [authstatus, navigate]);

  if (!parentWindow) {
    if (getSubdomain() === Subdomain.MAIN) {
      return null;
    }
    return <RedirectingBox text="Redirecting..." />;
  }

  return (
    <StyledOAuth>
      {authstatus === 'success' ? (
        <>
          <h1>Successfully authenticated</h1> <Spinner />
        </>
      ) : (
        <>
          <h1>Authentication failed</h1>
          <p>
            {errorMessage && errorMessage.length > 0
              ? errorMessage
              : 'There was an unknown error while authentication'}
          </p>
        </>
      )}
    </StyledOAuth>
  );
};

export default OAuthLoginComplete;
