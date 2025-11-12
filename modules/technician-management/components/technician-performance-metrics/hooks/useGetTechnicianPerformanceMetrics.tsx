import { useMemo } from 'react';

import { useQuery } from '@apollo/client';

import { GET_TECHNICIAN_PERFORMANCE_METRICS } from '@/graphql/schemas/getTechnicianPerfomanceMetrics';
import {
  GetTechnicianPerformanceMetricsQuery,
  GetTechnicianPerformanceMetricsQueryVariables,
  TechnicianPerformanceMetrics,
} from '@/graphql/types/client/generated_types';
import { removeTypeNamesFromObject } from '@/shared/utils';

export type UseGetTechnicianPerformanceMetrics = {
  technicianPerformanceMetrics: TechnicianPerformanceMetrics;
  loading: boolean;
  error?: string;
};

export const useGetTechnicianPerformanceMetrics = (technicianName: string): UseGetTechnicianPerformanceMetrics => {
  const { data, loading, error } = useQuery<
    GetTechnicianPerformanceMetricsQuery,
    GetTechnicianPerformanceMetricsQueryVariables
  >(GET_TECHNICIAN_PERFORMANCE_METRICS, {
    variables: {
      technicianName,
    },
    notifyOnNetworkStatusChange: true,
    skip: !technicianName,
  });

  const technicianPerformanceMetrics = useMemo(
    () => removeTypeNamesFromObject<TechnicianPerformanceMetrics>(data?.getTechnicianPerformance ?? []),
    [data?.getTechnicianPerformance]
  );

  return {
    technicianPerformanceMetrics,
    loading,
    error: error?.message,
  };
};
