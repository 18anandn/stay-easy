import styled from 'styled-components';
import Button from '../components/buttons/Button';
import { useNavigate } from 'react-router-dom';
import { Exception } from '../data/Exception';
import { Subdomain, getSubdomain } from '../utils/getSubdomain';

const StyledErrorPage = styled.div`
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.4rem;
    margin-bottom: 2rem;
  }

  .buttons {
    display: flex;
    gap: 2rem;
  }
`;

type Props = {
  error?: any;
};

const ErrorPage: React.FC<Props> = ({ error }) => {
  const navigate = useNavigate();

  const goBack = () => {
    if (getSubdomain() === Subdomain.MAIN) {
      navigate(-1);
    } else {
      window.history.back();
    }
  };

  const goHome = () => {
    if (
      getSubdomain() !== Subdomain.MAIN &&
      error &&
      error instanceof Exception &&
      (error.statusCode === 401 || error.statusCode === 403)
    ) {
      window.location.replace('/auth');
    } else {
      navigate('/', { replace: true });
    }
  };

  let heading = 'Error occured';
  let message = 'There was an error when loading the content';
  if (error) {
    if (error instanceof Exception) {
      if (error.statusCode === 404) {
        heading = 'Page Not Found';
      }
      message = error.message;
    }
  }

  return (
    <StyledErrorPage>
      <h1>{heading}</h1>
      <p>{message}</p>
      <div className="buttons">
        {/* {navigate.length > 2 && ( */}
        <Button type="button" onClick={goBack}>
          Go back
        </Button>
        {/* )} */}
        <Button type="button" onClick={goHome}>
          Home
        </Button>
      </div>
    </StyledErrorPage>
  );
};

export default ErrorPage;
