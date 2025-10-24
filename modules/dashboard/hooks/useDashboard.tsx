import { useMemo, useState } from 'react';

import { DateRange } from 'react-day-picker';

import { DashboardMetrics } from '@/graphql/types/client/generated_types';
import { getUserName } from '@/shared/auth/utils';
import { DASHBOARD_STATE_STORAGE_KEY } from '@/shared/constants';
import { useUser } from '@/shared/contexts/UserContext';
import { useBaseToast } from '@/shared/hooks';
import { BaseToastVariant } from '@/shared/hooks/useBaseToast/types';
import useStoredTableState from '@/shared/storage/hooks';
import { RepairJob, StorageTableName } from '@/shared/types';

import { DEFAULT_DATE_FILTER } from '../constants';
import { getSanitizeDateRange, validateDateRange } from '../utils';

import { useFetchDashboardMetrics } from './useFetchDashboardMetrics';
import { useFetchRecentRepairJobs } from './useFetchRecentRepairJobs';

export type UseDashboard = {
  dashboardMetrics: DashboardMetrics;
  loading: boolean;
  error?: string;
  sanitizedDateRange: DateRange;
  isCalendarOpen: boolean;
  welcomeMessage: string | JSX.Element;
  onHandleCalendarPopoverClose: (open: boolean, range?: DateRange) => void;
};

export const useDashBoard = (): UseDashboard => {
  const { user, loading: userLoading } = useUser();

  const { storedState, setStoredState } = useStoredTableState<undefined, undefined, DateRange>(
    DASHBOARD_STATE_STORAGE_KEY,
    StorageTableName.DashboardPage,
    {
      dateFilter: DEFAULT_DATE_FILTER,
    }
  );

  const { baseToast } = useBaseToast(BaseToastVariant.Error);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const sanitizedDateRange = useMemo(() => getSanitizeDateRange(storedState.dateFilter), [storedState.dateFilter]);

  const { dashboardMetrics, loading, error } = useFetchDashboardMetrics({
    dateRange: sanitizedDateRange,
  });

  const welcomeMessage = useMemo(
    () =>
      getUserName({
        user,
        isLoading: userLoading,
        className: 'h-5 w-30 ml-1',
      }),
    [user, userLoading]
  );

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
        dateFilter: range,
      }));
    }
  };

  return {
    dashboardMetrics,
    loading,
    error,
    sanitizedDateRange,
    isCalendarOpen,
    welcomeMessage,
    onHandleCalendarPopoverClose,
  };
};
