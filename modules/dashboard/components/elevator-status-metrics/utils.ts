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
      shouldShowChartLegend: true,
      chartLegendClassName: 'hidden lg:flex translate-y-1 flex-wrap gap-2 [&>*]:basis-1/3 [&>*]:justify-center',
    },
  };
};

export const getElevatorStatusChartDataConfig = (elevatorRecordMetrics: ElevatorRecordsMetrics): ChartData[] => {
  return [
    { name: 'Operational', value: elevatorRecordMetrics?.operationalElevators, fill: '#22c55e' },
    { name: 'Out of Service', value: elevatorRecordMetrics?.outOfServiceElevators, fill: '#ef4444' },
    { name: 'Under Mentainance', value: elevatorRecordMetrics?.underMaintenanceElevators, fill: '#f97316' },
    { name: 'Paused', value: elevatorRecordMetrics?.pausedElevators, fill: '#3b82f6' },
  ];
};
