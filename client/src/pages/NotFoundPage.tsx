import styled from 'styled-components';
import ErrorPage from './ErrorPage';
import { Exception } from '../data/Exception';

const StyledNotFoundPage = styled.div`
  padding: 30px 8%;
`;

const NotFoundPage: React.FC = () => {
  return (
    <StyledNotFoundPage>
      <ErrorPage
        error={
          new Exception('The page you are looking for does not exist', 404)
        }
      />
    </StyledNotFoundPage>
  );
};

export default NotFoundPage;
