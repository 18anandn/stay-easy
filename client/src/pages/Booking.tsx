import styled from 'styled-components';
import useGetHome from '../features/homes/hooks/useGetHome';
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import Loader from '../components/loaders/Loader';
import {
  addDays,
  compareAsc,
  differenceInDays,
  isMatch,
  startOfDay,
} from 'date-fns';
import Button from '../components/buttons/Button';
import { moneyFormatter } from '../utils/money-formatter';
import { useCreateBooking } from '../features/booking/hooks/useCreateBooking';
import { MouseEventHandler, useEffect, useLayoutEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import LoaderOverlay from '../components/loaders/LoaderOverlay';
import { dateRangeFormatter } from '../utils/dates/date-range-formatter';
import { getMaxCheckOutDate } from '../utils/dates/max-checkout-date';
import { getFormattedLocation } from '../utils/location/format-location';
import ErrorPage from './ErrorPage';
import { useCurrentUser } from '../features/auth/hooks/useCurrentUser';
import { CHECK_IN, CHECK_OUT, DATE_FORMAT_NUM, MAX_DATE_RANGE } from '../data/constants';

const StyledBooking = styled.div`
  padding: 3rem 8%;

  .custom-loader {
    font-size: 0.1rem;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1.4rem;
  }

  h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .trip-details {
    padding-bottom: 1.5rem;
    margin-bottom: 1.4rem;
    border-bottom: 1px solid rgb(211, 211, 211);

    ul {
      list-style-type: none;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-bottom: 1.3rem;

      li {
        display: flex;
        flex-direction: column;
        font-size: 1.2rem;

        .heading {
          font-weight: bold;
        }
      }
    }
  }

  .terms {
    ul {
      margin-bottom: 1rem;
      list-style-position: inside;
      display: flex;
      flex-direction: column;
      gap: 0.8rem;

      li {
        font-size: 1.2rem;
      }
    }
  }

  .confirm-booking {
    padding: 1rem 0;
    p {
      font-size: 1.2rem;
      margin-bottom: 1.5rem;
    }

    button {
      margin-bottom: 1.5rem;
    }
  }

  .right-column {
    .box {
      position: sticky;
      position: -webkit-sticky;
      top: 6rem;
      padding: 1.4rem;
      border: 1px solid rgb(211, 211, 211);
      border-radius: 1rem;
    }

    .home-details {
      display: flex;
      gap: 1rem;
      height: 120px;
      padding-bottom: 1.5rem;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid rgb(211, 211, 211);

      img {
        height: 100%;
        aspect-ratio: 1.2;
        object-fit: cover;
        border-radius: 10px;
      }

      .data {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    }

    .pricing {
      h2 {
        margin-bottom: 0;
      }

      table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0 0.7rem;

        td {
          font-size: 1.1rem;
        }

        tr > td:nth-of-type(2) {
          text-align: end;
        }

        tr.total {
          font-weight: bold;
        }
      }
    }
  }
`;

const Booking: React.FC = () => {
  const { currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { homeId } = useParams();
  const { isLoading, data, error } = useGetHome(
    isLoadingUser ? undefined : homeId,
  );
  const { bookingFn, isBooking } = useCreateBooking();
  const [searchParams] = useSearchParams();
  let guests = parseInt(searchParams.get('guests') ?? '1');
  if (data) {
    if (isNaN(guests) || guests < 1) {
      guests = 1;
    } else if (guests > data.cabin_capacity) {
      guests = data.cabin_capacity;
    }
  }

  const start_date_param = searchParams.get(CHECK_IN);
  const end_date_param = searchParams.get(CHECK_OUT);
  let start_date =
    start_date_param && isMatch(start_date_param, DATE_FORMAT_NUM)
      ? startOfDay(new Date(start_date_param))
      : undefined;
  if (
    data &&
    start_date &&
    (compareAsc(start_date, data.minDate) < 0 ||
      compareAsc(start_date, data.maxDate) > 0)
  ) {
    start_date = undefined;
  }

  const maxCheckOutDate = useMemo(() => {
    if (!data || !start_date) return undefined;
    return getMaxCheckOutDate(start_date, MAX_DATE_RANGE, data.bookings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start_date_param, data]);

  let end_date =
    start_date && end_date_param && isMatch(end_date_param, DATE_FORMAT_NUM)
      ? startOfDay(new Date(end_date_param))
      : undefined;
  if (
    end_date &&
    start_date &&
    (compareAsc(end_date, start_date) <= 0 ||
      compareAsc(end_date, addDays(start_date, MAX_DATE_RANGE)) > 0)
  ) {
    end_date = undefined;
  }

  useLayoutEffect(() => {
    if (!isLoadingUser && !currentUser) {
      const redirectURLParam = new URLSearchParams();
      redirectURLParam.set('redirectTo', location.pathname + location.search);
      navigate(`/login?${redirectURLParam.toString()}`);
    }
  }, [currentUser, isLoadingUser, navigate, location]);

  useEffect(() => {
    function checker() {
      if (
        (start_date_param && !start_date) ||
        (end_date_param && !end_date) ||
        (data &&
          data.invalidCheckInDates.some((date) => {
            return (
              start_date && date.toISOString() === start_date.toISOString()
            );
          })) ||
        (end_date &&
          maxCheckOutDate &&
          compareAsc(end_date, maxCheckOutDate) > 0)
      ) {
        if (homeId) navigate(`home/${homeId}`, { replace: true });
      }
    }

    checker();
  }, [
    data,
    end_date,
    end_date_param,
    homeId,
    maxCheckOutDate,
    navigate,
    start_date,
    start_date_param,
  ]);

  const price_per_night = data
    ? (data.price * 100 +
        (guests > 2 ? data.price_per_guest * 100 * (guests - 2) : 0)) /
      100
    : 0;

  if (
    !homeId ||
    (!isLoading && !isLoadingUser && error) ||
    !start_date_param ||
    !end_date_param ||
    !start_date ||
    !end_date
  ) {
    return <ErrorPage />;
  }

  const nights = differenceInDays(end_date, start_date);

  const total_price = nights * price_per_night;

  const onBookingRequest: MouseEventHandler = () => {
    bookingFn(
      {
        homeId,
        from_date: start_date_param,
        to_date: end_date_param,
        guests,
      },
      {
        onSuccess: () => {
          navigate('/user/trips', { replace: true });
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <StyledBooking>
      {(isLoadingUser || isLoading) && <Loader color="black" />}
      {isBooking && <LoaderOverlay />}
      <div style={{ height: isLoading ? '0' : 'auto' }} className="grid">
        {!isLoading && !isLoadingUser && data && (
          <>
            <div className="left-column">
              <h1>Request to book</h1>
              <div className="trip-details">
                <h2>Your trip</h2>
                <ul>
                  <li>
                    <span className="heading">Dates (IST)</span>
                    <span>{dateRangeFormatter(start_date, end_date)}</span>
                  </li>
                  <li>
                    <span className="heading">Guests</span>
                    <span>
                      {guests} guest{guests > 1 ? 's' : ''}
                    </span>
                  </li>
                </ul>
                <Button
                  onClick={() => {
                    navigate(`/home/${homeId}?${searchParams.toString()}`);
                  }}
                >
                  Change details
                </Button>
              </div>
              <div className="terms">
                <h2>Terms</h2>
                <ul>
                  <li>Once the home is booked, it cannot be cancelled.</li>
                  <li>
                    Since this is a sample website, there is no payment
                    involved.
                  </li>
                  <li>The home owner will contact you for details.</li>
                  <li>
                    You must follow the ground rules put forth by the home
                    owner.
                  </li>
                </ul>
              </div>
              <div className="confirm-booking">
                <p>
                  By clicking the following button, you agree to our{' '}
                  <Link to="/privacy">privacy</Link> and{' '}
                  <Link to="/terms">terms</Link>.
                </p>
                <Button onClick={onBookingRequest}>Confirm Booking</Button>
                <p>Clicking the above button will immediately book the home.</p>
              </div>
            </div>

            <div className="right-column">
              <div className="box">
                <div className="home-details">
                  <img src={data.images[0]} alt="" />
                  <div className="data">
                    <p>{data.name}</p>
                    <p>
                      {getFormattedLocation(
                        data.city,
                        data.state,
                        data.country,
                      )}
                    </p>
                  </div>
                </div>
                <div className="pricing">
                  <h2>Price details</h2>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          {moneyFormatter(price_per_night)} &times; {nights}{' '}
                          nights
                        </td>
                        <td>{moneyFormatter(total_price)}</td>
                      </tr>
                      <tr>
                        <td>Taxes (10%)</td>
                        <td>{moneyFormatter(total_price / 10)}</td>
                      </tr>
                      <tr className="total">
                        <td>Total (INR)</td>
                        <td>{moneyFormatter((total_price * 11) / 10)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </StyledBooking>
  );
};

export default Booking;
