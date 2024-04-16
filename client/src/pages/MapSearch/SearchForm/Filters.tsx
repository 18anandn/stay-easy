import styled from 'styled-components';

import Button from '../../../components/buttons/Button';
import { RiEqualizerLine } from 'react-icons/ri';
import { useSearchHomeList } from '../../../features/homes/hooks/useSearchHomeList';
import Modal from '../../../components/Modal';
import { AMENITIES_OPTIONS } from '../../../features/homes/data/amenities';
import { useFormContext } from 'react-hook-form';
import { SearchHomeListParams } from '../../../features/homes/types/SearchHomeListParams';
import { useFiltersModalStatus } from '../hooks/useFiltersModalStatus';

const FilterButton = styled(Button)`
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
`;

const StyledFilters = styled.div`
  /* padding: 1vh 1vw; */
  max-height: 90svh;
  /* overflow: hidden; */
  background-color: white;
  display: flex;
  flex-direction: column;

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

const Filters: React.FC = () => {
  const { isLoading, isError, currentParams } = useSearchHomeList();
  const { register, setValue, watch, formState } =
    useFormContext<SearchHomeListParams>();
  const filters = watch('amenities');
  const filtersNum = filters.length;
  const [isFiltersOpen, setIsFiltersOpen] = useFiltersModalStatus();

  const disableSearch = isLoading || !(formState.isDirty || isError);
  const resetFilters = () => {
    setValue('amenities', currentParams.amenities, {
      shouldDirty: true,
    });
  };

  return (
    <>
      <FilterButton type="button" onClick={() => setIsFiltersOpen(true)}>
        <span className="icon">
          <RiEqualizerLine />
        </span>
        Filters
        {!isLoading && currentParams.amenities.length > 0 && (
          <span className="filter-number">
            {currentParams.amenities.length}
          </span>
        )}
      </FilterButton>
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
                        // checked={filters.includes(val.value)}
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
    </>
  );
};

export default Filters;
