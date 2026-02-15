import { useMemo, useState } from 'react';

import { DateRange } from 'react-day-picker';

import { useBaseToast } from '@/shared/hooks';
import { BaseToastVariant } from '@/shared/hooks/useBaseToast/types';
import useStoredTableState from '@/shared/storage/hooks/useStoredState';
import { StorageEntityName } from '@/shared/types';

import { BaseDateFilter } from '../types';
import { getSanitizeDateRange, validateDateRange } from '../utils';

export type UseBaseDateRangeFilterProps = {
  storageKey: string;
  entityName: StorageEntityName;
};

export type UseBaseDateRangeFilter = {
  isCalendarOpen: boolean;
  sanitizedDateRange: BaseDateFilter;
  onHandleCalendarPopoverClose: (open: boolean, range?: DateRange) => void;
};

export const useBaseDateRangeFilter = ({
  storageKey,
  entityName,
}: UseBaseDateRangeFilterProps): UseBaseDateRangeFilter => {
  const { storedState, setStoredState } = useStoredTableState<undefined, undefined, DateRange>(storageKey, entityName);

  const { baseToast } = useBaseToast(BaseToastVariant.Error);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const sanitizedDateRange = useMemo(() => getSanitizeDateRange(storedState.dateFilter), [storedState.dateFilter]);

  const onHandleCalendarPopoverClose = (open: boolean, range?: DateRange) => {
    const validationError = validateDateRange(range);

    if (validationError) {
      baseToast(validationError.title, validationError.message);

      return;
    }

    setIsCalendarOpen(open);

    // If the calendar is closing (open === false) and the range is valid, update the date filter
    if (!open && range) {
      setStoredState((prevState) => ({
        ...prevState,
        dateFilter: {
          ...range,
          isCustomSelection: true,
        },
      }));
    }
  };

  return {
    isCalendarOpen,
    sanitizedDateRange,
    onHandleCalendarPopoverClose,
  };
};
