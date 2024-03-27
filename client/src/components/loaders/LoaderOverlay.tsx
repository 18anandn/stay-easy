import styled from 'styled-components';
import Loader from './Loader';
import { createPortal } from 'react-dom';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  font-size: 20dvh;
`;

const LoaderOverlay: React.FC = () => {
  return (
    <>
      {createPortal(
        <Overlay>
          <Loader color='white'/>
        </Overlay>,
        document.getElementById('root') ?? document.body,
      )}
    </>
  );
};

export default LoaderOverlay;
