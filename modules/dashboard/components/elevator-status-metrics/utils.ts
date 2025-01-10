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
    { name: 'Operational', value: technicianRecordMetrics?.operationalElevators, fill: '#166534' },
    { name: 'Out of Service', value: technicianRecordMetrics?.outOfServiceElevators, fill: '#b91c1c' },
    { name: 'Under Mentainance', value: technicianRecordMetrics?.underMaintenanceElevators, fill: '#a16207' },
    { name: 'Paused', value: technicianRecordMetrics?.pausedElevators, fill: '#1d4ed8' },
  ];
};
