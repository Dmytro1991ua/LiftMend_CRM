import { useMemo } from 'react';

import BaseAppMetrics from '@/shared/base-app-metrics';
import { TechnicianRecord } from '@/shared/types';

import { getTechnicianPerformanceMetricsConfig } from './utils';

type TechnicianPerformanceMetricsProps = {
  technicianRecord: TechnicianRecord;
};

const TechnicianPerformanceMetrics = ({ technicianRecord }: TechnicianPerformanceMetricsProps) => {
  const technicianPerformanceMetricsConfig = useMemo(
    () => getTechnicianPerformanceMetricsConfig(technicianRecord.performanceMetrics),
    [technicianRecord.performanceMetrics]
  );

  return <BaseAppMetrics loading={false} metricsConfig={technicianPerformanceMetricsConfig} />;
};

export default TechnicianPerformanceMetrics;
