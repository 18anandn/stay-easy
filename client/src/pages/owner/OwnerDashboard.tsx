import styled from 'styled-components';
import { useGetVerifiedHomeData } from '../../features/owner/hooks/useGetVerifiedHomeData';
import { Link, useParams } from 'react-router-dom';
import ErrorPage from '../ErrorPage';
import Spinner from '../../components/loaders/Spinner';
import CustomImageCarousel from '../../components/CustomImageCarousel';
import { moneyFormatter } from '../../utils/money-formatter';
import { screenWidths } from '../../providers/ScreenProvider';
import { getFormattedLocation } from '../../utils/location/format-location';
import { DefaultMarker, MapWithTile } from '../../map/CustomMap';
import { useTitle } from '../../hooks/useTitle';
import { useHomeName } from '../../features/owner/providers/HomeProvider';

const StyledOwnerDashboard = styled.div`
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
    }

    .stats {
      ul {
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

  @media (max-width: ${screenWidths.tab}px) {
    /* padding-inline: 5%;
    padding-left: calc(5% + var(--button-width)); */
  }
`;

const OwnerDashboard: React.FC = () => {
  const { ownerHomeId } = useParams();
  const homeName = useHomeName();
  const { data, isLoading, isError, error } =
    useGetVerifiedHomeData(ownerHomeId);

  useTitle(homeName ? `Dashboard | ${homeName}` : 'Dashboard');

  return (
    <StyledOwnerDashboard>
      {isLoading ? (
        <Spinner />
      ) : isError || !data ? (
        <ErrorPage error={error} />
      ) : (
        <>
          <h2>Dashboard</h2>
          <div className="info">
            <div className="details">
              <h3>Details</h3>
              <ul>
                <li>
                  Place:{' '}
                  {getFormattedLocation(data.city, data.state, data.country)}
                </li>
                <li>Address: {data.address}</li>
                <li>
                  Coordinates:{' '}
                  {[data.location.lat, data.location.lng].join(', ')}
                </li>
                <li>Number of cabins: {data.number_of_cabins}</li>
                <li>Cabin capacity: {data.cabin_capacity}</li>
              </ul>
            </div>
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
              <MapWithTile
                id="map"
                center={data.location}
                zoom={13}
                scrollWheelZoom={false}
              >
                <DefaultMarker position={data.location} />
              </MapWithTile>
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
    </StyledOwnerDashboard>
  );
};

export default OwnerDashboard;
