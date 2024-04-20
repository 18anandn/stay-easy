import { useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import ToggleButton from '../../../components/buttons/ToggleButton';
import { useSearchHomeList } from '../../../features/homes/hooks/useSearchHomeList';
import { toSearchHomeURLParams } from '../../../features/homes/services/searchHome';
import { SearchHomeListParams } from '../../../features/homes/types/SearchHomeListParams';
import { MapWithTile, PriceMarker, SetBounds } from '../../../map/CustomMap';
import { useGetMapOpenStatus } from '../hooks/useMapOpenStatus';
import { useToggleMapValue } from '../hooks/useToggleMap';
import DotLoader from '../../../components/loaders/DotLoader';
import MarkerCss from '../../../map/CustomMap/MarkerCss';

const MapComponent: React.FC = () => {
  const { data, isError, currentParams, setSearchParams, isLoading, error } =
    useSearchHomeList();
  const isMapOpen = useGetMapOpenStatus();
  const allowDragRefreshRef = useRef(false);
  const isToggleMapOpen = useToggleMapValue();

  useEffect(() => {
    if (isToggleMapOpen) {
      window.scrollTo(0, 0);
    }
  }, [isToggleMapOpen]);

  useEffect(() => {
    if (isError && isToggleMapOpen) {
      toast.error(error?.message ?? 'There was an unknown server error');
    }
  }, [isError, error, isToggleMapOpen]);

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
        <MarkerCss />
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
          isDisplayed={isMapOpen && isToggleMapOpen}
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
    </>
  );
};

export default MapComponent;
