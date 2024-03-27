import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const CurrentLocation: React.FC = () => {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    map.locate().on('locationfound', (e) => {
      map.setView(e.latlng, map.getZoom());
    });
  }, [map]);
  return null;
};

export default CurrentLocation;
