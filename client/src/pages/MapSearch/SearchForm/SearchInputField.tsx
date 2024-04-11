import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import SearchInput from '../../../components/inputs/SearchInput';
import { SearchHomeListParams } from '../../../features/homes/types/SearchHomeListParams';
import { useSearchParams } from 'react-router-dom';
import { getFindHomeParams } from '../../../features/homes/services/searchHome';

const SearchInputField: React.FC = () => {
  const [searchParams] = useSearchParams();
  const currentParams = getFindHomeParams(searchParams);
  const { control } = useFormContext<SearchHomeListParams>();

  return (
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
  );
};

export default SearchInputField;
