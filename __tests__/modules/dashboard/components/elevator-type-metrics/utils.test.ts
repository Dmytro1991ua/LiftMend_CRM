import { ElevatorRecordsMetrics } from '@/graphql/types/client/generated_types';
import { mockElevatorRecordMetrics } from '@/mocks/dashboardMetrics';
import { getElevatorTypeChartDataConfig } from '@/modules/dashboard/components/elevator-type-metrics/utils';

describe('getElevatorTypeChartDataConfig', () => {
  it('should return the correct chart data config for given elevator metrics', () => {
    const expectedOutput = [
      { name: 'Passenger', value: 19, fill: '#2196F3' },
      { name: 'Freight', value: 10, fill: '#8E24AA' },
      { name: 'Service', value: 6, fill: '#009688' },
      { name: 'Home', value: 12, fill: '#FF5722' },
      { name: 'Luxury High Speed', value: 5, fill: '#FFD700' },
      { name: 'Vehicle Parking', value: 5, fill: '#3F51B5' },
      { name: 'Specialty', value: 9, fill: '#795548' },
    ];

    const result = getElevatorTypeChartDataConfig(mockElevatorRecordMetrics);

    expect(result).toEqual(expectedOutput);
  });

  it('should return chart config with undefined values when elevatorRecordMetrics is undefined', () => {
    const result = getElevatorTypeChartDataConfig({} as ElevatorRecordsMetrics);

    expect(result).toEqual([
      { name: 'Passenger', value: undefined, fill: '#2196F3' },
      { name: 'Freight', value: undefined, fill: '#8E24AA' },
      { name: 'Service', value: undefined, fill: '#009688' },
      { name: 'Home', value: undefined, fill: '#FF5722' },
      { name: 'Luxury High Speed', value: undefined, fill: '#FFD700' },
      { name: 'Vehicle Parking', value: undefined, fill: '#3F51B5' },
      { name: 'Specialty', value: undefined, fill: '#795548' },
    ]);
  });
});
