import styled from 'styled-components';
import useFakeData from '../features/test/useFakeData';
import ObserverTarget from '../features/intersection-observer/ObserverTarget';
import { useObserver } from '../features/intersection-observer/useObserver';
import { Fragment, useEffect } from 'react';

const StyledExplore = styled.div`
  /* min-height: 100dvh; */
  position: relative;
  padding: 5rem;
  font-size: 1rem;

  li::marker {
    font-size: 1.1rem;
    font-weight: bold;
  }
`;


const TextBox = styled.div``;

const Explore: React.FC = () => {
  const { data, fetchNextPage, isFetching, isFetchingNextPage, status } = useFakeData();
  const { containerRef, isVisible, startObserving } = useObserver();
  useEffect(() => {
    startObserving(!isFetchingNextPage)
    if (!isFetchingNextPage && isVisible) {
      // console.log('here')
      fetchNextPage();
    }
  }, [isVisible, isFetchingNextPage, fetchNextPage, startObserving]);
  return (
    <StyledExplore>
      <ol>
        {data &&
          data.pages.map((page, index) => (
            <Fragment key={index}>
              {page.map((val) => (
                <li key={val.id}>
                  <h3>
                    {val.country}, {val.city}
                  </h3>
                  <p>{val.street_address}</p>
                  <p>{val.description}</p>
                </li>
              ))}
            </Fragment>
          ))}
      </ol>
      <ObserverTarget ref={containerRef} />
    </StyledExplore>
  );
};

export default Explore;
