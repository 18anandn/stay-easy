import styled from 'styled-components';
import { useGetHomeData } from '../../features/owner/hooks/useGetHomeData';
import { Link, useParams } from 'react-router-dom';
import ErrorPage from '../ErrorPage';
import Spinner from '../../components/loaders/Spinner';
import CustomImageCarousel from '../../components/CustomImageCarousel';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { moneyFormatter } from '../../utils/money-formatter';

const StyledOwnerDashboard = styled.div`
  h2 {
    h3 {
      margin-bottom: 0.3rem;
    }
    margin-bottom: 0.5rem;
    font-size: 2rem;
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .info {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 2.2rem;

    .stats {
      ul {
        list-style-position: inside;
        display: flex;
        flex-direction: column;
        gap: 0.3rem;

        li {
          font-size: 1.1rem;
        }

        a {
          color: black;
        }
      }
    }

    .images {
      .carousel {
        height: 300px;
        aspect-ratio: 4 / 3;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
      }
    }

    .map {
      width: 100%;

      #map {
        height: 500px;
        width: min(800px, 100%);
        border-radius: 20px;
        overflow: hidden;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
      }
    }

    .amenities {
      ul {
        list-style-position: inside;
      }
    }
  }
`;

const OwnerDashboard: React.FC = () => {
  const { ownerHomeId } = useParams();
  const { data, isLoading, isError, error } = useGetHomeData(ownerHomeId);

  if (isError || (!isLoading && !data)) {
    return <ErrorPage error={error} />;
  }

  return (
    <StyledOwnerDashboard>
      {isLoading ? (
        <Spinner />
      ) : (
        data && (
          <>
            <h2>Dashboard</h2>
            <div className="info">
              <div className="stats">
                <h3>Stats</h3>
                <ul>
                  <li>Revenue: {moneyFormatter(data.revenue)}</li>
                  <li>Total bookings: {data.total_bookings}</li>
                  <li>
                    <Link to="analytics">See analytics &gt;</Link>
                  </li>
                  <li>
                    <Link to="bookings">See bookings &gt;</Link>
                  </li>
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
        )
      )}
    </StyledOwnerDashboard>
  );
};

export default OwnerDashboard;
