import { ReactNode, useEffect, useRef } from 'react';
import styled from 'styled-components';

import CloseButton from './buttons/CloseButton';
import { createPortal } from 'react-dom';

const modalTransitionDuration = 300;

const StyledDialog = styled.dialog`
  margin: auto;
  border: none;
  outline: none;
  animation: myFadeOut ${modalTransitionDuration}ms ease-out;
  z-index: 10;
  overflow: visible;
  background-color: transparent;

  &::backdrop {
    background-color: transparent;
  }

  &[open] {
    animation: myFadeIn ${modalTransitionDuration}ms ease-out;
  }

  @keyframes myFadeIn {
    0% {
      opacity: 0;
      display: none;
    }
    100% {
      opacity: 1;
      display: block;
    }
  }

  @keyframes myFadeOut {
    0% {
      opacity: 1;
      display: block;
    }
    100% {
      opacity: 0;
      display: none;
    }
  }

  .content-box {
    position: relative;
    box-shadow: 0 0 0 200vw rgba(0, 0, 0, 0.5);
    border-radius: 20px;

    & > .close-button {
      font-size: 11px;
      position: absolute;
      top: 0;
      right: 0;
      z-index: 1;
      transform: translate(-25%, 25%);
    }
  }
`;

interface Props {
  children: ReactNode;
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
  closable?: boolean;
  onClose?: () => void;
}

const Modal: React.FC<Props> = ({
  children,
  isModalOpen,
  setIsModalOpen,
  closable = true,
  onClose,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialogElement = dialogRef.current;
    if (dialogElement) {
      if (isModalOpen) {
        dialogElement.showModal();
        document.documentElement.style.setProperty(
          '--scrollbar-width',
          window.innerWidth - document.documentElement.clientWidth + 'px'
        );
        document.body.classList.add('scroll-lock');
        // disableBodyScroll(document.body, {
        //   reserveScrollBarGap: true,
        // });
      } else {
        (document.activeElement as HTMLElement)?.blur();
        dialogElement.close();
        window.setTimeout(() => {
          // enableBodyScroll(document.body);
          document.body.classList.remove('scroll-lock');
          document.documentElement.style.removeProperty('--scrollbar-width');
        }, modalTransitionDuration);
      }
    }
  }, [isModalOpen]);

  return createPortal(
    <StyledDialog
      ref={dialogRef}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          setIsModalOpen(false);
          onClose?.();
        }
      }}
    >
      <div className="content-box">
        {closable && (
          <CloseButton
            onClick={() => {
              setIsModalOpen(false);
              onClose?.();
            }}
          />
        )}
        {children}
      </div>
    </StyledDialog>,
    document.body
  );
};

export default Modal;
