import { useMemo } from 'react';

import { DateRange } from 'react-day-picker';

import { DashboardMetrics } from '@/graphql/types/client/generated_types';
import { getUserName } from '@/shared/auth/utils';
import { useBaseDateRangeFilter } from '@/shared/base-date-range-filter/hooks';
import { DASHBOARD_STATE_STORAGE_KEY } from '@/shared/constants';
import { useUser } from '@/shared/contexts/UserContext';
import { StorageEntityName } from '@/shared/types';

import { useFetchDashboardMetrics } from './useFetchDashboardMetrics';

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

  const { isCalendarOpen, sanitizedDateRange, onHandleCalendarPopoverClose } = useBaseDateRangeFilter({
    storageKey: DASHBOARD_STATE_STORAGE_KEY,
    entityName: StorageEntityName.DashboardPage,
  });

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
