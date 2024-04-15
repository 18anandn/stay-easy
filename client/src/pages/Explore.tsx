import styled from 'styled-components';
import { Fragment, useEffect } from 'react';

import ObserverTarget from '../features/intersection-observer/components/ObserverTarget';
import { useObserver } from '../features/intersection-observer/hooks/useObserver';
import useGetHomesList from '../features/homes/hooks/useGetHomeList';
import HomeCard from '../features/homes/components/HomeCard';
import Spinner from '../components/loaders/Spinner';
import { screenWidths } from '../providers/ScreenProvider';
import toast from 'react-hot-toast';
import { useTitle } from '../hooks/useTitle';

const StyledExplore = styled.div`
  box-sizing: border-box;
  position: relative;
  padding: 30px 5%;

  .custom-spinner {
    font-size: 1px;
  }

  .next-page-loader {
    padding: 3rem 0;
    height: 100px;
  }

  --breakpoint-grid_columns: 2;
  --grid-padding: 80px;
  @media (min-width: 900px) {
    --breakpoint-grid_columns: 3;
  }

  @media (min-width: 1128px) {
    --breakpoint-grid_columns: 3;
  }

  @media (min-width: 1240px) {
    --breakpoint-grid_columns: 4;
  }

  .home-list {
    list-style-type: none;
    display: grid;
    grid-template-columns: repeat(
      var(--breakpoint-grid_columns, 1),
      minmax(0, 1fr)
    );
    justify-content: center;
    gap: 40px 25px;

    li {
    }
  }
  @media (max-width: ${screenWidths.tab}px) {
    --breakpoint-grid_columns: 3;
  }

  @media (max-width: ${screenWidths.phone}px) {
    padding-inline: 8%;
    --breakpoint-grid_columns: 1;
  }
`;

const Explore: React.FC = () => {
  const {
    data,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    error,
  } = useGetHomesList();
  const { containerRef, isVisible } = useObserver();

  useTitle('StayEasy | Explore');

  useEffect(() => {
    if (!isFetching && !isFetchingNextPage && isVisible && hasNextPage) {
      fetchNextPage();
    }
  }, [isVisible, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);
  
  return (
    <StyledExplore>
      {data && (
        <ul className="home-list">
          {data.pages.map((page, index) => (
            <Fragment key={index}>
              {page.homes.map((val) => (
                <li key={val.id}>
                  <HomeCard homeInfo={val} />
                </li>
              ))}
            </Fragment>
          ))}
        </ul>
      )}
      {isFetching && !isFetchingNextPage && <Spinner color="black" />}
      {isFetchingNextPage && (
        <div className="next-page-loader">
          <Spinner />
        </div>
      )}
      <ObserverTarget
        ref={containerRef}
        show={!isFetching && !isFetchingNextPage && hasNextPage === true}
      />
    </StyledExplore>
  );
};

export default Explore;
