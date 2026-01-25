import { ElevatorSeverityLevel } from '@/graphql/types/client/generated_types';

export type SeverityStatusBadgeItem = {
  icon: JSX.Element;
  textColor: string;
  tooltipMessage?: string;
};

export type SeverityStatus = {
  severity: ElevatorSeverityLevel;
  label: string;
  description?: string;
};

export type SeverityStatusBadgeConfig = Record<ElevatorSeverityLevel, SeverityStatusBadgeItem>;
