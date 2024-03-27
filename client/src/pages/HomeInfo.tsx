import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { useEffect, useMemo } from 'react';
import {
  addDays,
  compareAsc,
  differenceInDays,
  format,
  isMatch,
  startOfDay,
} from 'date-fns';

import useGetHome from '../features/homes/hooks/useGetHome';
import Loader from '../components/loaders/Loader';
import Button from '../components/buttons/Button';
import InputCounter from '../components/inputs/InputCounter';
import { moneyFormatter } from '../utils/money-formatter';
import { getMaxCheckOutDate } from '../utils/dates/max-checkout-date';
import { getFormattedLocation } from '../utils/location/format-location';
import CustomDatePicker from '../components/CustomDatePicker';
import ErrorPage from './ErrorPage';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import {
  CHECK_IN,
  CHECK_OUT,
  DATE_FORMAT_NUM,
  GUESTS,
  MAX_DATE_RANGE,
} from '../data/constants';

const StyledHomeInfo = styled.div`
  padding: 3rem 8%;

  .custom-loader {
    font-size: 0.1rem;
  }

  .image-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    grid-template-rows: repeat(2, 200px);
    gap: 1rem;
    margin-bottom: 2rem;

    li {
      border-radius: 20px;
      overflow: hidden;
    }

    li:first-of-type {
      grid-row: 1/-1;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      background-color: lightgray;
    }
  }

  h2 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1rem;
  }

  .box {
    display: grid;
    grid-template-columns: 2fr 24rem;
    gap: 4rem;
  }

  .left-column {
    .location {
      font-size: 1.3rem;
      margin-bottom: 1rem;

      h3 {
        margin-bottom: 1rem;
      }

      .map-container {
        height: 500px;
        
        #map {
          position: relative;
          height: 100%;
          width: 100%;
          z-index: 0;
        }
      }
    }

    .amenities {
      margin-bottom: 1rem;

      li {
        font-size: 1.1rem;
      }
    }

    .description {
      font-size: 1rem;
      margin-bottom: 2rem;
      text-align: justify;
    }
  }

  .right-column {
    .sticky-box {
      box-sizing: border-box;
      width: 100%;
      padding: 2rem 2rem;
      position: sticky;
      top: 3rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
      border-radius: 1rem;
    }

    .night-price {
      span {
        font-size: 1.7rem;
      }
    }

    .date-selector {
      /* width: 100%; */
      & > * {
        margin: auto;
      }
    }

    .guests {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .total-price {
      display: flex;
      gap: 1rem;
      align-items: center;
      /* white-space: nowrap; */

      label {
        white-space: nowrap;
      }

      input {
        border: none;
        outline: none;
        background-color: transparent;
        font-size: 1rem;
      }
    }

    .booking-button {
      width: 100%;
    }
  }

  .amenities {
    list-style-position: inside;
  }
`;

// const today_date = new Date(
//   startOfDay(new Date()).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
// );

// const next_day_date = addDays(today_date, 1);

// const next_year_month_end_date = endOfMonth(
//   add(today_date, { years: 1, months: 1 }),
// );

