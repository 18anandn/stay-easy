import classNames from 'classnames';
import Select from 'react-select';
import 'react-responsive-pagination/themes/classic.css';
import ResponsivePagination from 'react-responsive-pagination';
import styled from 'styled-components';

import Spinner from '../../components/loaders/Spinner';
import HomeCard from '../../features/homes/components/HomeCard';
import { useSearchHomeList } from '../../features/homes/hooks/useSearchHomeList';
import ErrorPage from '../ErrorPage';
import { useGetMapOpenStatus } from './hooks/useMapOpenStatus';
import { useSetHoveredHome } from './hooks/useHoveredHome';
import { screenWidths } from '../../providers/ScreenProvider';
import { useToggleMapValue } from './hooks/useToggleMap';

const StyledHomeList = styled.div`
  --breakpoint-grid_columns: 2;
  --grid-padding: 80px;
  flex-basis: 0 1 auto;
  height: 100%;
  box-sizing: border-box;
  width: 100%;

  &.map-close {
    --grid-padding: 5%;
    @media (min-width: 900px) {
      --breakpoint-grid_columns: 3;
    }

    @media (min-width: 1128px) {
      --breakpoint-grid_columns: 3;
    }

    @media (min-width: 1240px) {
      --breakpoint-grid_columns: 4;
    }

    /* @media (min-width: 1320px) {
        --breakpoint-grid_columns: 4;
      } */
  }

  &.map-open {
    flex: 1 1 auto;
    max-width: 900px;

    --grid-padding: 30px;
    @media (min-width: 900px) {
      --breakpoint-grid_columns: 2;
    }

    @media (min-width: 1128px) {
      --breakpoint-grid_columns: 3;
    }

    @media (min-width: 1240px) {
      --breakpoint-grid_columns: 3;
    }
  }

  .custom-spinner {
    font-size: 0.055rem;
  }

  .content-box {
    height: 100%;
    /* width: 100%; */
  }
  padding: 30px var(--grid-padding);

  .header {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 1rem;

    h3 {
      font-size: 1.3rem;
    }
  }

  .home-list {
    list-style-type: none;
    display: grid;
    grid-template-columns: repeat(
      var(--breakpoint-grid_columns, 1),
      minmax(0, 1fr)
    );
    gap: 40px 25px;
  }

  .no-data {
    padding: 30px;

    h3 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1.2rem;
    }
  }

  .pagination-container {
    width: 100%;
    box-sizing: border-box;
    margin-top: 2rem;
    /* padding: 0 1rem; */
  }

  @media (max-width: ${screenWidths.tab}px) {
    /* flex: 0 0 auto; */

    &.map-close,
    &.map-open {
      max-width: none;
      --grid-padding: 5%;
      --breakpoint-grid_columns: 2;

      @media (min-width: 900px) {
        --breakpoint-grid_columns: 3;
      }
    }

    &.hide {
      display: none;
    }
  }

  @media (max-width: ${screenWidths.phone}px) {
    &.map-close,
    &.map-open {
      --breakpoint-grid_columns: 1;
    }

    /* .content-box {
      padding: 10px var(--grid-padding);
    } */
  }
`;

const SORT_OPTIONS = [
  { label: 'Price (low)', value: 'price_low' },
  { label: 'Price (high)', value: 'price_high' },
];

const HomeList: React.FC = () => {
  const {
    data,
    isLoading,
    error,
    currentParams,
    setSearchParams,
    searchParams,
  } = useSearchHomeList();
  const setHoveredHome = useSetHoveredHome();
  const isMapOpen = useGetMapOpenStatus();
  const isToggleMapOpen = useToggleMapValue();

  const mapClassNames = {
    'map-open': isMapOpen,
    'map-close': !isMapOpen,
  };

  const leftColumnClasses = classNames({
    'left-column': true,
    hide: isToggleMapOpen && isMapOpen,
    ...mapClassNames,
  });

  return (
    <StyledHomeList className={leftColumnClasses}>
      {isLoading ? (
        <Spinner color="black" />
      ) : data ? (
        data.count > 0 ? (
          <div className="content-box">
            <div className="header">
              <h3>Homes found: {data.count}</h3>
              {data.items_per_page < data.count && (
                <Select
                  placeholder="Sort by..."
                  options={SORT_OPTIONS}
                  value={
                    SORT_OPTIONS.find(
                      (val) => val.value === currentParams.sortBy
                    ) ?? null
                  }
                  isClearable
                  isSearchable={false}
                  onChange={(val) => {
                    if (val) {
                      searchParams.delete('page');
                      searchParams.set('sortBy', val.value);
                      setSearchParams(searchParams);
                    } else {
                      searchParams.delete('page');
                      searchParams.delete('sortBy');
                      setSearchParams(searchParams);
                    }
                  }}
                />
              )}
            </div>
            <ul className="home-list">
              {data.homes.map((home) => (
                <li
                  key={home.id}
                  onMouseEnter={() => {
                    if (isMapOpen) {
                      setHoveredHome(home.id);
                    }
                  }}
                  onMouseLeave={() => {
                    if (isMapOpen) {
                      setHoveredHome('');
                    }
                  }}
                >
                  <HomeCard homeInfo={home} />
                </li>
              ))}
            </ul>
            {data.totalPages > 1 && (
              <div className="pagination-container">
                <ResponsivePagination
                  total={data.totalPages}
                  current={currentParams.page}
                  onPageChange={(page) => {
                    searchParams.set('page', page.toString());
                    setSearchParams(searchParams);
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="no-data">
            <h3>No data found</h3>
            <p>Try changing the filters.</p>
          </div>
        )
      ) : (
        <ErrorPage error={error} />
      )}
    </StyledHomeList>
  );
};

export default HomeList;
