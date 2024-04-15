import { ReactNode, useEffect, useRef } from 'react';
import styled from 'styled-components';

import CloseButton from './buttons/CloseButton';
import { createPortal } from 'react-dom';

const modalTransitionDuration = 200;

const StyledDialog = styled.dialog`
  /* padding: 0; */
  max-height: 100svh;
  max-width: 100svw;
  margin: auto;
  border: none;
  outline: none;
  animation: myFadeOut ${modalTransitionDuration}ms ease-out;
  z-index: 10;
  overflow: visible;

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
    max-width: var(--max-modal-width, 90svw);
    max-height: var(--max-modal-height, 90svh);
    overflow: auto;
    box-shadow: 0 0 0 200vw rgba(0, 0, 0, 0.5);
    border-radius: 20px;
    /* overflow: hidden; */

    & > .close-button {
      font-size: 11px;
      position: absolute;
      top: 0;
      right: 20px;
      z-index: 1;
      transform: translate(-25%, 25%);
      background-color: white;
    }
  }
`;

interface Props {
  children: ReactNode;
  isModalOpen: boolean;
  setIsModalOpen?: (val: boolean) => void;
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
      } else {
        dialogElement.blur();
        dialogElement.close();
        window.setTimeout(() => {
          document.body.classList.remove('scroll-lock');
          document.documentElement.style.removeProperty('--scrollbar-width');
        }, modalTransitionDuration);
      }
    }
  }, [isModalOpen]);

  useEffect(() => {
    return () => {
      document.documentElement.style.removeProperty('--scrollbar-width');
      document.body.classList.remove('scroll-lock');
    };
  }, []);

  return createPortal(
    <StyledDialog
      ref={dialogRef}
      onClick={(event) => {
        if (event.target === event.currentTarget && closable) {
          setIsModalOpen?.(false);
        }
      }}
      onClose={onClose}
    >
      <div className="content-box">
        {closable && (
          <CloseButton
            onClick={() => {
              setIsModalOpen?.(false);
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
