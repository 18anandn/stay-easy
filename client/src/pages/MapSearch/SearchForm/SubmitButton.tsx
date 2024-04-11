import { useSearchHomeList } from '../../../features/homes/hooks/useSearchHomeList';
import { useFormContext } from 'react-hook-form';
import { SearchHomeListParams } from '../../../features/homes/types/SearchHomeListParams';
import Button from '../../../components/buttons/Button';

const SubmitButton: React.FC = () => {
  const { isLoading, isError } = useSearchHomeList();
  const { formState } = useFormContext<SearchHomeListParams>();

  const disableSearch = isLoading || !(formState.isDirty || isError);
  return (
    <Button type="submit" form="map-search" disabled={disableSearch}>
      Search
    </Button>
  );
};

export default SubmitButton;
