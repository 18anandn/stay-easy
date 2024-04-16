import styled from 'styled-components';
import Spinner from './Spinner';

const StyledRedirectingBox = styled.div`
  margin: auto;
  display: flex;
  gap: 1rem;
  flex-direction: column;

  .custom-spinner {
    margin: auto;
    height: min-content;
    width: min-content;
  }
`;

type Props = {
  text: string;
};

const RedirectingBox: React.FC<Props> = ({ text }) => {
  return (
    <StyledRedirectingBox>
      <h1>{text}</h1>
      <Spinner />
    </StyledRedirectingBox>
  );
};

export default RedirectingBox;
