import { MapContainer } from 'react-leaflet/MapContainer';
import { TileLayer } from 'react-leaflet/TileLayer';
import { Marker } from 'react-leaflet/Marker';
import { Polygon } from 'react-leaflet/Polygon';
import { Popup } from 'react-leaflet/Popup';
import moduleName from 'react-leaflet';
import styled from 'styled-components';

import Button from '../ui/Button';
import Recenter from '../features/map/Recenter';
import { useEffect, useState } from 'react';
import CustomMapContainer from '../features/map/CustomMap';
import { LeafletMouseEvent, LeafletMouseEventHandlerFn } from 'leaflet';
import ClickEvent from '../features/map/ClickEvent';
import { pinIcon } from '../features/map/pinIcon';
import Input from '../ui/inputs/Input';
import SearchBox from '../ui/inputs/SearchInput';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import { RectBounds, SearchInputFields } from '../commonDataTypes';
import FitOnMap from '../features/map/FitOnMap';
import { useFormAction } from 'react-router-dom';
import Explore from './Explore';

const StyledMapSearch = styled.div`
  padding-top: 1.5rem;
  /* height: 100%; */
  display: grid;
  grid-template-columns: 2fr 1fr;
`;

const StyledSearchContainer = styled.div`
  /* height: 100%; */
  /* display: flex; */
`;

const Box = styled.div`
  flex-grow: 1;
  height: 100%;
`;

const MapSearch: React.FC = () => {
  const Maharashtra: RectBounds = [
    [15.6063596, 72.6526112],
    [22.0302528, 80.8977842],
  ];

  const onSearch = ({ search }: SearchInputFields) => {
    console.log(search);
  };

  return (
    <StyledMapSearch>
      <StyledSearchContainer>
        
      </StyledSearchContainer>
      <CustomMapContainer>
        <FitOnMap corners={Maharashtra} />
      </CustomMapContainer>
    </StyledMapSearch>
  );
};

export default MapSearch;
