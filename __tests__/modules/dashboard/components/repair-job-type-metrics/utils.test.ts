import { mockRepairJobMetrics } from '@/mocks/dashboardMetrics';
import { getRepairJobTypeChartDataConfig } from '@/modules/dashboard/components/repair-job-type-metrics/utils';

describe('getRepairJobTypeChartDataConfig', () => {
  it('should return the correct chart data config for given repair job metrics', () => {
    const expectedOutput = [
      { name: 'Repair', value: 0 },
      { name: 'Mentainance', value: 0 },
      { name: 'Installation', value: 0 },
      { name: 'Inspection', value: 0 },
      { name: 'Upgrade', value: 0 },
      { name: 'Emergency', value: 0 },
      { name: 'Routine', value: 0 },
      { name: 'Consultation', value: 0 },
      { name: 'Modernization', value: 0 },
      { name: 'Compliance', value: 0 },
    ];

    const result = getRepairJobTypeChartDataConfig(mockRepairJobMetrics);

    expect(result).toEqual(expectedOutput);
  });
});
