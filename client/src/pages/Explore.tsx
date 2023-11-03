import styled from 'styled-components';
import { Fragment, useEffect } from 'react';

import ObserverTarget from '../features/intersection-observer/ObserverTarget';
import { useObserver } from '../features/intersection-observer/useObserver';
import useGetHotels from '../features/hotels/useGetHotels';
import HotelCard from '../features/hotels/HotelCard';

const StyledExplore = styled.div`
  /* min-height: 100dvh; */
  position: relative;
  padding: 5rem;
  font-size: 1rem;
  border: 1px solid red;

  ul {
    list-style-type: none;
    display: grid;
  }

  li {
    width: min-content;
    border: 1px solid blue;
  }
`;

const Explore: React.FC = () => {
  const { data, fetchNextPage, isLoading, isFetchingNextPage, hasNextPage } =
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
              {page.map((val) => (
                <li key={val.id}>
                  <HotelCard hotelInfo={val} />
                </li>
              ))}
            </Fragment>
          ))}
      </ul>
      <ObserverTarget
        ref={containerRef}
        show={
          !isLoading &&
          !isFetchingNextPage &&
          (hasNextPage === undefined || hasNextPage === true)
        }
      />
    </StyledExplore>
  );
};

export default Explore;
