import { ChartConfig } from '@/shared/base-charts/types';

export const TECHNICIAN_ASSIGNMENT_CHART_CONFIG: ChartConfig = {
  Available: { label: 'Available', color: '#22c55e' },
  Busy: { label: 'Busy', color: '#f97316' },
  'On Leave': { label: 'On Leave', color: '#eab308' },
  Unavailable: { label: 'Unavailable', color: '#6b7280' },
  Inactive: { label: 'Inactive', color: '#78716c' },
  Reserved: { label: 'Reserved', color: '#3b82f6' },
};

export const DEFAULT_ERROR_RESPONSE_MESSAGE = 'Failed to fetch technician availability metrics';
export const TECHNICIAN_AVAILABILITY_CHART_TITLE = 'Technician Availability Overview';
export const TECHNICIAN_AVAILABILITY_CHART_DESCRIPTION =
  'This chart shows the distribution of technician availability to help assess resource allocation.';
