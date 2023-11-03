import { ReactNode } from 'react';
// import L from 'leaflet'
import { MapContainer } from 'react-leaflet/MapContainer';
import { TileLayer } from 'react-leaflet/TileLayer';
import styled from 'styled-components';

const StyledCustomMap = styled.div`
  overflow: hidden;
  height: 100%;
  width: 100%;
  #map {
    height: 100%;
    width: 100%;
  }
`;

interface ContainerProps {
  children?: ReactNode;
}

const CustomMapContainer: React.FC<ContainerProps> = ({ children }) => {
  // useEffect(() => {
  //   console.log('map opened');
  //   return () => {
  //     console.log('map closed');
  //   };
  // }, []);
  return (
    <StyledCustomMap>
      <MapContainer
        id="map"
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={true}
        // zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {children}
      </MapContainer>
    </StyledCustomMap>
  );
};

export default CustomMapContainer;
