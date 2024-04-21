import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import SearchInput from '../../../components/inputs/SearchInput';
import { SearchHomeListParams } from '../../../features/homes/types/SearchHomeListParams';
import { useSearchHomeList } from '../../../features/homes/hooks/useSearchHomeList';

const SearchInputField: React.FC = () => {
  const { currentParams, isLoading } = useSearchHomeList();
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
          disabled={isLoading}
          onValChange={(value) => {
            field.onChange(value);
          }}
        />
      )}
    />
  );
};

export default SearchInputField;
