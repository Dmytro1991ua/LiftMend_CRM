import { DashboardMetrics } from './../../graphql/types/server/generated_types';
export enum SectionTitle {
  KeyAppMetrics = 'Key App Metrics',
  TechnicianAvailabilityMetrics = 'Technician Availability Metrics',
  ElevatorStatusMetrics = 'Elevator Status Metrics',
}

export type DashboardSectionProps = {
  dashboardMetrics: DashboardMetrics;
  loading: boolean;
  error?: string;
  className?: string;
};
