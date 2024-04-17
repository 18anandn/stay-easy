import styled from 'styled-components';
import { createPortal } from 'react-dom';
import Spinner from './Spinner';
import { useEffect } from 'react';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  font-size: 18vh;

  .custom-spinner {
    font-size: 1px;
  }
`;

const SpinnerOverlay: React.FC = () => {
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--scrollbar-width',
      window.innerWidth - document.documentElement.clientWidth + 'px'
    );
    document.body.classList.add('scroll-lock');

    return () => {
      document.documentElement.style.removeProperty('--scrollbar-width');
      document.body.classList.remove('scroll-lock');
    };
  }, []);

  return (
    <>
      {createPortal(
        <Overlay>
          <Spinner color="white" />
        </Overlay>,
        document.body
      )}
    </>
  );
};

export default SpinnerOverlay;
