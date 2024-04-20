import classNames from 'classnames';
import { MapPopupProvider } from '../../../map/MapPopupProvider';
import { useGetMapOpenStatus } from '../hooks/useMapOpenStatus';
import { ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { useSearchHomeList } from '../../../features/homes/hooks/useSearchHomeList';
import styled from 'styled-components';
import { screenWidths } from '../../../providers/ScreenProvider';
import { useToggleMapValue } from '../hooks/useToggleMap';

const StyledMapContainer = styled.div`
  flex: 1 0 500px;
  /* height: 100; */
  position: sticky;
  top: calc(var(--top-navbar-height) + var(--form-container-height));
  height: calc(
    100dvh - var(--top-navbar-height) - var(--form-container-height)
  );
  background-color: #d3d3d3;

  .custom-dot-loader {
    position: absolute;
    top: 30px;
    left: 50%;
    translate: -50%;
    z-index: 3;
    pointer-events: none;
    background-color: white;
    padding: 12px;
    font-size: 8px;
    border-radius: 1000px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px,
      rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
  }

  &.map-close {
    display: none;
  }

  #map {
    height: 100%;
    width: 100%;
    position: relative;
    z-index: 0;
  }

  .link-box {
    display: block;
    height: 250px;
    width: 250px;
  }

  .toggle-button {
    font-size: 13px;
    padding: 10px;
    border-radius: 10px;
    position: absolute;
    z-index: 2;
    top: 10px;
    right: 10px;
    background-color: rgba(255, 255, 255, 0.7);
  }

  @media (max-width: ${screenWidths.tab}px) {
    flex: 0 0 auto;
    width: 100%;
    height: calc(
      100dvh - (var(--top-navbar-height) + var(--form-container-height))
    );
    display: none;

    &.open {
      display: block;
    }
  }
`;

type Props = {
  children: ReactNode;
};

const CustomMapContainer: React.FC<Props> = ({ children }) => {
  const { isError, currentParams } = useSearchHomeList();
  const isMapOpen = useGetMapOpenStatus();
  const allowDragRefreshRef = useRef(false);
  const isToggleMapOpen = useToggleMapValue();
  const [isMapRedered, setIsMapRendered] = useState(false);

  useLayoutEffect(() => {
    if (isMapOpen) {
      setIsMapRendered(true);
    }
  }, [isMapOpen]);

  const mapClassNames = {
    'map-open': isMapOpen,
    'map-close': !isMapOpen,
  };

  const mapContainerClasses = classNames({
    'map-container': true,
    open: isToggleMapOpen,
    ...mapClassNames,
  });

  if (isError) {
    if (
      currentParams.address.length > 0 ||
      (currentParams.min.length > 0 && currentParams.max.length > 0)
    ) {
      allowDragRefreshRef.current = true;
    }
  }

  return (
    <>
      <MapPopupProvider />
      <StyledMapContainer className={mapContainerClasses}>
        {isMapRedered && children}
      </StyledMapContainer>
    </>
  );
};

export default CustomMapContainer;
