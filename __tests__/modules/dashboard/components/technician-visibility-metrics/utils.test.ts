import { mockTechnicianRecordMetrics } from '@/mocks/dashboardMetrics';
import { getTechnicianAssignmentChartDataConfig } from '@/modules/dashboard/components/technician-visibility-metrics/utils';

describe('getTechnicianAssignmentChartDataConfig', () => {
  it('should return the correct chart data config for given technician record metrics', () => {
    const expectedOutput = [
      { name: 'Available', value: 20, fill: '#22c55e' },
      { name: 'Busy', value: 2, fill: '#f97316' },
      { name: 'On Leave', value: 0, fill: '#eab308' },
      { name: 'Unavailable', value: 0, fill: '#6b7280' },
      { name: 'Inactive', value: 0, fill: '#78716c' },
      { name: 'Reserved', value: 0, fill: '#3b82f6' },
    ];

    const result = getTechnicianAssignmentChartDataConfig(mockTechnicianRecordMetrics);

    expect(result).toEqual(expectedOutput);
  });
});
