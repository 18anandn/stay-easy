import styled from 'styled-components';
import { useParams, useSearchParams } from 'react-router-dom';
import Select from 'react-select';

import { useGetMonthData } from '../../../features/owner/hooks/useGetMonthData';
import Spinner from '../../../components/loaders/Spinner';
import { years } from '../../../data/years';
import ErrorPage from '../../ErrorPage';
import { useHomeName } from '../../../features/owner/providers/HomeProvider';
import { moneyFormatter } from '../../../utils/money-formatter';
import { useTitle } from '../../../hooks/useTitle';
import LazyCharts from './LazyCharts';

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

  useTitle(homeName ? `Analytics | ${homeName}` : 'Analytics');

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
      ) : isError || !data ? (
        <ErrorPage error={error} />
      ) : (
        <div className="overall">
          <h2>Overall</h2>
          <ul>
            <li>Bookings: {data.number_of_bookings}</li>
            <li>
              Revenue: {moneyFormatter(data.by_booking_stats.revenue.total)}
            </li>
            <li>Days occupied: {data.by_booking_stats.occupancy.total} days</li>
            <li>Guests visited: {data.by_booking_stats.guests.total}</li>
          </ul>
        </div>
      )}
      <LazyCharts data={data} isLoading={isLoading} />
    </StyledOwnerAnalytics>
  );
};

export default OwnerAnalytics;
