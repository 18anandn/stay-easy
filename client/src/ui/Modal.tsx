import { ReactNode } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import ReactModal from 'react-modal';

const closeTimeOut = 200;
const transitionStyle = 'ease-in-out';

const ModalStyles = createGlobalStyle`

  .Modal-Overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    transition: opacity ${closeTimeOut}ms ${transitionStyle}, backdrop-filter ${closeTimeOut}ms ${transitionStyle};
    display: flex;
    overflow: auto;
  }

  .Modal-Overlay-Open {
    opacity: 1;
    backdrop-filter: blur(3px);
  }

  .Modal-Overlay-Close {
    opacity: 0;
  }

  .Modal-Content {
    width: min-content;
    margin: auto;
    pointer-events: none;
    border: none;
    outline: none;

    & > * {
      pointer-events: all;
    }
    
    .modal-box {
      margin: 50px;
      border: none;
    outline: none;
    }
  }

  .ReactModal__Body--open {
    overflow: hidden;
  }
  `;

const ContentContainer = styled.div`
  padding: 2.5rem;
  background-color: white;
  position: relative;
  border-radius: 1rem;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

  .close-button {
    position: absolute;
    top: 0;
    right: 0;
    height: 2.5rem;
    width: 2.5rem;
    font-size: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: transparent;
    border: none;
    outline: none;
  }
`;

ReactModal.setAppElement('#root');

interface Props {
  children: ReactNode;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  closable?: boolean;
}

const Modal: React.FC<Props> = ({
  children,
  isModalOpen,
  setIsModalOpen,
  closable = true,
}) => {
  return (
    <>
      <ModalStyles />
      <ReactModal
        isOpen={isModalOpen}
        shouldCloseOnEsc={true}
        parentSelector={() => document.body}
        preventScroll={true}
        onRequestClose={() => {
          if (closable) {
            setIsModalOpen(false);
          }
        }}
        closeTimeoutMS={closeTimeOut}
        overlayClassName={{
          base: 'Modal-Overlay',
          afterOpen: 'Modal-Overlay-Open',
          beforeClose: 'Modal-Overlay-Close',
        }}
        className={{
          base: 'Modal-Content',
          afterOpen: 'Modal-Content-Open',
          beforeClose: 'Modal-Content-Close',
        }}
      >
        <div className="modal-box">
          <ContentContainer>
            {closable && (
              <button
                className="close-button"
                type="button"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            )}
            {children}
          </ContentContainer>
        </div>
      </ReactModal>
    </>
  );
};

export default Modal;
