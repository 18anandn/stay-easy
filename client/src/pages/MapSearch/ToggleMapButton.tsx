import styled from 'styled-components';
import Button from '../../components/buttons/Button';
import { useToggleMap } from './hooks/useToggleMap';
import { screenWidths } from '../../providers/ScreenProvider';
import { useGetMapOpenStatus } from './hooks/useMapOpenStatus';
import { useEffect, useRef } from 'react';

const StyledToggleButton = styled(Button)`
  display: none;
  margin: auto;
  position: sticky;
  z-index: 4;
  background-color: #232b2b;
  border-radius: 1000px;
  margin: var(--flex-gap) auto;

  @media (max-width: ${screenWidths.tab}px) {
    display: initial;
    bottom: var(--flex-gap);
  }

  @media (max-width: ${screenWidths.phone}px) {
    bottom: calc(var(--flex-gap) + var(--form-container-height));
  }
`;

const ToggleMapButton: React.FC = () => {
  const [isToggleMapOpen, setIsToggleMapOpen] = useToggleMap();
  const isMapOpen = useGetMapOpenStatus();
  const scrollPosRef = useRef(0);

  useEffect(() => {
    if (!isToggleMapOpen) {
      window.scrollTo(window.scrollX, scrollPosRef.current);
    }
  }, [isToggleMapOpen]);

  return (
    <StyledToggleButton
      onClick={() => {
        if (!isToggleMapOpen) {
          scrollPosRef.current = window.scrollY;
          window.scrollTo(0, 0);
        }
        setIsToggleMapOpen((prev) => !prev);
      }}
      style={!isMapOpen ? { display: 'none' } : undefined}
    >
      {isToggleMapOpen ? 'Show homes' : 'Show map'}
    </StyledToggleButton>
  );
};

export default ToggleMapButton;
