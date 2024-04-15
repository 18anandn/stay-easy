import styled from 'styled-components';

import { screenWidths } from '../../providers/ScreenProvider';
import Info from './Info';
import Details from './Details';
import { useLayoutEffect } from 'react';
import BookingDetailsModalOnPhone from './BookingDetailsModalOnPhone';
import Loader from '../../components/loaders/Loader';
import ErrorPage from '../ErrorPage';
import { useGetHomeInfo } from './hooks/useGetHomeInfo';

const StyledHomeInfo = styled.div`
  padding-block: 2rem;
  padding-inline: var(--padding-inline);
  display: grid;
  grid-template-columns: 1fr min-content;
  gap: 1rem 8%;

  .custom-loader {
    font-size: 0.1rem;
  }

  h1 {
    font-size: 2rem;
    grid-column: 1 / -1;
    word-wrap: break-word;
    /* hyphens: auto; */
  }

  .home-name {
    /* padding-inline: var(--padding-inline); */
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 15px;
  }

  .left-column {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .location {
      font-size: 1.5rem;
    }

    .amenities {
      ul {
        list-style-position: inside;
      }

      li {
        font-size: 1rem;
      }
    }

    .description {
      font-size: 1.3rem;
    }

    .map {
      font-size: 1.3rem;
      margin-bottom: 20px;

      .map-container {
        height: 500px;

        #map {
          position: relative;
          height: 100%;
          width: 100%;
          z-index: 0;
        }
      }
    }
  }

  @media (max-width: ${screenWidths.phone}px) {
    padding-top: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-inline: 0;

    .home-name {
      word-break: break-all;
    }

    .home-name,
    .left-column {
      padding-inline: var(--padding-inline-small);
    }
  }
`;

const HomeInfo: React.FC = () => {
  const { isLoading, data, error } = useGetHomeInfo();

  useLayoutEffect(() => {
    document.documentElement.style.setProperty(
      '--padding-inline',
      'var(--padding-inline-large)'
    );
    return () => {
      document.documentElement.style.removeProperty('--padding-inline');
    };
  }, []);

  return (
    <StyledHomeInfo>
      <>
        {isLoading ? (
          <Loader />
        ) : !data ? (
          <ErrorPage error={error} />
        ) : (
          <>
            <Info data={data} />
            <BookingDetailsModalOnPhone data={data}>
              <Details data={data} />
            </BookingDetailsModalOnPhone>
          </>
        )}
      </>
    </StyledHomeInfo>
  );
};

export default HomeInfo;
