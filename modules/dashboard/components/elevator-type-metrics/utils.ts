import { ElevatorRecordsMetrics } from '@/graphql/types/server/generated_types';
import { ChartData } from '@/shared/base-charts/types';

export const getElevatorTypeChartDataConfig = (elevatorRecordMetrics: ElevatorRecordsMetrics): ChartData[] => {
  return [
    { name: 'Passenger', value: elevatorRecordMetrics?.passengerElevators, fill: '#2196F3' },
    { name: 'Freight', value: elevatorRecordMetrics?.freightElevators, fill: '#8E24AA' },
    { name: 'Service', value: elevatorRecordMetrics?.serviceElevators, fill: '#009688' },
    { name: 'Home', value: elevatorRecordMetrics?.homeElevators, fill: '#FF5722' },
    { name: 'Luxury High Speed', value: elevatorRecordMetrics?.luxuryHighSpeedElevators, fill: '#FFD700' },
    { name: 'Vehicle Parking', value: elevatorRecordMetrics?.vehicleParkingElevators, fill: '#3F51B5' },
    { name: 'Specialty', value: elevatorRecordMetrics?.specialtyElevators, fill: '#795548' },
  ];
};
