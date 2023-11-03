import styled from 'styled-components';
import Button from '../../ui/Button';
import Modal from '../../ui/Modal';
import { useEffect, useRef, useState } from 'react';
import CustomMap from './CustomMap';
import SearchInput from '../../ui/inputs/SearchInput';
import { useFormContext } from 'react-hook-form';
import { CreateHotelFormData, LatLng, RectBounds } from '../../commonDataTypes';
import CurrentLocation from './CurrentLocation';
import { LeafletMouseEventHandlerFn } from 'leaflet';
import ClickEvent from './ClickEvent';
import { Marker } from 'react-leaflet';
import Recenter from './Recenter';
import useGeoSearch from './useGeoSearch';
import toast from 'react-hot-toast';
import Loader from '../../ui/loaders/Loader';

const StyledSelectFromMap = styled.div`
  button {
    border: none;
    outline: none;
    background-color: transparent;
    white-space: nowrap;
    padding-bottom: 0.1rem;
    cursor: pointer;

    .text {
      /* text-decoration: underline; */
      border-bottom: 1px solid black;
    }

    .arrow {
      position: relative;
      top: -0.1rem;
    }

    /* &:hover {
      color: red;
      border-bottom-color: red;
    } */
  }
`;

const Container = styled.div`
  height: 70dvh;
  width: 40dvw;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  & > * {
    margin-left: auto;
    margin-right: auto;
  }
`;

const SearchContainer = styled.div`
  /* border: 1px solid red; */
  height: 2.5rem;
  display: flex;
  gap: 1rem;
`;

const Box = styled.div`
  height: 100%;
  width: 100%;
  position: relative;

  .custom-loader {
    font-size: 0.1rem;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1001;
    background-color: rgb(220, 220, 220, 0.5);
  }
`;

const SelectFromMap: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [marker, setMarker] = useState<LatLng | undefined>();
  const [corners, setCorners] = useState<RectBounds | undefined>();
  const { setValue } = useFormContext<CreateHotelFormData>();
  const { isLoading, searchLocation } = useGeoSearch();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isModalOpen) {
      setMarker(undefined);
      setCorners(undefined);
    }
  }, [isModalOpen]);

  const setPosition: LeafletMouseEventHandlerFn = (event) => {
    setCorners(undefined);
    setMarker([event.latlng.lat, event.latlng.lng]);
  };

  const onLocationSelect = () => {
    if (marker) {
      setValue('location', marker.toString());
    }
    setIsModalOpen(false);
  };

  const onSearchInitiate = () => {
    const searchString = searchRef.current?.value;
    if (searchString) {
      searchLocation(searchString, {
        onSuccess: (data) => {
          console.log(data);
          setMarker([data.lat, data.lng]);
          setCorners([
            [data.box.lat1, data.box.lon1],
            [data.box.lat2, data.box.lon2],
          ]);
        },
        onError: (err) => {
          toast.error(err.message, {
            id: 'map-search-error',
          });
        },
      });
    }
  };

  return (
    <StyledSelectFromMap>
      <button type="button" onClick={() => setIsModalOpen(true)}>
        <span className="text">Pick Location from Map</span>{' '}
        <span className="arrow">&rarr;</span>
      </button>
      <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <Container>
          <SearchContainer>
            <SearchInput
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSearchInitiate();
                }
              }}
              ref={searchRef}
            />
            <Button onClick={onSearchInitiate} type="button">
              Go
            </Button>
          </SearchContainer>
          <Box>
            {isLoading && <Loader />}
            <CustomMap>
              <ClickEvent handleClick={setPosition} />
              <CurrentLocation />
              {marker && (
                <>
                  <Marker position={marker} />
                  <Recenter latlng={marker} corners={corners} />
                </>
              )}
            </CustomMap>
          </Box>
          <Button type="button" onClick={onLocationSelect}>
            OK
          </Button>
        </Container>
      </Modal>
    </StyledSelectFromMap>
  );
};

export default SelectFromMap;
