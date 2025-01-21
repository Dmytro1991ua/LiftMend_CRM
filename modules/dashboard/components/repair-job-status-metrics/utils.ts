import { RepairJobsMetrics } from '@/graphql/types/client/generated_types';
import { ChartData } from '@/shared/base-charts/types';

export const getRepairJobStatusChartDataConfig = (jobMetrics: RepairJobsMetrics): ChartData[] => {
  return [
    { name: 'Scheduled', value: jobMetrics?.scheduledRepairJobs, fill: '#3b82f6' },
    { name: 'In Progress', value: jobMetrics?.inProgressRepairJobs, fill: '#f97316' },
    { name: 'Completed', value: jobMetrics?.completedRepairJobs, fill: '#22c55e' },
    { name: 'On Hold', value: jobMetrics?.onHoldRepairJobs, fill: '#eab308' },
    { name: 'Cancelled', value: jobMetrics?.cancelledRepairJobs, fill: '#ef4444' },
  ];
};
