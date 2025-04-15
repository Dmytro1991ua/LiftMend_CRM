import { mockRepairJobMetrics } from '@/mocks/dashboardMetrics';
import { getRepairJobPriorityChartDataConfig } from '@/modules/dashboard/components/repair-job-priority-metrics/utils';

describe('getRepairJobPriorityChartDataConfig', () => {
  it('should return the correct chart data config for given repair job metrics', () => {
    const expectedOutput = [
      { name: 'Low', value: 0, fill: '#22c55e' },
      { name: 'Medium', value: 0, fill: '#eab308' },
      { name: 'High', value: 0, fill: '#ef4444' },
    ];

    const result = getRepairJobPriorityChartDataConfig(mockRepairJobMetrics);

    expect(result).toEqual(expectedOutput);
  });
});
