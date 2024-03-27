import styled from 'styled-components';

import SearchInput from '../components/inputs/SearchInput';
import CustomDatePicker from '../components/CustomDatePicker';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useEffect, useRef, useState } from 'react';
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic.css';
import Select from 'react-select';
import { useSearchHomeList } from '../features/homes/hooks/useSearchHomeList';
import HomeCard from '../features/homes/components/HomeCard';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { add, endOfMonth, format, startOfDay } from 'date-fns';
import Button from '../components/buttons/Button';
import Spinner from '../components/loaders/Spinner';
import ToggleButton from '../components/buttons/ToggleButton';
import ErrorPage from './ErrorPage';
import Modal from '../components/Modal';
import { RiEqualizerLine } from 'react-icons/ri';
import {
  getFindHomeParams,
  toSearchHomeURLParams,
} from '../features/homes/services/searchHome';
import { SearchHomeListParams } from '../features/homes/types/SearchHomeListParams';
import { DATE_FORMAT_NUM } from '../data/constants';
import { AMENITIES_OPTIONS } from '../data/amenities';
import { HomeCardWithLocation } from '../features/homes/types/HomeCardWithLocation';
import { useSearchParams } from 'react-router-dom';
import SetBounds from '../map/components/SetBounds';
import PriceMarker, { MarkerCss } from '../map/components/PriceMarker';
import FormWrapper, { formModalAtom } from '../components/FormWrapper';
import { screenWidths } from '../providers/ScreenProvider';
import { useSetAtom } from 'jotai';
import classNames from 'classnames';
import { MapPopupProvider } from '../map/MapPopupProvider';

// type MarkerInfo

const StyledMapSearch = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  --form-container-height: 70px;

  .form-container {
    width: 100%;
    position: sticky;
    top: var(--top-navbar-height);
    z-index: 4;
    background-color: white;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    height: var(--form-container-height);
    display: flex;
    align-items: center;
    gap: 20px;

    & > :first-child {
      margin-left: auto;
    }

    & > :last-child {
      margin-right: auto;
    }
    .filter-button {
      position: relative;
      overflow: visible;

      .icon {
        vertical-align: middle;
        margin-right: 0.3rem;
      }

      .filter-number {
        display: inline-block;
        aspect-ratio: 1;
        --box-height: 1rem;
        height: var(--box-height);
        line-height: var(--box-height);
        border-radius: 1000rem;
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(50%, -50%);
        background-color: inherit;
        border: 1px solid white;
        color: white;
        font-size: 0.7rem;
        /* vertical-align: middle; */
      }
    }
  }

  .columns {
    flex: 1 0 auto;
    display: flex;

    .left-column {
      --breakpoint-grid_columns: 2;
      --grid-padding: 80px;

      flex: 0 1 auto;
      height: 100%;
      width: 100%;
      /* width: 100%; */

      /* @media (min-width: 550px) {
        --breakpoint-grid_columns: 2;
      } */

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
        height: 100%;
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
        font-size: 0.07rem;
      }

      .content-box {
        height: 100%;
        /* width: 100%; */
        padding: 30px var(--grid-padding);
      }

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
        margin: 1rem 0;
        padding: 0 1rem;
      }
    }

    .right-column {
      flex: 1 0 500px;
      .map-container {
        /* height: 100; */
        position: sticky;
        top: calc(var(--top-navbar-height) + var(--form-container-height));
        height: calc(
          100dvh - var(--top-navbar-height) - var(--form-container-height)
        );
        width: 100%;

        #map {
          height: 100%;
          width: 100%;
          position: relative;
          z-index: 0;
        }

        .link-box {
          display: block;
          height: 250px;
          width: 250px;
        }

        .toggle-button {
          font-size: 13px;
          padding: 10px;
          border-radius: 10px;
          position: absolute;
          z-index: 1000;
          top: 10px;
          right: 10px;
          background-color: white;
        }

        ${MarkerCss}
      }
    }
  }

  @media (max-width: ${screenWidths.phone}px) {
    flex-direction: column-reverse;

    .form-container {
      top: auto;
      bottom: 0;
    }
  }
