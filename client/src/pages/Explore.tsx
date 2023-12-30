import styled from 'styled-components';
import { Fragment, useEffect } from 'react';

import ObserverTarget from '../features/intersection-observer/ObserverTarget';
import { useObserver } from '../features/intersection-observer/useObserver';
import useGetHotels from '../features/hotels/useGetHotels';
import HotelCard from '../features/hotels/HotelCard';
import Loader from '../ui/loaders/Loader';

const StyledExplore = styled.div`
  /* min-height: 100dvh; */
  min-height: 100%;
  box-sizing: border-box;
  position: relative;
  padding: 4rem;

  ul {
    list-style-type: none;
    display: grid;
    grid-template-columns: repeat(auto-fill, 14rem);
    justify-content: center;
    gap: 4rem 4rem;
  }

  li {
  }

  .initial-page-loader {
    height: 100%;
    font-size: 80px;
    /* border: 1px solid red; */
  }

  .next-page-loader {
    padding: 3rem 0;
    height: 100px;
    font-size: 50px;
    /* border: 1px solid red; */
  }
`;

const Explore: React.FC = () => {
  const { data, fetchNextPage, isFetching, isFetchingNextPage, hasNextPage } =
    useGetHotels();
  const { containerRef, isVisible } = useObserver();
  useEffect(() => {
    if (!isFetchingNextPage && isVisible && hasNextPage) {
      fetchNextPage();
    }
  }, [isVisible, isFetchingNextPage, fetchNextPage, hasNextPage]);
  return (
    <StyledExplore>
      <ul>
        {data &&
          data.pages.map((page, index) => (
            <Fragment key={index}>
              {page.hotels.map((val) => (
                <li key={val.id}>
                  <HotelCard hotelInfo={val} />
                </li>
              ))}
            </Fragment>
          ))}
      </ul>
      {isFetching && !isFetchingNextPage && (
        <div className="initial-page-loader">
          <Loader color="black" />
        </div>
      )}
      {isFetchingNextPage && (
        <div className="next-page-loader">
          <Loader color="black" />
        </div>
      )}
      <ObserverTarget
        ref={containerRef}
        show={
          !isFetching &&
          !isFetchingNextPage &&
          (hasNextPage === undefined || hasNextPage === true)
        }
      />
    </StyledExplore>
  );
};

export default Explore;
