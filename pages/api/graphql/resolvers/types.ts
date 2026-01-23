import { ElevatorSeverityLevel } from '@/graphql/types/server/generated_types';

type InspectionStatusKey = 'OVERDUE' | 'DUE_TODAY' | 'CRITICAL' | 'UPCOMING' | 'UP_TO_DATE';

type InspectionStatusConfigItem = {
  condition: boolean;
  label: string;
  severity: ElevatorSeverityLevel;
};

type ElevatorRepairFrequencyStatusConfigItem = {
  condition: boolean;
  label: string;
  description: string;
  severity: ElevatorSeverityLevel;
};

export type InspectionStatusConfig = Record<InspectionStatusKey, InspectionStatusConfigItem>;
export type ElevatorRepairFrequencyStatusConfig = Record<
  ElevatorSeverityLevel,
  ElevatorRepairFrequencyStatusConfigItem
>;
