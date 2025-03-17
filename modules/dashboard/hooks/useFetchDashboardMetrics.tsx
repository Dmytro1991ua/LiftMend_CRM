import { useMemo } from 'react';

import { useQuery } from '@apollo/client';
import { useSessionContext } from '@supabase/auth-helpers-react';

import { GET_DASHBOARD_METRICS } from '@/graphql/schemas/getDashboardMetrics';
import {
  DashboardMetrics,
  GetDashboardMetricsQuery,
  GetDashboardMetricsQueryVariables,
} from '@/graphql/types/client/generated_types';
import { getUserName } from '@/shared/auth/utils';
import { removeTypeNamesFromObject } from '@/shared/utils';

import { DashboardDateFilter } from '../types';

type UseFetchDashboardMetricsProps = {
  dateRange: DashboardDateFilter;
};

type UseFetchDashboardMetrics = {
  dashboardMetrics: DashboardMetrics;
  loading: boolean;
  error?: string;
  welcomeMessage: string;
  onRefetchDashboardMetrics: (dateRange: DashboardDateFilter) => void;
};

export const useFetchDashboardMetrics = ({ dateRange }: UseFetchDashboardMetricsProps): UseFetchDashboardMetrics => {
  const { session } = useSessionContext();

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
  const welcomeMessage = useMemo(() => getUserName(session), [session]);

  return {
    dashboardMetrics,
    loading,
    error: error?.message,
    onRefetchDashboardMetrics,
    welcomeMessage,
  };
};
