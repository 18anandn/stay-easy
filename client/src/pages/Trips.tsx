import styled from 'styled-components';
import { useGetTrips } from '../features/booking/useGetTrips';
import Loader from '../ui/loaders/Loader';
import { Link } from 'react-router-dom';
import { Fragment, useEffect } from 'react';
import { dateRangeFormatter } from '../utils/date-range-formatter';
import { useQueryClient } from '@tanstack/react-query';
import Spinner from '../ui/loaders/Spinner';
import Button from '../ui/Button';

const StyledTrips = styled.div`
  padding: 2rem 8rem;
  display: flex;
  flex-direction: column;

  h1 {
    font-size: 2.2rem;
    margin-bottom: 1.1rem;
  }

  .trips {
    flex-grow: 1;

    .custom-loader {
      font-size: 0.1rem;
    }

    .custom-spinner {
      height: min-content;
      width: 7rem;
      font-size: 0.04rem;
    }

    ul {
      margin-bottom: 2rem;
      list-style-type: none;
      display: flex;
      flex-direction: column;
      gap: 2rem;

      li {
        a {
          display: flex;
          gap: 1rem;
          text-decoration: none;
          color: black;
        }

        img {
          height: 6rem;
          width: 8rem;
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

const Trips: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGetTrips();

  useEffect(() => {
    if (data) {
      const initialArr: string[] = [];
      const bookingIds = data.pages.reduce(
        (arr, curr) => arr.concat(curr.trips.map((trip) => trip.id)),
        initialArr,
      );

      if (new Set(bookingIds).size !== bookingIds.length) {
        queryClient.invalidateQueries(['trips']);
      }
    }
  }, [data, isFetchingNextPage, queryClient]);

  return (
    <StyledTrips>
      <h1>Your Trips</h1>
      <div className="trips">
        {isLoading ? (
          <Loader color="black" />
        ) : (
          <>
            {data && data.pages.length !== 0 ? (
              <>
                <ul>
                  {data.pages.map((page, pageNum) => (
                    <Fragment key={pageNum}>
                      {page.trips.map((trip) => (
                        <li key={trip.id}>
                          <Link to={`/trip/${trip.id}`}>
                            <img src={trip.hotel.main_image} alt="" />
                            <div className="info">
                              <p>{trip.hotel.name}</p>
                              <p>
                                {trip.hotel.city}, {trip.hotel.state}
                              </p>
                              <p className="dates">
                                {dateRangeFormatter(
                                  new Date(trip.from_date),
                                  new Date(trip.to_date),
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

export default Trips;
