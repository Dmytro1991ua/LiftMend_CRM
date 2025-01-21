import { ElevatorRecordsMetrics } from '@/graphql/types/server/generated_types';
import { AdditionalChatConfigFields, ChartData, ChartType } from '@/shared/base-charts/types';

export const getAdditionalChartConfigFields = (totalElevators: number): AdditionalChatConfigFields => {
  return {
    [ChartType.Pie]: {
      dataKey: 'value',
      nameKey: 'name',
      innerRadius: 70,
      outerRadius: 110,
      hasLayerLabel: false,
      chartTitle: 'Total Elevators',
      chartTotalValue: totalElevators,
      shouldShowLabel: true,
    },
  };
};

export const getElevatorStatusChartDataConfig = (technicianRecordMetrics: ElevatorRecordsMetrics): ChartData[] => {
  return [
    { name: 'Operational', value: technicianRecordMetrics?.operationalElevators, fill: '#22c55e' },
    { name: 'Out of Service', value: technicianRecordMetrics?.outOfServiceElevators, fill: '#ef4444' },
    { name: 'Under Mentainance', value: technicianRecordMetrics?.underMaintenanceElevators, fill: '#f97316' },
    { name: 'Paused', value: technicianRecordMetrics?.pausedElevators, fill: '#3b82f6' },
  ];
};
