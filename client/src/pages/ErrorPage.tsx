import styled from 'styled-components';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const StyledErrorPage = styled.div`
  padding: 2rem 6rem;

  h1 {
    font-size: 4rem;
  }

  p {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }

  div {
    display: flex;
  }
`;

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  

  const goBack = (): void => {
    navigate(-1);
  };

  console.log(navigate.length)

  return (
    <StyledErrorPage>
      <h1>Error 404</h1>
      <p>Page not found</p>
      <div>
        {navigate.length > 2 && (
          <Button type="button" onClick={goBack}>
            Go back
          </Button>
        )}
        <Button type="button" onClick={() => navigate('/', { replace: true })}>
          Home
        </Button>
      </div>
    </StyledErrorPage>
  );
};

export default ErrorPage;
