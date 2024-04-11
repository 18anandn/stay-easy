import classNames from 'classnames';
import styled from 'styled-components';

const StyledDotLoader = styled.div`
  font-size: 0.5rem;
  min-width: min-content;

  .loader {
    margin: auto;
    width: 6em;
    aspect-ratio: 4;
    --_g: no-repeat radial-gradient(circle closest-side, #000 90%, #0000);
    background: var(--_g) 0% 50%, var(--_g) 50% 50%, var(--_g) 100% 50%;
    background-size: calc(100% / 3) 100%;
    animation: l7 1s infinite linear;
  }

  @keyframes l7 {
    33% {
      background-size: calc(100% / 3) 0%, calc(100% / 3) 100%,
        calc(100% / 3) 100%;
    }
    50% {
      background-size: calc(100% / 3) 100%, calc(100% / 3) 0%,
        calc(100% / 3) 100%;
    }
    66% {
      background-size: calc(100% / 3) 100%, calc(100% / 3) 100%,
        calc(100% / 3) 0%;
    }
  }
`;

const DotLoader: React.FC<React.ComponentPropsWithoutRef<'div'>> = ({
  className,
  ...rest
}) => {
  const classes = classNames({
    'custom-dot-loader': true,
    [className ?? '']: true,
  });
  return (
    <StyledDotLoader className={classes} {...rest}>
      <div className="loader"></div>
    </StyledDotLoader>
  );
};

export default DotLoader;
