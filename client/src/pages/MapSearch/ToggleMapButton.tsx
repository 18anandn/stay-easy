import styled from 'styled-components';
import Button from '../../components/buttons/Button';
import { useToggleMap } from './hooks/useToggleMap';
import {
  ScreenType,
  screenWidths,
  useScreen,
} from '../../providers/ScreenProvider';
import { useGetMapOpenStatus } from './hooks/useMapOpenStatus';
import { useEffect, useRef } from 'react';
import { useSearchHomeList } from '../../features/homes/hooks/useSearchHomeList';

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
  const { data } = useSearchHomeList();
  const scrollPosRef = useRef(0);
  const screen = useScreen();

  useEffect(() => {
    scrollPosRef.current = 0;
  }, [data]);

  useEffect(() => {
    if (screen === ScreenType.DESKTOP) {
      setIsToggleMapOpen(true);
    } else {
      setIsToggleMapOpen(false);
    }
  }, [screen, setIsToggleMapOpen]);

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
