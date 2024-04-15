import styled from 'styled-components';
import Select from 'react-select';
import { Link, useSearchParams } from 'react-router-dom';
import { Fragment, useEffect } from 'react';

import { useGetTripsList } from '../features/booking/hooks/useGetTripsList';
import Loader from '../components/loaders/Loader';
import { dateRangeFormatter } from '../utils/dates/date-range-formatter';
import Spinner from '../components/loaders/Spinner';
import Button from '../components/buttons/Button';
import { getFormattedLocation } from '../utils/location/format-location';
import { toUTCDate } from '../utils/dates/toUTCDate';
import { tripsSortOptionList } from '../features/booking/data/tripSortOptionList';
import { useTitle } from '../hooks/useTitle';
import toast from 'react-hot-toast';

const StyledTrips = styled.div`
  padding: 30px 5%;
  display: flex;
  flex-direction: column;
  gap: 20px;

  h1 {
    font-size: 2.2rem;
  }

  .trips {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;

    .custom-loader {
      font-size: 0.1rem;
    }

    .custom-spinner {
      height: min-content;
      width: 7rem;
      font-size: 0.04rem;
    }

    .sortBy {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      font-size: 1rem;

      .react-select {
        display: inline-block;
        width: 12rem;
      }
    }

    ul {
      list-style-type: none;
      display: flex;
      flex-direction: column;
      gap: 25px;

      li {
        a {
          display: flex;
          gap: 20px;
          text-decoration: none;
          color: black;
        }

        img {
          height: 90px;
          aspect-ratio: 8 / 6;
          border-radius: 0.7rem;
          object-fit: cover;
        }

        .info {
          align-self: stretch;
          display: flex;
          flex-direction: column;

          .dates {
            margin-top: auto;
          }
        }
      }
    }

    .no-trips {
      font-size: 1.2rem;
      a {
        color: black;
      }
    }
  }
`;

const TripsList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy =
    tripsSortOptionList.find(
      (option) => option.value === searchParams.get('sortBy')
    ) ?? tripsSortOptionList[0];
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useGetTripsList(sortBy);

  useTitle('Your Trips');

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  return (
    <StyledTrips>
      <h1>Your Trips</h1>
      <div className="trips">
        {isLoading ? (
          <Loader color="black" />
        ) : (
          <>
            {data && data.pages[0].count !== 0 ? (
              <>
                <div className="sortBy">
                  <p>Sort by:</p>
                  <Select
                    className="react-select"
                    value={sortBy}
                    options={tripsSortOptionList}
                    isSearchable={false}
                    onChange={(option) => {
                      if (option) {
                        if (option.value === sortBy.value) return;
                        searchParams.set('sortBy', option.value);
                      } else {
                        searchParams.delete('sortBy');
                      }
                      setSearchParams(searchParams, { replace: true });
                    }}
                  />
                </div>
                <ul>
                  {data.pages.map((page, pageNum) => (
                    <Fragment key={pageNum}>
                      {page?.trips.map((trip) => (
                        <li key={trip.id}>
                          <Link to={`/user/trip/${trip.id}`}>
                            <img src={trip.home.main_image} alt="" />
                            <div className="info">
                              <p>{trip.home.name}</p>
                              <p>
                                {getFormattedLocation(
                                  trip.home.city,
                                  trip.home.state,
                                  trip.home.country
                                )}
                              </p>
                              <p className="dates">
                                {dateRangeFormatter(
                                  toUTCDate(trip.from_date),
                                  toUTCDate(trip.to_date)
                                )}
                              </p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </Fragment>
                  ))}
                </ul>
                {isFetchingNextPage && <Spinner />}
                {!isFetchingNextPage && hasNextPage && (
                  <Button onClick={() => fetchNextPage()}>See more</Button>
                )}
              </>
            ) : (
              <div className="no-trips">
                <p>
                  You have no past trips. <Link to="/search">Explore now!</Link>
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </StyledTrips>
  );
};

export default TripsList;
