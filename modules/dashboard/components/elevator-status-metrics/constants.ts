import { ChartConfig } from '@/shared/base-charts/types';

export const ELEVATOR_STATUS_CHART_CONFIG: ChartConfig = {
  Operational: { label: 'Operational', color: '#22c55e' },
  UnderMentainance: { label: 'Under Mentainance', color: '#f97316' },
  OutOfService: { label: 'Out of Service', color: '#ef4444' },
  Paused: { label: 'Paused', color: '#3b82f6' },
};

export const DEFAULT_ERROR_RESPONSE_MESSAGE = 'Failed to fetch elevator status metrics';
export const ELEVATOR_STATUS_CHART_TITLE = 'Elevator Status Overview';
export const ELEVATOR_STATUS_CHART_DESCRIPTION =
  'This chart highlights elevator statuses, offering a quick view of operational and maintenance conditions.';
