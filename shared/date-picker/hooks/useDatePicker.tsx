import { useCallback, useState } from 'react';

import { endOfDay, startOfDay } from 'date-fns';
import { DateRange } from 'react-day-picker';

type UseDatePickerProps = {
  dateRange?: DateRange;
  onChange?: (range?: DateRange) => void;
};

type UseDatePicker = {
  date?: DateRange;
  onHandleTimeChange: (updatedDate?: Date, isStart?: boolean) => void;
  onHandleSelectDates: (range?: DateRange) => void;
};

const useDatePicker = ({ dateRange, onChange }: UseDatePickerProps): UseDatePicker => {
  const [date, setDate] = useState<DateRange | undefined>(dateRange);

  const onHandleTimeChange = (updatedDate?: Date, isStart?: boolean): void => {
    if (date) {
      const newDateRange: DateRange = {
        from: isStart ? updatedDate : date.from,
        to: isStart ? date.to : updatedDate,
      };

      setDate(newDateRange);
      onChange?.(newDateRange);
    }
  };

  const onHandleSelectDates = useCallback(
    (range?: DateRange): void => {
      const updatedRange: DateRange = {
        from: range?.from ? startOfDay(range.from) : undefined,
        to: range?.to ? endOfDay(range.to) : undefined,
      };

      setDate(updatedRange);
      onChange?.(updatedRange);
    },
    [onChange]
  );

  return {
    date,
    onHandleTimeChange,
    onHandleSelectDates,
  };
};

export default useDatePicker;
