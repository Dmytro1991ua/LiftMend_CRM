import { useMemo } from 'react';

import BaseAppMetrics from '@/shared/base-app-metrics';

import { useGetTechnicianPerformanceMetrics } from './hooks';
import { getTechnicianPerformanceMetricsConfig } from './utils';

type TechnicianPerformanceMetricsProps = {
  technicianName: string;
};

const TechnicianPerformanceMetrics = ({ technicianName }: TechnicianPerformanceMetricsProps) => {
  const { technicianPerformanceMetrics, error, loading } = useGetTechnicianPerformanceMetrics(technicianName);

  const technicianPerformanceMetricsConfig = useMemo(
    () => getTechnicianPerformanceMetricsConfig(technicianPerformanceMetrics),
    [technicianPerformanceMetrics]
  );

  return <BaseAppMetrics error={error} loading={loading} metricsConfig={technicianPerformanceMetricsConfig} />;
};

export default TechnicianPerformanceMetrics;
