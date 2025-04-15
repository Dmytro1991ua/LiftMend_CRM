import { mockRepairJobMetrics } from '@/mocks/dashboardMetrics';
import { getRepairJobStatusChartDataConfig } from '@/modules/dashboard/components/repair-job-status-metrics/utils';

describe('getRepairJobStatusChartDataConfig', () => {
  it('should return the correct chart data config for given repair job metrics', () => {
    const expectedOutput = [
      { name: 'Scheduled', value: 0, fill: '#3b82f6' },
      { name: 'In Progress', value: 0, fill: '#f97316' },
      { name: 'Completed', value: 0, fill: '#22c55e' },
      { name: 'On Hold', value: 0, fill: '#eab308' },
      { name: 'Cancelled', value: 0, fill: '#ef4444' },
    ];

    const result = getRepairJobStatusChartDataConfig(mockRepairJobMetrics);

    expect(result).toEqual(expectedOutput);
  });
});
