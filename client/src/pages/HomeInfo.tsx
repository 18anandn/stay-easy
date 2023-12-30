import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { useRef, useState } from 'react';
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
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import useGetHome from '../features/hotels/useGetHome';
import Loader from '../ui/loaders/Loader';
import Button from '../ui/Button';
import ErrorPage from './ErrorPage';
import InputCounter from '../ui/inputs/InputCounter';
import {
  CHECK_IN,
  CHECK_OUT,
  DATE_FORMAT_NUM,
  DATE_FORMAT_TEXT,
  GUESTS,
} from '../commonDataTypes';
import { moneyFormatter } from '../utils/money-formatter';
import { useCurrentUser } from '../features/users/useCurrentUser';

const StyledHomeInfo = styled.div`
  padding: 2.5em 6em;

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

  p {
    font-size: 1rem;
  }

  .box {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1rem;
  }

  .right-column {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .date-selector {
    display: flex;
    gap: 2rem;

    .check-in,
    .check-out {
      width: min-content;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      label {
        font-size: 1rem;
      }
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
    white-space: nowrap;

    input {
      border: none;
      outline: none;
      background-color: transparent;
      font-size: 1rem;
    }
  }

  .amenities {
    list-style-position: inside;
  }
`;

const today_date = new Date(
  startOfDay(new Date()).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
);

const next_day_date = addDays(today_date, 1);

const next_year_month_end_date = endOfMonth(
  add(today_date, { years: 1, months: 1 }),
);

const HomeInfo: React.FC = () => {
  const { currentUser } = useCurrentUser();
  const { homeId } = useParams();
  const { isLoading: isLoading1, data, error } = useGetHome(homeId ?? '');
  const navigate = useNavigate();
  const [isLoading2, setIsLoading2] = useState<boolean>(true);
  const isLoading = isLoading1 && isLoading2;
  const imageCounter = useRef<number>(0);
  const images: string[] = data
    ? [data.main_image].concat(data.extra_images.slice(0, 4))
    : [];
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

  function afterImageLoaded() {
    imageCounter.current += 1;
    if (imageCounter.current === images.length) {
      setIsLoading2(false);
    }
  }

  if (error) {
    if (error.statusCode === 404) {
      return <ErrorPage />;
    }
  }

  const price =
    start_date && end_date && data
      ? (differenceInDays(end_date, start_date) *
          (parseFloat(data.price) * 100 +
            (guests > 2
              ? parseFloat(data.price_per_guest) * 100 * (guests - 2)
              : 0))) /
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
                  <img src={url} alt="" onLoad={afterImageLoaded} />
                </li>
              ))}
            </ul>
            <div className="box">
              <div className="left-column">
                <h2>{data.name}</h2>
                <p>
                  {data.city}, {data.state}
                </p>
                <h3>Amenities</h3>
                <ul className="amenities">
                  {data.amenities.map((amenity) => (
                    <li key={amenity}>{amenity}</li>
                  ))}
                </ul>
              </div>
              <div className="right-column">
                <div className="date-selector">
                  <div className="check-in">
                    <label htmlFor="check-in">CHECK-IN</label>
                    <DatePicker
                      id="check-in"
                      selected={start_date}
                      minDate={next_day_date}
                      maxDate={next_year_month_end_date}
                      dateFormat={DATE_FORMAT_TEXT}
                      showIcon
                      isClearable
                      placeholderText="Select check-in date"
                      onChange={(date) => {
                        if (date) {
                          searchParams.set(
                            CHECK_IN,
                            format(date, DATE_FORMAT_NUM),
                          );
                        } else {
                          searchParams.delete(CHECK_IN);
                        }
                        searchParams.delete(CHECK_OUT);
                        setSearchParams(searchParams);
                      }}
                    />
                  </div>
                  <div className="check-in">
                    <label htmlFor="check-out">CHECK-OUT</label>
                    <DatePicker
                      id="check-out"
                      disabled={start_date ? false : true}
                      selected={end_date}
                      startDate={start_date}
                      endDate={end_date}
                      minDate={addDays(start_date ?? new Date(), 1)}
                      maxDate={addDays(start_date ?? new Date(), 13)}
                      dateFormat={DATE_FORMAT_TEXT}
                      showIcon
                      selectsEnd
                      isClearable
                      placeholderText={
                        start_date
                          ? 'Select check-out date'
                          : 'Select check-out date first'
                      }
                      onChange={(date) => {
                        if (date) {
                          searchParams.set(
                            CHECK_OUT,
                            format(date, DATE_FORMAT_NUM),
                          );
                          setSearchParams(searchParams);
                        } else {
                          searchParams.delete(CHECK_OUT);
                          setSearchParams(searchParams);
                        }
                      }}
                    />
                  </div>
                </div>
                {start_date && end_date && (
                  <>
                    <div className="guests">
                      <label htmlFor="guests">Guests</label>
                      <InputCounter
                        min={1}
                        max={data.cabin_capacity}
                        initialValue={guests}
                        onValChange={(val) => {
                          searchParams.set(GUESTS, val.toString());
                          setSearchParams(searchParams);
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
                      onClick={() => {
                        const bookingParams = new URLSearchParams();
                        if (start_date && end_date) {
                          bookingParams.set(
                            CHECK_IN,
                            format(start_date, DATE_FORMAT_NUM),
                          );
                          bookingParams.set(
                            CHECK_OUT,
                            format(end_date, DATE_FORMAT_NUM),
                          );
                          bookingParams.set(GUESTS, guests.toString());
                          const bookingURL = `/book/${homeId}?${bookingParams.toString()}`;
                          if (currentUser) {
                            navigate(bookingURL);
                          } else {
                            const redirectURLParam = new URLSearchParams();
                            redirectURLParam.set('redirectTo', bookingURL);
                            navigate(`/login?${redirectURLParam.toString()}`);
                          }
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
          </>
        )}
      </div>
    </StyledHomeInfo>
  );
};

export default HomeInfo;
