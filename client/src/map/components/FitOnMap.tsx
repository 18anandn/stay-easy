import { useMap } from 'react-leaflet';
import { LatLngBoundsExpression } from 'leaflet';

interface Props {
  bounds: LatLngBoundsExpression;
  fly?: boolean;
}

const FitOnMap: React.FC<Props> = ({ bounds, fly }) => {
  const map = useMap();
  if (fly) map.flyToBounds(bounds);
  else map.fitBounds(bounds);
  // map.zoomIn(0.5)
  return null;
};

export default FitOnMap;
