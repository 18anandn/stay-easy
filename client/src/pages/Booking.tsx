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
import { differenceInDays } from 'date-fns';
import Button from '../components/buttons/Button';
import { moneyFormatter } from '../utils/money-formatter';
import { useCreateBooking } from '../features/booking/hooks/useCreateBooking';
import { MouseEventHandler, useLayoutEffect } from 'react';
import toast from 'react-hot-toast';
import LoaderOverlay from '../components/loaders/SpinnerOverlay';
import { dateRangeFormatter } from '../utils/dates/date-range-formatter';
import { getFormattedLocation } from '../utils/location/format-location';
import ErrorPage from './ErrorPage';
import { useCurrentUser } from '../features/auth/hooks/useCurrentUser';
import { CHECK_IN, CHECK_OUT } from '../data/constants';
import { isValidInitialParams } from '../utils/isValidInitialParams';
import { safeToUTCDate } from '../utils/dates/toUTCDate';
import Spinner from '../components/loaders/Spinner';
import { screenWidths } from '../providers/ScreenProvider';
import { useTitle } from '../hooks/useTitle';
import { TripSortEnum } from '../features/booking/enums/TripSort.enum';

const StyledBooking = styled.div`
  padding: var(--padding-block, 20px) var(--padding-inline-large, 10%);

  .custom-loader {
    font-size: 0.1rem;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(4, auto);
    gap: 1rem;
    columns: 2;
  }

  .grid > * {
    grid-column: 1 / 1;
  }

  h1 {
    font-size: 2.5rem;
  }

  h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .trip-details {
    padding-bottom: 1rem;
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
      display: flex;
      flex-direction: column;
      gap: 0.8rem;

      li {
        font-size: 1.2rem;
      }
    }
  }

  .confirm-booking {
    display: flex;
    flex-direction: column;
    gap: 20px;

    p {
      font-size: 1.2rem;
    }
  }

  .right-column {
    grid-column: 2 / 2;
    grid-row: 1 / -1;

    .box {
      position: sticky;
      position: -webkit-sticky;
      top: calc(var(--padding-block, 20px) + var(--top-navbar-height, 6rem));
      padding: 1.4rem;
      border: 1px solid rgb(211, 211, 211);
      border-radius: 1rem;
      column-span: 2;
      /* grid-column: 2;
    grid-row: 1 / -1; */
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

  @media (max-width: ${screenWidths.phone}px) {
    padding-inline: 8%;

    .grid {
      display: flex;
      flex-direction: column;
    }

    h1 {
      font-size: 2rem;
      order: -2;
    }

    h2 {
      font-size: 1.5rem;
    }

    .right-column {
      order: -1;
    }
  }
`;

const Booking: React.FC = () => {
  const { currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { homeId } = useParams();
  const { isLoading, data, error } = useGetHome(
    isLoadingUser ? undefined : homeId
  );
  const { bookingFn, isBooking } = useCreateBooking();
  const [searchParams] = useSearchParams();

  useTitle(data ? `Confirm booking at ${data.name}` : undefined);

  useLayoutEffect(() => {
    document.documentElement.style.setProperty(
      '--padding-inline',
      'var(--padding-inline-large)'
    );
    return () => {
      document.documentElement.style.removeProperty('--padding-inline');
    };
  }, []);

  useLayoutEffect(() => {
    if (!isLoadingUser && !currentUser) {
      const redirectURLParam = new URLSearchParams();
      redirectURLParam.set('redirectTo', location.pathname + location.search);
      navigate(`/login?${redirectURLParam.toString()}`, { replace: true });
    }
  }, [currentUser, isLoadingUser, navigate, location]);

  useLayoutEffect(() => {
    if (data) {
      const searchParamsOnInitialLoad = new URLSearchParams(
        document.location.search
      );
      if (
        !isValidInitialParams(searchParamsOnInitialLoad, data) ||
        data.unavailable
      ) {
        navigate(`/home/${data.id}`, { replace: true });
      }
    }
  }, [data, navigate]);

  const start_date_param = searchParams.get(CHECK_IN);
  const end_date_param = searchParams.get(CHECK_OUT);

  const start_date = safeToUTCDate(start_date_param);
  const end_date = safeToUTCDate(end_date_param);
  const guests = parseInt(searchParams.get('guests') ?? '1');

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
    if (currentUser && currentUser.email === 'johndoe@test.com') {
      toast.error('Cannot book with test account');
      return;
    }
    bookingFn(
      {
        homeId,
        from_date: start_date_param,
        to_date: end_date_param,
        guests,
      },
      {
        onSuccess: () => {
          const bookingListParams = new URLSearchParams();
          bookingListParams.set('sortBy', TripSortEnum.RECENT);
          navigate(
            { pathname: '/user/trips', search: bookingListParams.toString() },
            { replace: true }
          );
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  return (
    <StyledBooking>
      {(isLoadingUser || isLoading) && <Loader color="black" />}
      {isBooking && <LoaderOverlay />}
      {isLoadingUser || isLoading ? (
        <Spinner />
      ) : data ? (
        <div className="grid">
          <h1>Request to book</h1>
          <div className="trip-details">
            <h2>Your trip</h2>
            <ul>
              <li>
                <span className="heading">
                  Dates ({data.timezone_details.other})
                </span>
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
                navigate(`/home/${homeId}?${searchParams.toString()}`, {
                  replace: true,
                });
              }}
            >
              Change details
            </Button>
          </div>
          <div className="right-column">
            <div className="box">
              <div className="home-details">
                <img src={data.images[0]} alt="" />
                <div className="data">
                  <p>{data.name}</p>
                  <p>
                    {getFormattedLocation(data.city, data.state, data.country)}
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
          <div className="terms">
            <h2>Terms</h2>
            <ul>
              <li>Once the home is booked, it cannot be cancelled.</li>
              <li>
                Since this is a sample website, there is no payment involved.
              </li>
              <li>The home owner will contact you for details.</li>
              <li>
                You must follow the ground rules put forth by the home owner.
              </li>
            </ul>
          </div>
          <div className="confirm-booking">
            <p>
              By clicking the following button, you agree to our{' '}
              <Link to="/privacy" target="_blank">
                privacy
              </Link>{' '}
              and{' '}
              <Link to="/terms" target="_blank">
                terms
              </Link>
              .
            </p>
            <Button onClick={onBookingRequest}>Confirm Booking</Button>
            <p>Clicking the above button will immediately book the home.</p>
          </div>
        </div>
      ) : (
        <ErrorPage error={error} />
      )}
      <div className="grid"></div>
    </StyledBooking>
  );
};

export default Booking;
