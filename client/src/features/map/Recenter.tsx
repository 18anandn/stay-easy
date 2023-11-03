import React from 'react';
import { useMap } from 'react-leaflet/hooks';
import { RectBounds } from '../../commonDataTypes';
import FitOnMap from './FitOnMap';

interface RecenterProps {
  latlng: [number, number];
  zoom?: number;
  corners?: RectBounds
}

const Recenter: React.FC<RecenterProps> = ({ latlng, zoom, corners }) => {
  const map = useMap();
  map.setView(latlng);
  if(corners) {
    return <FitOnMap corners={corners} />
  }
  return null;
};

export default Recenter;
