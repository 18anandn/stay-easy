import styled from 'styled-components';

interface SpinnerProps {
  color?: string;
}

const StyledSpinner = styled.div.attrs({
  className: 'custom-spinner',
})<SpinnerProps>`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.025rem;

  .lds-ring {
    display: inline-block;
    position: relative;
    width: 80em;
    height: 80em;
  }
  .lds-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 64em;
    height: 64em;
    margin: 8em;
    border: 8em solid ${(props) => props.color ?? 'black'};
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: ${(props) => props.color ?? 'black'} transparent transparent
      transparent;
  }
  .lds-ring div:nth-child(1) {
    animation-delay: -0.45s;
  }
  .lds-ring div:nth-child(2) {
    animation-delay: -0.3s;
  }
  .lds-ring div:nth-child(3) {
    animation-delay: -0.15s;
  }
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Spinner: React.FC<SpinnerProps> = ({ color }) => {
  return (
    <StyledSpinner color={color}>
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </StyledSpinner>
  );
};

export default Spinner;
