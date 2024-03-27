import styled from 'styled-components';
import { useParams, useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import Select from 'react-select';

import { useGetMonthData } from '../../features/owner/hooks/useGetMonthData';
import { DATE_FORMAT_MONTH_SHORT } from '../../data/constants';
import Spinner from '../../components/loaders/Spinner';
import { amountFormat } from '../../utils/amountFormatter';
import CustomLineChart from '../../components/charts/CustomLineChart';
import CustomBarChart from '../../components/charts/CustomBarChart';
import { years } from '../../data/years';
import ErrorPage from '../ErrorPage';
import { useHomeName } from '../../features/owner/providers/HomeProvider';
import { moneyFormatter } from '../../utils/money-formatter';

const tickFormatter = {
  occupancy: (val: number) => {
    if (val === 0) return '0';
    return `${val}d`;
  },
  revenue: (val: number) => {
    if (val === 0) return '0';
    return amountFormat(val);
  },
};

const year_options = years.arr.map((year) => ({ label: year, value: year }));
const current_year_option =
  year_options.find((year) => year.value === years.current_year) ??
  year_options[0];

const StyledOwnerAnalytics = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;

  .custom-spinner {
    position: absolute;
  }

  .year-options {
    display: flex;
    align-items: center;
    gap: 1rem;

    .select-year {
      font-size: 1rem;
      width: 6rem;
    }
  }

  .chart-list {
    margin-top: 1rem;
  }

  .by-month {
    .line-charts {
      display: flex;
      flex-direction: column;
      gap: 2rem;

      .chart {
        h3 {
          margin-bottom: 1rem;
        }
      }
    }
  }

  .by-booking {
    .bar-charts {
      list-style-type: none;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 3%;

      h3 {
        text-align: center;
      }
    }
  }
`;

const OwnerAnalytics: React.FC = () => {
  const homeName = useHomeName();
  const { ownerHomeId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const year_param = searchParams.get('year');
  const selectedYear = year_param
    ? year_options.find((option) => option.value === year_param) ??
      current_year_option
    : current_year_option;
  const { data, isLoading, isError, error } = useGetMonthData(
    ownerHomeId,
    selectedYear.value
  );

  const revenue = useMemo(() => {
    if (!data) return undefined;
    return {
      by_month: {
        months: data.month_data.map((val) => ({
          month: format(parseISO(val.month), DATE_FORMAT_MONTH_SHORT),
          property: val.revenue,
        })),
        stats: data.by_month_stats.revenue,
      },
      by_booking: data.by_booking_stats.revenue,
    };
  }, [data]);

  const occupancy = useMemo(() => {
    if (!data) return undefined;
    return {
      by_month: {
        months: data.month_data.map((val) => ({
          month: format(parseISO(val.month), DATE_FORMAT_MONTH_SHORT),
          property: val.occupancy,
        })),
        stats: data.by_month_stats.occupancy,
      },
      by_booking: data.by_booking_stats.occupancy,
    };
  }, [data]);

  const guests = useMemo(() => {
    if (!data) return undefined;
    return {
      by_month: {
        months: data.month_data.map((val) => ({
          month: format(parseISO(val.month), DATE_FORMAT_MONTH_SHORT),
          property: val.guests,
        })),
        stats: data.by_month_stats.guests,
      },
      by_booking: data.by_booking_stats.guests,
    };
  }, [data]);

  return (
    <StyledOwnerAnalytics>
      {homeName && (
        <div className="year-options">
          <p>Year:</p>
          <div className="select-year">
            <Select
              options={year_options}
              isDisabled={isLoading}
              isSearchable={false}
              value={selectedYear}
              onChange={(val) => {
                searchParams.set(
                  'year',
                  val?.value ?? current_year_option.value
                );
                setSearchParams(searchParams);
              }}
            />
          </div>
        </div>
      )}
      {isLoading ? (
        <Spinner />
      ) : isError || !(data && revenue && occupancy && guests) ? (
        <ErrorPage error={error} />
      ) : (
        <>
          <div className="overall">
            <h2>Overall</h2>
            <ul>
              <li>Bookings: {data.number_of_bookings}</li>
              <li>
                Revenue: {moneyFormatter(data.by_booking_stats.revenue.total)}
              </li>
              <li>
                Days occupied: {data.by_booking_stats.occupancy.total} days
              </li>
              <li>Guests visited: {data.by_booking_stats.guests.total}</li>
            </ul>
          </div>
          <div className="by-month">
            <h2>Statistics by month</h2>
            {data.number_of_cabins > 1 && (
              <p>The following data is summing up all the cabins.</p>
            )}
            <ul className="chart-list line-charts">
              <li className="chart revenue">
                <h3>Revenue</h3>
                <CustomLineChart
                  data={revenue.by_month}
                  y_axis_label="Revenue (&#8377;)"
                  tool_tip_label="Revenue (&#8377;)"
                  tickFormatter={tickFormatter.revenue}
                />
              </li>
              <li className="chart occupancy">
                <h3>Occupancy</h3>
                <CustomLineChart
                  data={occupancy.by_month}
                  y_axis_label="Days Occupied"
                  tool_tip_label="Occupied days"
                  tickFormatter={tickFormatter.occupancy}
                />
              </li>
              <li className="chart guests">
                <h3>Guests</h3>
                <CustomLineChart
                  data={guests.by_month}
                  y_axis_label="Guests"
                  tool_tip_label="Guests"
                />
              </li>
            </ul>
          </div>
          <div className="by-booking">
            <h2>Statistics by booking</h2>
            <ul className="chart-list bar-charts">
              <li>
                <CustomBarChart
                  stats={revenue.by_booking}
                  tickFormatter={tickFormatter.revenue}
                  tool_tip_label="Revenue (&#8377;)"
                />
                <h3>Revenue</h3>
              </li>
              <li>
                <CustomBarChart
                  stats={occupancy.by_booking}
                  tickFormatter={tickFormatter.occupancy}
                  tool_tip_label="Occupancy"
                />
                <h3>Occupancy</h3>
              </li>
              <li>
                <CustomBarChart
                  stats={guests.by_booking}
                  tool_tip_label="Guests"
                />
                <h3>Guests</h3>
              </li>
            </ul>
          </div>
        </>
      )}
    </StyledOwnerAnalytics>
  );
};

export default OwnerAnalytics;
