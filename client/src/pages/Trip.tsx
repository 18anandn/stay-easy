import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { IoIosArrowForward, IoMdArrowRoundBack } from 'react-icons/io';

import { useGetTrip } from '../features/booking/hooks/useGetTrip';
import Loader from '../components/loaders/Loader';
import ErrorPage from './ErrorPage';
import { getFormattedLocation } from '../utils/location/format-location';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { moneyFormatter } from '../utils/money-formatter';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { DATE_FORMAT_TEXT } from '../data/constants';

const StyledTrip = styled.div`
  height: calc(100dvh - var(--top-navbar-height));

  .custom-loader {
    font-size: 0.1rem;
  }

  .grid-container {
    height: 100%;
    display: grid;
    grid-template-columns: 40rem 1.5fr;
  }

  .left-column {
    height: 100%;
    padding: 0 2rem;
    overflow-x: hidden;
    overflow-y: auto;
    /* border: 1px solid red; */

    .back-link {
      display: block;
      margin-top: 0.5rem;
      font-size: 1.9rem;
      text-decoration: none;
      color: black;
      position: relative;
      left: -0.5rem;
    }

    h1 {
      font-size: 2rem;
      margin-bottom: 1.5rem;
    }

    .home {
      margin-bottom: 1.8rem;
      display: flex;
      gap: 1rem;

      img {
        height: 10rem;
        width: 30rem;
        object-fit: cover;
        object-position: center;
        border-radius: 1rem;
        overflow: hidden;
      }

      .info {
        align-self: stretch;
        display: flex;
        flex-direction: column;
        font-size: 1.1rem;

        a {
          width: max-content;
          margin-top: auto;
          color: black;

          span {
            position: relative;
            top: 0.2rem;
          }
        }
      }
    }

    .trip-details {
      font-size: 1.1rem;

      td {
        padding-right: 5rem;
        padding-bottom: 0.6rem;
      }
    }
  }

  .right-column {
    /* border: 1px solid red; */

    #map {
      height: 100%;
      width: 100%;
    }
  }
`;

const Trip: React.FC = () => {
  const { tripId } = useParams();
  const { data, isLoading, error } = useGetTrip(tripId ?? 'none');
  return (
    <StyledTrip>
      {isLoading ? (
        <Loader />
      ) : data ? (
        <div className="grid-container">
          <div className="left-column">
            <Link to="/user/trips" className="back-link">
              <IoMdArrowRoundBack />
            </Link>
            <h1>Your stay at {data.home.name}</h1>
            <div className="home">
              <img src={data.home.main_image} alt="" />
              <div className="info">
                <p>
                  {getFormattedLocation(
                    data.home.city,
                    data.home.state,
                    data.home.country,
                  )}
                </p>
                {data.home.address && <p>{data.home.address}</p>}
                <Link to={`/home/${data.home.id}`}>
                  View home{' '}
                  <span>
                    <IoIosArrowForward />
                  </span>
                </Link>
              </div>
            </div>
            <table className="trip-details">
              <tbody>
                <tr>
                  <td>Booking ID</td>
                  <td>{data.id}</td>
                </tr>
                <tr>
                  <td>Check-in</td>
                  <td>
                    {format(
                      utcToZonedTime(data.from_date, data.home.time_zone),
                      DATE_FORMAT_TEXT,
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Check-out</td>
                  <td>
                    {format(
                      utcToZonedTime(data.to_date, data.home.time_zone),
                      DATE_FORMAT_TEXT,
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Guests</td>
                  <td>{data.guests ?? '-'}</td>
                </tr>
                <tr>
                  <td>Paid</td>
                  <td>{moneyFormatter(data.paid)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="right-column">
            <MapContainer id="map" center={data.home.location} zoom={13}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
              />
              <Marker position={data.home.location} />
            </MapContainer>
          </div>
        </div>
      ) : (
        <ErrorPage error={error} />
      )}
    </StyledTrip>
  );
};

export default Trip;
