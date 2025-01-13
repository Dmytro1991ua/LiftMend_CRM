import { TechnicianRecordsMetrics } from '@/graphql/types/client/generated_types';
import { AdditionalChatConfigFields, ChartData, ChartType } from '@/shared/base-charts/types';

export const getAdditionalChartConfigFields = (totalTechnicianRecords: number): AdditionalChatConfigFields => {
  return {
    [ChartType.Pie]: {
      dataKey: 'value',
      nameKey: 'name',
      innerRadius: 70,
      outerRadius: 110,
      hasLayerLabel: false,
      chartTitle: 'Total Technicians',
      chartTotalValue: totalTechnicianRecords,
      shouldShowLabel: true,
    },
  };
};

export const getTechnicianAssignmentChartDataConfig = (
  technicianRecordMetrics: TechnicianRecordsMetrics
): ChartData[] => {
  return [
    { name: 'Available', value: technicianRecordMetrics?.availableTechnicians, fill: '#22c55e' },
    { name: 'Busy', value: technicianRecordMetrics?.busyTechnicians, fill: '#f97316' },
    { name: 'On Leave', value: technicianRecordMetrics?.onLeaveTechnicians, fill: '#eab308' },
    { name: 'Unavailable', value: technicianRecordMetrics?.unavailableTechnicians, fill: '#6b7280' },
    { name: 'Inactive', value: technicianRecordMetrics?.inactiveTechnicians, fill: '#78716c' },
    { name: 'Reserved', value: technicianRecordMetrics?.reservedTechnicians, fill: '#3b82f6' },
  ];
};
