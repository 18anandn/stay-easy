import styled from 'styled-components';
import Spinner from './Spinner';

const StyledSpinnerWithText = styled.span`
  width: min-content;
  position: relative;

  .spinner {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

interface Props {
  text: string;
  isLoading: boolean;
  color?: string;
}

const SpinnerWithText: React.FC<Props> = ({ text, isLoading, color }) => {
  return (
    <StyledSpinnerWithText
      style={{ visibility: isLoading ? 'hidden' : 'visible' }}
    >
      {text}
      {isLoading && (
        <span
          className="spinner"
          style={{ visibility: isLoading ? 'visible' : 'hidden' }}
        >
          <Spinner color={color} />
        </span>
      )}
    </StyledSpinnerWithText>
  );
};

export default SpinnerWithText;
