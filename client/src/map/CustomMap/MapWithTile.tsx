import { ComponentProps } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';

type Props = ComponentProps<typeof MapContainer>;

const MapWithTile: React.FC<Props> = ({ children, ...rest }) => {
  return (
    <MapContainer id="map" dragging={!L.Browser.mobile} {...rest}>
      {children}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
};

export default MapWithTile;
