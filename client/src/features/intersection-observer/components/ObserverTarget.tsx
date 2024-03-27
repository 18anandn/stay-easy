import { forwardRef } from 'react';
import styled, { css } from 'styled-components';

type StyleProps = {
  $show?: boolean;
};

const StyledObserverTarget = styled.div<StyleProps>`
  pointer-events: none;
  position: absolute;
  height: 100px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgb(128, 128, 128, 0.5);
  ${(props) => {
    if (!props.$show) {
      return css`
        display: none;
      `;
    }
  }}
`;

type Props = {
  show?: boolean;
};

const ObserverTarget = forwardRef<HTMLDivElement, Props>(({ show }, ref) => {
  return <StyledObserverTarget $show={show} ref={ref}></StyledObserverTarget>;
});

export default ObserverTarget;
