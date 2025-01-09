import { useMemo } from 'react';

import { useQuery } from '@apollo/client';

import { GET_DASHBOARD_METRICS } from '@/graphql/schemas/getDashboardMetrics';
import {
  DashboardMetrics,
  GetDashboardMetricsQuery,
  GetDashboardMetricsQueryVariables,
} from '@/graphql/types/client/generated_types';
import { removeTypeNamesFromObject } from '@/shared/utils';

type UseFetchDashboardMetrics = {
  dashboardMetrics: DashboardMetrics;
  loading: boolean;
  error?: string;
};

export const useFetchDashboardMetrics = (): UseFetchDashboardMetrics => {
  const { data, loading, error } = useQuery<GetDashboardMetricsQuery, GetDashboardMetricsQueryVariables>(
    GET_DASHBOARD_METRICS,
    {
      fetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: true,
    }
  );

  const dashboardMetrics = useMemo(
    () => removeTypeNamesFromObject<DashboardMetrics>(data?.getDashboardMetrics ?? []),
    [data]
  );

  return {
    dashboardMetrics,
    loading,
    error: error?.message,
  };
};
