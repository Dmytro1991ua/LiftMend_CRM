import { useMemo } from 'react';

import { useQuery } from '@apollo/client';

import { GET_DASHBOARD_METRICS } from '@/graphql/schemas/getDashboardMetrics';
import {
  DashboardMetrics,
  GetDashboardMetricsQuery,
  GetDashboardMetricsQueryVariables,
} from '@/graphql/types/client/generated_types';
import { removeTypeNamesFromObject } from '@/shared/utils';

import { DashboardDateFilter } from '../types';

type UseFetchDashboardMetricsProps = {
  dateRange: DashboardDateFilter;
};

type UseFetchDashboardMetrics = {
  dashboardMetrics: DashboardMetrics;
  loading: boolean;
  error?: string;
  onRefetchDashboardMetrics: (dateRange: DashboardDateFilter) => void;
};

export const useFetchDashboardMetrics = ({ dateRange }: UseFetchDashboardMetricsProps): UseFetchDashboardMetrics => {
  const { data, loading, error, refetch } = useQuery<GetDashboardMetricsQuery, GetDashboardMetricsQueryVariables>(
    GET_DASHBOARD_METRICS,
    {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
      variables: {
        startDate: dateRange?.from?.toISOString(),
        endDate: dateRange?.to?.toISOString(),
      },
    }
  );

  const dashboardMetrics = useMemo(
    () => removeTypeNamesFromObject<DashboardMetrics>(data?.getDashboardMetrics ?? []),
    [data]
  );

  const onRefetchDashboardMetrics = (dateRange: DashboardDateFilter) => {
    refetch({
      startDate: dateRange?.from?.toISOString(),
      endDate: dateRange?.to?.toISOString(),
    });
  };

  return {
    dashboardMetrics,
    loading,
    error: error?.message,
    onRefetchDashboardMetrics,
  };
};
