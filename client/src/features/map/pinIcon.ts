import L from 'leaflet';
import pinImage from '../../assets/pin.png'

const pinIcon = new L.Icon({
  iconUrl: pinImage,
  iconRetinaUrl: pinImage,
  iconSize: [50, 50],
  iconAnchor: [24.7, 45],
  // className: 'leaflet-div-icon',
  className: 'awesome-marker-icon-transparent pin-icon-shadow',
});

export { pinIcon };
