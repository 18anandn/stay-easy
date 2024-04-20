import { Marker } from 'react-leaflet';
import MapWithTile from './MapWithTile';
import { LatLngExpression } from 'leaflet';

type Props = {
  location: LatLngExpression;
};

const MapWithMarker: React.FC<Props> = ({ location }) => {
  return (
    <MapWithTile id="map" center={location} zoom={13} scrollWheelZoom={false}>
      <Marker position={location} />
    </MapWithTile>
  );
};

export default MapWithMarker;
