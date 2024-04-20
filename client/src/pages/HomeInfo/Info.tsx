import { getFormattedLocation } from '../../utils/location/format-location';
import ImageViewer from './ImageViewer';
import { DataProps } from './types/DataProps';
import Description from './Description';
import { useTitle } from '../../hooks/useTitle';
import LazyMapWithMarker from '../../map/CustomMap/LazyMapWithMarker';

const Info: React.FC<DataProps> = ({ data }) => {
  useTitle(data.name);

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
            <LazyMapWithMarker location={data.location} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Info;
