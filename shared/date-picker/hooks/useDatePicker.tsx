import { Dispatch, SetStateAction, useCallback, useState } from 'react';

import { endOfDay, startOfDay } from 'date-fns';
import { DateRange } from 'react-day-picker';

export type UseDatePickerProps = {
  dateRange?: DateRange;
  singleDate?: Date;
  onChange?: (range?: DateRange) => void;
  onSingleDateChange?: (singleDate?: Date) => void;
};

export type UseDatePicker = {
  dateRangeState?: DateRange;
  singleDateState?: Date;
  onHandleTimeChange: (updatedDate?: Date, isStart?: boolean) => void;
  onHandleSelectDates: (range?: DateRange) => void;
  onHandleSelectSingleDate: (date?: Date) => void;
  setSingleDateState: Dispatch<SetStateAction<Date | undefined>>;
};

export const useDatePicker = ({
  dateRange,
  singleDate,
  onChange,
  onSingleDateChange,
}: UseDatePickerProps): UseDatePicker => {
  const [dateRangeState, setDateRangeState] = useState<DateRange | undefined>(dateRange);
  const [singleDateState, setSingleDateState] = useState<Date | undefined>(singleDate);

  const handleSingleDateChange = useCallback(
    (updatedDate?: Date): void => {
      setSingleDateState(updatedDate);
      onSingleDateChange?.(updatedDate);
    },
    [onSingleDateChange]
  );

  const handleDateRangeChange = useCallback(
    (updatedDate?: Date, isStart?: boolean): void => {
      const newDateRange: DateRange = {
        from: isStart ? updatedDate : dateRangeState?.from,
        to: isStart ? dateRangeState?.to : updatedDate,
      };

      setDateRangeState(newDateRange);
      onChange?.(newDateRange);
    },
    [dateRangeState?.from, dateRangeState?.to, onChange]
  );

  const onHandleTimeChange = useCallback(
    (updatedDate?: Date, isStart?: boolean): void => {
      if (singleDateState) {
        handleSingleDateChange(updatedDate);
      } else if (dateRangeState) {
        handleDateRangeChange(updatedDate, isStart);
      }
    },
    [dateRangeState, handleDateRangeChange, handleSingleDateChange, singleDateState]
  );

  const onHandleSelectDates = useCallback(
    (range?: DateRange): void => {
      const updatedRange: DateRange = {
        from: range?.from ? startOfDay(range.from) : undefined,
        to: range?.to ? endOfDay(range.to) : undefined,
      };

      setDateRangeState(updatedRange);
      onChange?.(updatedRange);
    },
    [onChange]
  );

  const onHandleSelectSingleDate = useCallback(
    (date?: Date): void => {
      setSingleDateState(date ? new Date(date) : undefined);
      onSingleDateChange?.(date);
    },
    [onSingleDateChange]
  );

  return {
    dateRangeState,
    singleDateState,
    onHandleTimeChange,
    onHandleSelectDates,
    onHandleSelectSingleDate,
    setSingleDateState,
  };
};
