import { Controller, useFormContext } from 'react-hook-form';
import { format, startOfDay, add, lastDayOfMonth } from 'date-fns';

import { SearchHomeListParams } from '../../../features/homes/types/SearchHomeListParams';
import CustomDatePicker from '../../../components/CustomDatePicker';
import { DATE_FORMAT_NUM } from '../../../data/constants';
import { useSearchHomeList } from '../../../features/homes/hooks/useSearchHomeList';

const minDate = startOfDay(new Date());
const maxDate = lastDayOfMonth(add(minDate, { years: 1, months: 1 }));

const DateRangeField: React.FC = () => {
  const { control } = useFormContext<SearchHomeListParams>();
  const { isLoading } = useSearchHomeList();

  return (
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
            disabled={isLoading}
            minStartDate={minDate}
            maxStartDate={maxDate}
            maxRange={60}
            initialDateRange={
              dateRange ? { from: dateRange[0], to: dateRange[1] } : undefined
            }
            onDateRangeChange={(dateRange) => {
              if (dateRange && dateRange.from && dateRange.to) {
                const checkIn_str = format(dateRange.from, DATE_FORMAT_NUM);
                const checkOut_str = format(dateRange.to, DATE_FORMAT_NUM);
                field.onChange(`${checkIn_str}_${checkOut_str}`);
              } else if (!dateRange || (!dateRange.from && !dateRange.to)) {
                field.onChange('');
              }
            }}
          />
        );
      }}
    />
  );
};

export default DateRangeField;