const HomeInfo: React.FC = () => {
  // const { currentUser } = useCurrentUser();
  const navigate = useNavigate();
  const { homeId } = useParams();
  const { isLoading, data, error } = useGetHome(homeId);
  const images: string[] = data ? data.images.slice(0, 5) : [];
  const [searchParams, setSearchParams] = useSearchParams();
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
    const curr_start_date =
      start_date_param && isMatch(start_date_param, DATE_FORMAT_NUM)
        ? startOfDay(new Date(start_date_param))
        : undefined;
    if (!data || !curr_start_date) return undefined;
    return getMaxCheckOutDate(curr_start_date, MAX_DATE_RANGE, data.bookings);
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
        searchParams.delete(CHECK_IN);
        searchParams.delete(CHECK_OUT);
        searchParams.delete(GUESTS);
        setSearchParams(searchParams, { replace: true });
      }
    }

    checker();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (error) {
    return <ErrorPage error={error} />;
  }

  const price =
    start_date && end_date && data
      ? (differenceInDays(end_date, start_date) *
          (data.price * 100 +
            (guests > 2 ? data.price_per_guest * 100 * (guests - 2) : 0))) /
        100
      : 0;

  return (
    <StyledHomeInfo>
      {isLoading && <Loader color="black" />}
      <div style={{ height: isLoading ? '0' : 'auto' }}>
        {!isLoading && data && (
          <>
            <ul className="image-grid">
              {images.map((url) => (
                <li key={url}>
                  <img src={url} alt="" />
                </li>
              ))}
            </ul>
            <div className="box">
              <div className="left-column">
                <h2>{data.name}</h2>
                <p className="location">
                  {getFormattedLocation(data.city, data.state, data.country)}
                </p>
                <h3>Amenities</h3>
                <ul className="amenities">
                  {data.amenities.map((amenity) => (
                    <li key={amenity}>{amenity}</li>
                  ))}
                </ul>
                <p className="description">{data.description}</p>
                <div className="location">
                  <h3>Location</h3>
                  <div className="map-container">
                    <MapContainer id="map" center={data.location} zoom={13}>
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                      />
                      <Marker position={data.location} />
                    </MapContainer>
                  </div>
                </div>
              </div>
              <div className="right-column">
                <div className="sticky-box">
                  <p className="night-price">
                    <span>{moneyFormatter(data.price)}</span> night
                  </p>
                  {data.timezone_details.diff !== 0 && (
                    <p>
                      Your timezone ({data.timezone_details.local}) is{' '}
                      {data.timezone_details.diff > 0 ? 'ahead' : 'behind'} of
                      the home's timezone ({data.timezone_details.other}) by{' '}
                      {data.timezone_details.formatted} hours.
                    </p>
                  )}
                  <div className="date-selector">
                    <CustomDatePicker
                      initialDateRange={{
                        from: start_date,
                        to: end_date,
                      }}
                      minStartDate={data.minDate}
                      maxStartDate={data.maxDate}
                      maxEndDate={maxCheckOutDate}
                      disabledDates={data.invalidCheckInDates}
                      onDateRangeChange={(dateRange) => {
                        if (!dateRange || !dateRange.from) {
                          searchParams.delete(CHECK_IN);
                          searchParams.delete(CHECK_OUT);
                        } else {
                          if (dateRange.from) {
                            searchParams.set(
                              CHECK_IN,
                              format(dateRange.from, DATE_FORMAT_NUM)
                            );
                          }
                          if (dateRange.to) {
                            searchParams.set(
                              CHECK_OUT,
                              format(dateRange.to, DATE_FORMAT_NUM)
                            );
                          } else {
                            searchParams.delete(CHECK_OUT);
                          }
                        }
                        setSearchParams(searchParams);
                      }}
                    />
                  </div>
                  {start_date && end_date && (
                    <>
                      <div className="guests">
                        <label htmlFor="guests">Guests</label>
                        <InputCounter
                          name="guests"
                          min={1}
                          max={data.cabin_capacity}
                          value={guests}
                          onValChange={(val) => {
                            searchParams.set(GUESTS, val.toString());
                            setSearchParams(searchParams, { replace: true });
                          }}
                        />
                      </div>
                      <div className="total-price">
                        <label htmlFor="total">
                          Total price (excluding taxes):
                        </label>
                        <input readOnly value={moneyFormatter(price)} />
                      </div>
                      <Button
                        className="booking-button"
                        onClick={() => {
                          const bookingParams = new URLSearchParams();
                          if (start_date && end_date) {
                            bookingParams.set(
                              CHECK_IN,
                              format(start_date, DATE_FORMAT_NUM)
                            );
                            bookingParams.set(
                              CHECK_OUT,
                              format(end_date, DATE_FORMAT_NUM)
                            );
                            bookingParams.set(GUESTS, guests.toString());
                            const bookingURL = `/book/${homeId}?${bookingParams.toString()}`;
                            navigate(bookingURL);
                          }
                        }}
                      >
                        Book now
                      </Button>
                      <p>You won't be charged yet</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </StyledHomeInfo>
  );
};

export default HomeInfo;
