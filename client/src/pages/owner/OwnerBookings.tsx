import styled from 'styled-components';
import Select from 'react-select';
import { useParams, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import ResponsivePagination from 'react-responsive-pagination';

import { useGetBookingList } from '../../features/owner/hooks/useGetBookingList';
import { bookingFilterOptionList } from '../../features/owner/data/booking-filter-opton-list';
import { bookingSortOptionList } from '../../features/owner/data/booking-sort-opton-list';
import { BookingSortOption } from '../../features/owner/types/BookingSortOption';
import { BookingFilterEnum } from '../../features/owner/enums/BookingFilter';
import Spinner from '../../components/loaders/Spinner';
import ErrorPage from '../ErrorPage';
import { DATE_FORMAT_TEXT } from '../../data/constants';
import { useHomeName } from '../../features/owner/providers/HomeProvider';
import { screenWidths } from '../../providers/ScreenProvider';
import { useTitle } from '../../hooks/useTitle';

const StyledOwnerBookings = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  grid-auto-flow: row;
  gap: 2rem;

  .custom-spinner {
    position: absolute;
  }

  .option-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;

    .option {
      width: max-content;
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      gap: 1rem;

      /* p {
        white-space: nowrap;
      } */

      .select-box__menu {
        min-width: 100%;
        width: max-content;
      }

      &.filter {
        .select-box {
          /* width: 13.2rem; */
          /* width: 100%; */
          /* width: max-content; */
        }
      }

      &.sort {
        .select-box {
          /* width: 11rem; */
        }
      }
    }
  }

  .pagination-container {
    margin-top: auto;
  }

  .table {
    /* width: 100%;
    overflow-x: scroll; */
    /* max-width: 100%; */
    /* padding-block: 1rem; */
    overflow-x: auto;
    /* display: grid;
    grid-template-columns: 100%; */

    table {
      margin: 0 auto;
      /* width: 50%; */
      /* table-layout: fixed; */
      /* width: 100%; */
      border-collapse: collapse;
      /* overflow: hidden; */

      /* th:nth-child() */

      th,
      td {
        padding: 1rem 1.5rem;
        border: 1px solid black;
      }

      tr:nth-child(even) {
        background-color: #fffeff;
      }

      tr:nth-child(odd) {
        background-color: #f5f4f5;
      }

      tr:nth-child(1) {
        color: white;
        background-color: #343334;
      }

      td:nth-child(1) {
        text-align: right;
      }

      td:nth-child(2) {
        max-width: 9rem;
        overflow-wrap: break-word;
      }

      td:nth-child(3),
      td:nth-child(4),
      td:nth-child(5) {
        text-align: right;
        font-family: 'Courier New', monospace;
      }

      td:nth-child(5) {
        text-align: center;
      }
    }
  }

  @media (max-width: ${screenWidths.tab}px) {
    .table {
      table {
        th,
        td {
          padding: 0.8rem;
        }
      }
    }
  }

  @media (max-width: ${screenWidths.phone}px) {
    gap: 1rem;

    .table {
      table,
      tbody,
      tr,
      th,
      td {
        display: block;
      }

      table {
        th {
          display: none;
        }

        tr:first-child {
          display: none;
        }

        td {
          overflow-wrap: break-word;
          padding: 0;
          padding-block: 0.2rem;
          display: grid;
          grid-template-columns: 13ch minmax(0, 1fr);
          font-family: 'Open Sans', sans-serif;
          border: none;

          & > *:last-child {
            overflow: hidden;
          }
        }

        td::before {
          display: inline;
          content: attr(data-cell) ': ';
          text-transform: capitalize;
        }

        td:nth-child(1) {
          display: none;
        }

        td:nth-child(2) {
          max-width: unset;
        }

        td:nth-child(3),
        td:nth-child(4),
        td:nth-child(5) {
          font-family: 'Open Sans', sans-serif;
          text-align: left;
        }
      }
    }
  }
