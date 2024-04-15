import styled from 'styled-components';
import { useGetHomeData } from '../../features/owner/hooks/useGetHomeData';
import { useParams } from 'react-router-dom';
import Spinner from '../../components/loaders/Spinner';
import ErrorPage from '../ErrorPage';
import CustomImageCarousel from '../../components/CustomImageCarousel';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

const StyledOwnerHomeDetails = styled.div`
  padding: 25px 8%;

  h2 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .info {
    display: flex;
    flex-direction: column;
    /* align-items: stretch; */
    gap: 2.2rem;

    .details {
      ul {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
        font-size: 1.1rem;
      }

      li {
        word-break: break-all;
      }

      .approved {
        color: green;
      }

      .pending {
        color: #ffc107;
      }

      .rejected {
        color: red;
      }
    }

    .images {
      max-width: 500px;

      .carousel {
        width: 100%;
        aspect-ratio: 5 / 4;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
      }
    }

    .map {
      max-width: 500px;

      #map {
        aspect-ratio: 5/4;
        z-index: 1;
        overflow: hidden;
        border-radius: 20px;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
      }
    }

    .amenities {
      h3 {
        margin-bottom: 0.5rem;
      }
    }
  }
`;

const OwnerHomeDetails: React.FC = () => {
  const { homeId } = useParams();
  const { data, isLoading, isError, error } = useGetHomeData(homeId);
  return (
    <StyledOwnerHomeDetails>
      {isLoading ? (
        <Spinner />
      ) : isError || !data ? (
        <ErrorPage error={error} />
      ) : (
        <>
          <h2>{data.name}</h2>
          <div className="info">
            <div className="details">
              <h3>Details</h3>
              <ul>
                <li>
                  Verification status:{' '}
                  <span className={data.verification_status}>
                    {data.verification_status[0].toUpperCase() +
                      data.verification_status.slice(1)}
                  </span>
                </li>
                {data.verification_status === 'rejected' && (
                  <li>Reason for rejection: {data.message}</li>
                )}
                <li>Address: {data.address}</li>
                <li>
                  Coordinates:{' '}
                  {[data.location.lat, data.location.lng].join(', ')}
                </li>
                <li>Number of cabins: {data.number_of_cabins}</li>
                <li>Cabin capacity: {data.cabin_capacity}</li>
              </ul>
            </div>
            <div className="images">
              <h3>Images</h3>
              <div className="carousel">
                <CustomImageCarousel images={data.images} />
              </div>
            </div>
            <div className="map">
              <h3>Location</h3>
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
            {data.amenities && data.amenities.length !== 0 && (
              <div className="amenities">
                <h3>Amenities</h3>
                <ul>
                  {data.amenities.map((val) => (
                    <li key={val}>{val}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </StyledOwnerHomeDetails>
  );
};

export default OwnerHomeDetails;
