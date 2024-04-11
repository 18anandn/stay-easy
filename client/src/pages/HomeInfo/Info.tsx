import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { getFormattedLocation } from '../../utils/location/format-location';
import ImageViewer from './ImageViewer';
import { DataProps } from './types/DataProps';
import Description from './Description';

const Info: React.FC<DataProps> = ({ data }) => {
  return (
    <>
      <h1 className="home-name">{data.name}</h1>
      <ImageViewer images={data.images} />
      <div className="left-column">
        <p className="location">
          {getFormattedLocation(data.city, data.state, data.country)}
        </p>
        <div className="amenities">
          <h2>Amenities</h2>
          <ul>
            {data.amenities.map((amenity) => (
              <li key={amenity}>{amenity}</li>
            ))}
          </ul>
        </div>
        <Description data={data} />
        <div className="map">
          <h2>Location</h2>
          <div className="map-container">
            <MapContainer
              id="map"
              center={data.location}
              zoom={13}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
              />
              <Marker position={data.location} />
            </MapContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default Info;
