import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import styled from 'styled-components';
import { SearchHomeListParams } from '../../../features/homes/types/SearchHomeListParams';
import { toSearchHomeURLParams } from '../../../features/homes/services/searchHome';
import { screenWidths } from '../../../providers/ScreenProvider';
import { ReactNode, useEffect } from 'react';
import { useSearchHomeList } from '../../../features/homes/hooks/useSearchHomeList';
import { useSetMapOpenStatus } from '../hooks/useMapOpenStatus';
import { useSetFormModalStatus } from '../hooks/useFormModalStatus';
import { useSetFiltersModalStatus } from '../hooks/useFiltersModalStatus';

const StyledSearchForm = styled.div`
  width: 100%;
  position: sticky;
  top: var(--top-navbar-height);
  z-index: 4;
  background-color: white;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  height: var(--form-container-height);

  .form-elements {
    height: 100%;
    padding-inline: 20px;
    display: flex;
    align-items: center;
    gap: 20px;

    & > :first-child {
      margin-left: auto;
    }

    & > :last-child {
      margin-right: auto;
    }
  }

  @media (max-width: ${screenWidths.phone}px) {
    top: auto;
    bottom: 0;
  }
`;

type Props = {
  children: ReactNode;
};

const SearchFormProvider: React.FC<Props> = ({ children }) => {
  const { data, currentParams, setSearchParams } = useSearchHomeList();
  const methods = useForm<SearchHomeListParams>({
    defaultValues: currentParams,
  });
  const { handleSubmit, reset, register } = methods;
  const setFormModalState = useSetFormModalStatus();
  const setIsFiltersOpen = useSetFiltersModalStatus();
  const setMapStatus = useSetMapOpenStatus();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (data) {
      const { params: passedParams } = data;
      setSearchParams(toSearchHomeURLParams(passedParams), {
        replace: true,
        preventScrollReset: false,
      });
      if (data.bounds) {
        setMapStatus(true);
      } else {
        setMapStatus(false);
      }
      reset(passedParams);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, reset, setMapStatus]);

  useEffect(() => {
    if (
      currentParams.address.length === 0 &&
      currentParams.max.length === 0 &&
      currentParams.min.length === 0
    ) {
      setMapStatus(false);
    }
  }, [currentParams, setMapStatus]);

  const onSearch: SubmitHandler<SearchHomeListParams> = (formData) => {
    setIsFiltersOpen(false);
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
    formData.page = 1;
    formData.sortBy = '';
    formData.order = '';
    reset(formData);
    setSearchParams(toSearchHomeURLParams(formData));
  };

  return (
    <FormProvider {...methods}>
      <StyledSearchForm>
        <form
          onSubmit={handleSubmit(onSearch)}
          id="map-search"
          style={{ display: 'none' }}
        >
          <input
            type="hidden"
            id="min"
            form="map-search"
            {...register('min')}
          />
          <input
            type="hidden"
            id="max"
            form="map-search"
            {...register('max')}
          />
        </form>
        <div className="form-elements">{children}</div>
      </StyledSearchForm>
    </FormProvider>
  );
};

export default SearchFormProvider;
