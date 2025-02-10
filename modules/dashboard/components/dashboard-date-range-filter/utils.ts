import { isEqual, startOfDay } from 'date-fns';
import { DateRange } from 'react-day-picker';

export const isActionButtonActive = (storedDateRange: DateRange, selectedDateRange: DateRange) => {
  if (!storedDateRange?.from || !storedDateRange?.to || !selectedDateRange?.from || !selectedDateRange?.to) {
    return false;
  }

  // Normalize the date to midnight for both "from" and "to" dates in both ranges.
  // This ensures we're comparing the actual dates, not including time differences.
  const storedFrom = startOfDay(storedDateRange.from);
  const storedTo = startOfDay(storedDateRange.to);
  const selectedFrom = startOfDay(selectedDateRange.from);
  const selectedTo = startOfDay(selectedDateRange.to);

  return isEqual(storedFrom, selectedFrom) && isEqual(storedTo, selectedTo);
};