`;

const StyledForm = styled.div`
  height: 100%;
  display: flex;
  gap: 20px;
  align-items: center;

  .custom-search-input {
    max-width: 23ch;
    font-size: 1rem;
  }

  .date-selector {
  }

  @media (max-width: ${screenWidths.phone}px) {
    /* height: min-content; */
    min-width: min-content;
    padding: 20px;
    border-radius: 10px;
    flex-direction: column;
    align-items: start;
    background-color: white;
    border-radius: 20px;

    .custom-button {
      margin: auto;
    }
  }
`;

const StyledFilters = styled.div`
  /* padding: 1vh 1vw; */
  background-color: white;
  overflow: hidden;
  height: min-content;
  min-width: min-content;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  /* box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px; */

  /* @media (min-height: 475px) {
    max-height: 80dvh;
  } */

  .header {
    flex: none;
    padding: 0.5rem 0;
    border-bottom: 1px solid rgb(0, 0, 0, 0.5);
    position: relative;

    h2 {
      text-align: center;
    }
  }

  .footer {
    flex: none;
    padding: 0.5rem;
    display: flex;
    gap: 2rem;
    border-top: 1px solid rgb(0, 0, 0, 0.5);

    & > *:first-child {
      margin-left: auto;
    }

    & > *:last-child {
      margin-right: auto;
    }
  }

  .box {
    flex: 0 1 auto;
    /* max-height: 100dvh; */
    /* max-height: 80dvh; */
    padding: 20px 25px;
    box-sizing: border-box;
    overflow-y: auto;

    .amenities {
      fieldset {
        border: 0;

        legend {
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        .list {
          display: grid;
          /* grid-template-columns: min-content min-content; */
          grid-template-columns: repeat(2, minmax(min-content, 1fr));
          gap: 10px 30px;

          .row {
            display: flex;
            align-items: center;
            gap: 1rem;
            label {
              /* white-space: nowrap; */
              font-size: 1rem;
            }

            input[type='checkbox'] {
              height: 1.2rem;
              aspect-ratio: 1;
              /* outline: 3px solid black; */
            }
          }
        }
      }
    }
  }
`;

const minDate = startOfDay(new Date());
const maxDate = startOfDay(endOfMonth(add(minDate, { years: 1, months: 1 })));

const SORT_OPTIONS = [
  { label: 'Price (low)', value: 'price_low' },
  { label: 'Price (high)', value: 'price_high' },
];

const MapSearch: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentParams = getFindHomeParams(searchParams);
  const { data, isLoading, isError, error } = useSearchHomeList(currentParams);
  const setFormModalState = useSetAtom(formModalAtom);
  const methods = useForm<SearchHomeListParams>({
    defaultValues: currentParams,
  });
  const { formState, handleSubmit, reset, control, register, setValue, watch } =
    methods;
  const [hoveredHome, setHoveredHome] = useState<string>('');
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);

  const isMapOpenRef = useRef<boolean>(false);
  const popupOpenHomeRef = useRef<HomeCardWithLocation>();
  const allowDragRefreshRef = useRef<boolean>(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (data) {
      const { params: passedParams } = data;
      setSearchParams(toSearchHomeURLParams(passedParams), {
        replace: true,
        preventScrollReset: false,
      });
      reset(passedParams);
    }
  }, [data, setSearchParams, reset]);

  const onSearch: SubmitHandler<SearchHomeListParams> = (formData) => {
    setFormModalState(false);
    const prevAddress = currentParams.address
      .trim()
      .replace(/\s+/g, ' ')
      .toLowerCase();
    const currAddress = formData.address
      .trim()
      .replace(/\s+/g, ' ')
      .toLowerCase();
    if (prevAddress !== currAddress) {
      formData.min = '';
      formData.max = '';
    }
    popupOpenHomeRef.current = undefined;
    formData.page = 1;
    formData.sortBy = '';
    formData.order = '';
    setSearchParams(toSearchHomeURLParams(formData));
    reset({}, { keepValues: true });

    if (isFiltersOpen) {
      setIsFiltersOpen(false);
    }
  };

  const resetFilters = () => {
    setValue('amenities', currentParams.amenities, {
      shouldDirty: true,
    });
  };

  const markers = data?.homes.slice() ?? [];
  if (
    popupOpenHomeRef.current &&
    markers.filter((val) => val.id === popupOpenHomeRef.current?.id).length ===
      0
  ) {
    markers.unshift(popupOpenHomeRef.current);
  }

  if (isError) {
    if (
      currentParams.address.length > 0 ||
      (currentParams.min.length > 0 && currentParams.max.length > 0)
    ) {
      allowDragRefreshRef.current = true;
    }
  }

  const hasLocationParams =
    currentParams.address.length > 0 ||
    (currentParams.min.length > 0 && currentParams.max.length > 0);
  if (isMapOpenRef.current) {
    isMapOpenRef.current = hasLocationParams;
  } else {
    if (isLoading) {
      isMapOpenRef.current = false;
    } else {
      isMapOpenRef.current = hasLocationParams || isError;
    }
  }

  const disableSearch = isLoading || !(formState.isDirty || isError);
  const isMapOpen = isMapOpenRef.current;
  const filtersNum = watch('amenities').length;

  const mapClassNames = {
    'map-open': isMapOpen,
    'map-close': !isMapOpen,
  };

  const leftColumnClasses = classNames({
    'left-column': true,
    ...mapClassNames,
  });

  const mapContainerClasses = classNames({
    'map-container': true,
    ...mapClassNames,
  });

  return (
    <StyledMapSearch>
      <form onSubmit={handleSubmit(onSearch)} id="map-search"></form>
      <FormProvider {...methods}>
        <div className="form-container">
          <FormWrapper>
            <StyledForm>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <SearchInput
                    form="map-search"
                    className="custom-search-input"
                    placeholder="Enter location"
                    placeholderSpeacial={
                      currentParams.address.length === 0 &&
                      currentParams.min.length > 0 &&
                      currentParams.max.length > 0
                        ? 'Map Area'
                        : undefined
                    }
                    name="address"
                    autoComplete="on"
                    value={field.value}
                    onValChange={(value) => {
                      field.onChange(value);
                    }}
                  />
                )}
              />
              <div className="date-selector">
                <Controller
                  control={control}
                  name="dates"
                  render={({ field }) => {
                    const dateRange =
                      field.value.length > 0
                        ? field.value.split('_').map((val) => new Date(val))
                        : undefined;
                    return (
                      <CustomDatePicker
                        minStartDate={minDate}
                        maxStartDate={maxDate}
                        maxRange={60}
                        initialDateRange={
                          dateRange
                            ? { from: dateRange[0], to: dateRange[1] }
                            : undefined
                        }
                        onDateRangeChange={(dateRange) => {
                          if (dateRange && dateRange.from && dateRange.to) {
                            const checkIn_str = format(
                              dateRange.from,
                              DATE_FORMAT_NUM
                            );
                            const checkOut_str = format(
                              dateRange.to,
                              DATE_FORMAT_NUM
                            );
                            field.onChange(`${checkIn_str}_${checkOut_str}`);
                          } else if (
                            !dateRange ||
                            (!dateRange.from && !dateRange.to)
                          ) {
                            field.onChange('');
                          }
                        }}
                      />
                    );
                  }}
                />
              </div>
              {/* <input type="hidden" {...register('min')} />
        <input type="hidden" {...register('max')} /> */}
              <Button type="submit" form="map-search" disabled={disableSearch}>
                Search
              </Button>
            </StyledForm>
          </FormWrapper>
          <Button
            type="button"
            className="filter-button"
            onClick={() => setIsFiltersOpen(true)}
          >
            <span className="icon">
              <RiEqualizerLine />
            </span>
            Filters
            {!isLoading && currentParams.amenities.length > 0 && (
              <span className="filter-number">
                {currentParams.amenities.length}
              </span>
            )}
          </Button>
        </div>
        <Modal
          isModalOpen={isFiltersOpen}
          setIsModalOpen={setIsFiltersOpen}
          onClose={() => {
            resetFilters();
          }}
        >
          <StyledFilters>
            <div className="header">
              <h2>Filters</h2>
            </div>
            <div className="box">
              <div className="amenities">
                <fieldset>
                  <legend>Amenities</legend>
                  <div className="list">
                    {AMENITIES_OPTIONS.map((val) => (
                      <div className="row" key={val.value}>
                        <input
                          id={val.value}
                          type="checkbox"
                          value={val.value}
                          form="map-search"
                          {...register('amenities')}
                        />
                        <label htmlFor={val.value}>{val.label}</label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
            </div>
            <div className="footer">
              <Button
                type="button"
                onClick={() => setValue('amenities', [], { shouldDirty: true })}
                disabled={filtersNum === 0}
              >
                Clear all
              </Button>
              <Button type="submit" form="map-search" disabled={disableSearch}>
                Search
              </Button>
            </div>
          </StyledFilters>
        </Modal>
      </FormProvider>
      <div className="columns">
        <div className={leftColumnClasses}>
          {isLoading && <Spinner color="black" />}
          {!isLoading &&
            data &&
            (data.count > 0 ? (
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
            ))}
          {isError && <ErrorPage error={error} />}
        </div>
        <MapPopupProvider />
        {isMapOpen && (
          <div className="right-column">
            <div
              className={mapContainerClasses}
              // className='map-container'
            >
              <ToggleButton
                defaultVal={allowDragRefreshRef.current}
                label="Refresh on map drag/zoom"
                id="toggleDraggable"
                onChange={(val) => {
                  allowDragRefreshRef.current = val;
                }}
              />
              <MapContainer
                id="map"
                center={[51.505, -0.09]}
                zoom={13}
                minZoom={2}
                zoomControl={false}
                zoomDelta={1}
                zoomSnap={0.25}
                trackResize={true}
                maxBoundsViscosity={1}
                doubleClickZoom={false}
                maxBounds={[
                  [-90, -180],
                  [90, 180],
                ]}
                worldCopyJump={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                />
                {markers.map((home) => (
                  <PriceMarker
                    key={home.id}
                    home={home}
                    position={{ lat: home.location[0], lng: home.location[1] }}
                    price={home.price}
                    focused={hoveredHome === home.id}
                    onClick={() => (popupOpenHomeRef.current = home)}
                    onPopupClose={() => (popupOpenHomeRef.current = undefined)}
                  />
                ))}
                <SetBounds
                  initialBounds={data?.bounds}
                  yourBounds={
                    data && data.params.address.length > 0
                      ? data.bounds
                      : undefined
                  }
                  onBoundsChange={(bounds) => {
                    if (allowDragRefreshRef.current) {
                      const newParams: SearchHomeListParams = {
                        ...currentParams,
                        address: '',
                        min: `${bounds.getSouthWest().lat},${
                          bounds.getSouthWest().lng
                        }`,
                        max: `${bounds.getNorthEast().lat},${
                          bounds.getNorthEast().lng
                        }`,
                        page: 1,
                        sortBy: '',
                        order: '',
                      };
                      reset(newParams);
                      setSearchParams(toSearchHomeURLParams(newParams));
                    }
                  }}
                />
              </MapContainer>
            </div>
          </div>
        )}
      </div>
    </StyledMapSearch>
  );
};

export default MapSearch;
