import styled from 'styled-components';

const StyledLoader = styled.div.attrs({
  className: 'custom-loader',
})<LoaderProps>`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.7%;

  .loader {
    color: ${(props) => props.color ?? 'black'};
    position: relative;
    font-size: 11em;
    background: ${(props) => props.color ?? 'black'};
    animation: escaleY 1s infinite ease-in-out;
    width: 1em;
    height: 4em;
    animation-delay: -0.16s;
  }
  .loader:before,
  .loader:after {
    content: '';
    position: absolute;
    top: 0;
    left: 2em;
    background: ${(props) => props.color ?? 'black'};
    width: 1em;
    height: 4em;
    animation: escaleY 1s infinite ease-in-out;
  }
  .loader:before {
    left: -2em;
    animation-delay: -0.32s;
  }

  @keyframes escaleY {
    0%,
    80%,
    100% {
      box-shadow: 0 0;
      height: 4em;
    }
    40% {
      box-shadow: 0 -2em;
      height: 5em;
    }
  }

  @keyframes sk-stretchdelay {
    0%,
    40%,
    100% {
      transform: scaleY(0.4);
      -webkit-transform: scaleY(0.4);
    }
    20% {
      transform: scaleY(1);
      -webkit-transform: scaleY(1);
    }
  }
`;

interface LoaderProps {
  color?: string;
}

const Loader: React.FC<LoaderProps> = (props) => {
  return (
    <StyledLoader {...props}>
      <span className="loader"></span>
    </StyledLoader>
  );
};

export default Loader;
