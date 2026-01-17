import { InspectionSeverity } from '@/graphql/types/server/generated_types';

type InspectionStatusKey = 'OVERDUE' | 'DUE_TODAY' | 'CRITICAL' | 'UPCOMING' | 'UP_TO_DATE';

type InspectionStatusConfigItem = {
  condition: boolean;
  label: string;
  severity: InspectionSeverity;
};

export type InspectionStatusConfig = Record<InspectionStatusKey, InspectionStatusConfigItem>;
