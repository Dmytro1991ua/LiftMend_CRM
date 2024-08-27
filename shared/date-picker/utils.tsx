import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { DEFAULT_DATE_PICKER_PLACEHOLDER, DatePickerConfigValue, DateRangeConfigKey } from './types';

export const getDatePickerConfig = (date?: DateRange): Record<DateRangeConfigKey, DatePickerConfigValue> => {
  return {
    [DateRangeConfigKey.NoDate]: <span>{DEFAULT_DATE_PICKER_PLACEHOLDER}</span>,
    [DateRangeConfigKey.WithDateRange]: (
      <>
        {date?.from &&
          date?.to &&
          `${format(date.from, 'LLL dd, y HH:mm a')} - ${format(date.to, 'LLL dd, y HH:mm a')}`}
      </>
    ),
    [DateRangeConfigKey.WithSingleDate]: date?.from && format(date.from, 'LLL dd, y HH:mm a'),
  };
};

export const getDatePicketConfigKey = (date?: DateRange): DateRangeConfigKey =>
  date?.to ? DateRangeConfigKey.WithDateRange : date ? DateRangeConfigKey.WithSingleDate : DateRangeConfigKey.NoDate;
