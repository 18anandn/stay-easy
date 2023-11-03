import { forwardRef } from 'react';
import styled, { css } from 'styled-components';

type StyleProps = {
  $show?: boolean;
};

const StyledObserverTarget = styled.div<StyleProps>`
  ${(props) => {
    if (!props.$show) {
      return css`
        display: none;
      `;
    }
  }}
  pointer-events: none;
  position: absolute;
  height: 200dvh;
  left: 0;
  right: 0;
  bottom: 0;
  /* background-color: rgb(128, 128, 128, 0.5); */
`;

type Props = {
  show?: boolean;
};

const ObserverTarget = forwardRef<HTMLDivElement, Props>(({ show }, ref) => {
  return <StyledObserverTarget ref={ref} $show={show}></StyledObserverTarget>;
});

export default ObserverTarget;
