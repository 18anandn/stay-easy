import { useMap } from 'react-leaflet';
import { RectBounds } from '../../commonDataTypes';

interface Props {
  corners: RectBounds;
}

const FitOnMap: React.FC<Props> = ({ corners }) => {
  const map = useMap();
  map.fitBounds(corners);
  map.zoomIn(0.1)
  return null;
};

export default FitOnMap;
