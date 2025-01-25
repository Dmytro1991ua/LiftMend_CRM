import { RepairJobsMetrics } from '@/graphql/types/client/generated_types';
import { ChartData } from '@/shared/base-charts/types';

export const getRepairJobPriorityChartDataConfig = (jobMetrics: RepairJobsMetrics): ChartData[] => {
  return [
    { name: 'Low', value: jobMetrics?.lowPriorityRepairJobs, fill: '#22c55e' },
    { name: 'Medium', value: jobMetrics?.mediumPriorityRepairJobs, fill: '#eab308' },
    { name: 'High', value: jobMetrics?.highPriorityRepairJobs, fill: '#ef4444' },
  ];
};