`;

const defaultFilterOption = bookingFilterOptionList[0];
const defaultSortOption = bookingSortOptionList[0];

const OwnerBookings: React.FC = () => {
  const { ownerHomeId } = useParams();
  const homeName = useHomeName();
  const [searchParams, setSearchParams] = useSearchParams();
  const filter_param = searchParams.get('filter')?.toLowerCase();
  let selectedFilter = defaultFilterOption;
  const sort_param = searchParams.get('sortBy')?.toLowerCase();
  const order_param = searchParams.get('order')?.toUpperCase();
  let selectedSort: BookingSortOption | null = defaultSortOption;
  if (filter_param) {
    const filter = bookingFilterOptionList.find(
      (val) => val.value === filter_param
    );
    selectedFilter = filter ?? selectedFilter;
  }
  if (
    selectedFilter.value === BookingFilterEnum.CHECK_IN_TODAY ||
    selectedFilter.value === BookingFilterEnum.CHECK_OUT_TODAY
  ) {
    selectedSort = null;
  } else if (sort_param) {
    const order =
      order_param === 'ASC' || order_param === 'DESC' ? order_param : 'ASC';
    const sortBy = bookingSortOptionList.find(
      (val) => val.value.sortBy === sort_param && val.value.order === order
    );
    selectedSort = sortBy ?? selectedSort;
  }
  const page_param = parseInt(searchParams.get('page') ?? '1');
  const page = isNaN(page_param) ? 1 : page_param;
  const { data, isLoading, isError, error } = useGetBookingList(
    ownerHomeId,
    selectedFilter,
    selectedSort,
    page
  );

  useTitle(homeName ? `Bookings | ${homeName}` : 'Bookings');

  return (
    <StyledOwnerBookings>
      {homeName && (
        <div className="option-list">
          <div className="option filter">
            <p>Filter: </p>{' '}
            <Select
              className="select-box"
              classNamePrefix="select-box"
              options={bookingFilterOptionList}
              isDisabled={isLoading}
              isSearchable={false}
              value={selectedFilter}
              onChange={(val) => {
                if (!val || !val.value) {
                  searchParams.delete('filter');
                  searchParams.delete('sortBy');
                  searchParams.delete('order');
                  setSearchParams(searchParams);
                  return;
                }
                if (
                  val.value === BookingFilterEnum.CHECK_IN_TODAY ||
                  val.value === BookingFilterEnum.CHECK_OUT_TODAY
                ) {
                  searchParams.delete('sortBy');
                  searchParams.delete('order');
                }
                searchParams.set('filter', val.value);
                setSearchParams(searchParams);
              }}
            />
          </div>
          {selectedFilter.value !== BookingFilterEnum.CHECK_IN_TODAY &&
            selectedFilter.value !== BookingFilterEnum.CHECK_OUT_TODAY && (
              <div className="option sort">
                <p>Sort by: </p>{' '}
                <Select
                  className="select-box"
                  options={bookingSortOptionList}
                  isDisabled={isLoading}
                  isSearchable={false}
                  value={selectedSort}
                  onChange={(val) => {
                    if (!val || !val.value) {
                      searchParams.delete('sortBy');
                      searchParams.delete('order');
                      setSearchParams(searchParams);
                      return;
                    }
                    searchParams.set('sortBy', val.value.sortBy);
                    searchParams.set('order', val.value.order);
                    setSearchParams(searchParams);
                  }}
                />
              </div>
            )}
        </div>
      )}
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <ErrorPage error={error} />
      ) : (
        data &&
        (data.bookingList.length > 0 ? (
          <>
            <div className="table">
              <table>
                <tbody>
                  <tr>
                    <th>No.</th>
                    <th>Guest name</th>
                    <th>Check-in date</th>
                    <th>Check-out date</th>
                    <th>Booking ID</th>
                  </tr>
                  {data.bookingList.map((booking, index) => (
                    <tr key={booking.id}>
                      <td>
                        <span>{index + 1}.</span>
                      </td>
                      <td data-cell="guest name">{booking.user}</td>
                      <td data-cell="check-in">
                        {format(booking.from_date, DATE_FORMAT_TEXT)}
                      </td>
                      <td data-cell="check-out">
                        {format(booking.to_date, DATE_FORMAT_TEXT)}
                      </td>
                      <td data-cell="booking iD">{booking.id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data.totalPages > 1 && (
              <div className="pagination-container">
                <ResponsivePagination
                  total={data.totalPages}
                  current={page}
                  onPageChange={(page) => {
                    searchParams.set('page', page.toString());
                    setSearchParams(searchParams);
                  }}
                />
              </div>
            )}
          </>
        ) : (
          <p>
            There are no bookings to show.
            {selectedFilter.value !== BookingFilterEnum.ALL &&
              ' Try changing the filters.'}
          </p>
        ))
      )}
    </StyledOwnerBookings>
  );
};

export default OwnerBookings;
