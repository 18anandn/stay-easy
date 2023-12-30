import styled from 'styled-components';
import useGetHome from '../features/hotels/useGetHome';
import ErrorPage from './ErrorPage';
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import Loader from '../ui/loaders/Loader';
import {
  add,
  addDays,
  compareAsc,
  differenceInDays,
  endOfMonth,
  format,
  isMatch,
  startOfDay,
} from 'date-fns';
import {
  CHECK_IN,
  CHECK_OUT,
  DATE_FORMAT_NUM,
  DATE_FORMAT_TEXT,
} from '../commonDataTypes';
import Button from '../ui/Button';
import { moneyFormatter } from '../utils/money-formatter';
import { useCreateBooking } from '../features/booking/useCreateBooking';
import { MouseEventHandler } from 'react';
import toast from 'react-hot-toast';
import LoaderOverlay from '../ui/loaders/LoaderOverlay';

const StyledBooking = styled.div`
  padding: 3rem 9rem;

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

const today_date = new Date(
  startOfDay(new Date()).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
);

const next_day_date = addDays(today_date, 1);

const next_year_month_end_date = endOfMonth(
  add(today_date, { years: 1, months: 1 }),
);

const Booking: React.FC = () => {
  const { homeId } = useParams();
  const { isLoading, data, error } = useGetHome(homeId ?? '');
  const { bookingFn, isBooking } = useCreateBooking();
  const navigate = useNavigate();
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
    start_date &&
    (compareAsc(start_date, next_day_date) < 0 ||
      compareAsc(start_date, next_year_month_end_date) > 0)
  ) {
    start_date = undefined;
  }

  let end_date =
    start_date && end_date_param && isMatch(end_date_param, DATE_FORMAT_NUM)
      ? startOfDay(new Date(end_date_param))
      : undefined;
  if (
    end_date &&
    start_date &&
    (compareAsc(end_date, start_date) <= 0 ||
      compareAsc(end_date, addDays(start_date, 13)) > 0)
  ) {
    end_date = undefined;
  }

  if (!homeId || error) {
    return <ErrorPage />;
  }

  if (!start_date_param || !end_date_param || !start_date || !end_date) {
    navigate(`/home/${homeId}`);
    return;
  }

  const price_per_night = data
    ? (parseFloat(data.price) * 100 +
        (guests > 2
          ? parseFloat(data.price_per_guest) * 100 * (guests - 2)
          : 0)) /
      100
    : 0;

  const nights = differenceInDays(end_date, start_date);

  const total_price = nights * price_per_night;

  const onBookingRequest: MouseEventHandler = () => {
    bookingFn(
      {
        hotelId: homeId,
        from_date: start_date_param,
        to_date: end_date_param,
        guests,
      },
      {
        onSuccess: () => {
          navigate('/user/trips');
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <StyledBooking>
      {isLoading && <Loader color="black" />}
      {isBooking && <LoaderOverlay />}
      <div style={{ height: isLoading ? '0' : 'auto' }} className="grid">
        {!isLoading && data && (
          <>
            <div className="left-column">
              <h1>Request to book</h1>
              <div className="trip-details">
                <h2>Your trip</h2>
                <ul>
                  <li>
                    <span className="heading">Dates</span>
                    <span>
                      {format(start_date, DATE_FORMAT_TEXT)} -{' '}
                      {format(end_date, DATE_FORMAT_TEXT)}
                    </span>
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
                  <img src={data.main_image} alt="" />
                  <div className="data">
                    <p>{data.name}</p>
                    <p>
                      {data.city}, {data.state}
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
