import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLayoutEffect, useMemo } from 'react';
import styled from 'styled-components';
import { differenceInDays, format } from 'date-fns';

import CustomDatePicker from '../../components/CustomDatePicker';
import InputCounter from '../../components/inputs/InputCounter';
import {
  CHECK_IN,
  CHECK_OUT,
  DATE_FORMAT_NUM,
  GUESTS,
  MAX_DATE_RANGE,
} from '../../data/constants';
import { moneyFormatter } from '../../utils/money-formatter';
import Button from '../../components/buttons/Button';
import { getMaxCheckOutDate } from '../../utils/dates/max-checkout-date';
import { screenWidths } from '../../providers/ScreenProvider';
import { DataProps } from './types/DataProps';
import { isValidInitialParams } from '../../utils/isValidInitialParams';
import { safeToUTCDate } from '../../utils/dates/toUTCDate';

const StyledDetails = styled.div`
  .sticky-box {
    /* width: 100%; */
    /* padding: 2rem 2rem; */
    padding: 20px 30px;
    width: 18rem;
    position: sticky;
    top: calc(var(--top-navbar-height) + 10px);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    border-radius: 1rem;
    background-color: white;
  }

  .night-price {
    span {
      font-size: 1.7rem;
    }
  }

  .custom-date-picker {
    margin: auto;
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
    justify-content: start;
  }

  .booking-button {
    width: 100%;
  }

  .unavailable {
    color: red;
  }

  @media (max-width: ${screenWidths.phone}px) {
    max-width: 95svw;

    .custom-date-picker {
      width: auto;
      margin: auto;
    }
  }
`;

const Details: React.FC<DataProps> = ({ data }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useLayoutEffect(() => {
    const searchParamsOnInitialLoad = new URLSearchParams(
      document.location.search
    );
    if (!isValidInitialParams(searchParamsOnInitialLoad, data)) {
      setSearchParams(new URLSearchParams(), { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const start_date_param = searchParams.get(CHECK_IN);
  const end_date_param = searchParams.get(CHECK_OUT);

  const start_date = safeToUTCDate(start_date_param);
  const end_date = safeToUTCDate(end_date_param);
  const guests = parseInt(searchParams.get('guests') ?? '1');

  const maxCheckOutDate = useMemo(
    () =>
      !data || !start_date
        ? undefined
        : getMaxCheckOutDate(start_date, MAX_DATE_RANGE, data.bookings),
    [start_date, data]
  );

  const price =
    start_date && end_date && data
      ? (differenceInDays(end_date, start_date) *
          (data.price * 100 +
            (guests > 2 ? data.price_per_guest * 100 * (guests - 2) : 0))) /
        100
      : 0;

  return (
    <StyledDetails>
      <div className="sticky-box">
        <p className="night-price">
          <span>{moneyFormatter(data.price)}</span> night
        </p>
        {data.unavailable ? (
          <h2 className="unavailable">Unavailable!</h2>
        ) : (
          <>
            <div className="date-selector">
              <CustomDatePicker
                pickerPosition="left"
                initialDateRange={{
                  from: start_date,
                  to: end_date,
                }}
                minStartDate={data.minDate}
                maxStartDate={data.maxDate}
                maxEndDate={maxCheckOutDate}
                disabledDates={data.invalidCheckinDates}
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
                  setSearchParams(searchParams, { replace: true });
                }}
              />
            </div>
            {data.timezone_details.diff !== 0 && (
              <p>
                Your timezone ({data.timezone_details.local}) is{' '}
                {data.timezone_details.diff > 0 ? 'ahead' : 'behind'} of the
                home's timezone ({data.timezone_details.other}) by{' '}
                {data.timezone_details.formatted} hours.
              </p>
            )}
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
                <p className="total-price">
                  Total before taxes: {moneyFormatter(price)}
                </p>
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
                      const bookingURL = `/book/${
                        data.id
                      }?${bookingParams.toString()}`;
                      navigate(bookingURL);
                    }
                  }}
                >
                  Book now
                </Button>
                <p>You won't be charged yet</p>
              </>
            )}
          </>
        )}
      </div>
    </StyledDetails>
  );
};

export default Details;
