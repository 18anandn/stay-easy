import styled from 'styled-components';
import { createPortal } from 'react-dom';
import Spinner from './Spinner';

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
`;

const SpinnerOverlay: React.FC = () => {
  return (
    <>
      {createPortal(
        <Overlay>
          <Spinner color="white" />
        </Overlay>,
        document.getElementById('root') ?? document.body
      )}
    </>
  );
};

export default SpinnerOverlay;
