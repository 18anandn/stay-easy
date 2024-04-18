import classNames from 'classnames';
import ToggleButton from '../../components/buttons/ToggleButton';
import { MapPopupProvider } from '../../map/MapPopupProvider';
import { SearchHomeListParams } from '../../features/homes/types/SearchHomeListParams';
import { toSearchHomeURLParams } from '../../features/homes/services/searchHome';
import { useGetMapOpenStatus } from './hooks/useMapOpenStatus';
import { useRef } from 'react';
import { useSearchHomeList } from '../../features/homes/hooks/useSearchHomeList';
import styled from 'styled-components';
import { screenWidths } from '../../providers/ScreenProvider';
import { useToggleMapValue } from './hooks/useToggleMap';
import DotLoader from '../../components/loaders/DotLoader';
import { MapWithTile, PriceMarker, SetBounds } from '../../map/CustomMap';

const StyledMapContainer = styled.div`
  flex: 1 0 500px;
  /* height: 100; */
  position: sticky;
  top: calc(var(--top-navbar-height) + var(--form-container-height));
  height: calc(100vh - var(--top-navbar-height) - var(--form-container-height));

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
      100svh - (var(--top-navbar-height) + var(--form-container-height))
    );
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    z-index: -1;
    pointer-events: none;

    &.map-close {
      display: block;
    }

    &.open {
      z-index: 2;
      opacity: 1;
      pointer-events: auto;
    }
  }
`;

const MapDisplay: React.FC = () => {
  const { data, isError, currentParams, setSearchParams, isLoading } =
    useSearchHomeList();
  const isMapOpen = useGetMapOpenStatus();
  const allowDragRefreshRef = useRef(false);
  const isToggleMapOpen = useToggleMapValue();

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
        <ToggleButton
          defaultVal={allowDragRefreshRef.current}
          label="Refresh on map drag/zoom"
          id="toggleDraggable"
          onChange={(val) => {
            allowDragRefreshRef.current = val;
          }}
        />
        {isLoading && <DotLoader />}
        <MapWithTile
          id="map"
          center={[51.505, -0.09]}
          zoom={13}
          minZoom={2}
          zoomControl={false}
          zoomDelta={1}
          zoomSnap={0.25}
          trackResize={true}
          maxBoundsViscosity={1}
          doubleClickZoom={false}
          dragging={true}
          maxBounds={[
            [-90, -180],
            [90, 180],
          ]}
          // worldCopyJump={true}
        >
          {data?.homes.map((home) => (
            <PriceMarker
              key={home.id}
              home={home}
              position={home.location}
              price={home.price}
            />
          ))}
          <SetBounds
            // initialBounds={data?.bounds}
            isDisplayed={isMapOpen}
            yourBounds={
              // data && data.params.address.length > 0 ? data.bounds : undefined
              data?.bounds
            }
            onBoundsChange={(bounds) => {
              if (allowDragRefreshRef.current) {
                const newParams: SearchHomeListParams = {
                  ...currentParams,
                  address: '',
                  min: `${bounds.getSouthWest().lat},${
                    bounds.getSouthWest().lng
                  }`,
                  max: `${bounds.getNorthEast().lat},${
                    bounds.getNorthEast().lng
                  }`,
                  page: 1,
                  sortBy: '',
                  order: '',
                };
                // reset(newParams);
                setSearchParams(toSearchHomeURLParams(newParams));
              }
            }}
          />
        </MapWithTile>
      </StyledMapContainer>
    </>
  );
};

export default MapDisplay;
