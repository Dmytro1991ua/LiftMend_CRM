import { DashboardMetrics } from './../../graphql/types/server/generated_types';
export enum SectionTitle {
  KeyAppMetrics = 'Key App Metrics',
  TechnicianAvailabilityMetrics = 'Technician Availability Metrics',
  ElevatorStatusMetrics = 'Elevator Status Metrics',
  ElevatorTypeMetrics = 'Elevator Type Metrics',
  RepairJobStatusMetrics = 'Repair Job Status Metrics',
  RepairJobSPriorityMetrics = 'Repair Job Priority Metrics',
  RepairJobTypeMetrics = 'Repair Job Type Metrics',
}

export enum DateRangeErrorVariant {
  InvalidDateRange = 'InvalidDateRange',
  MissingEndDate = 'MissingEndDate',
  InvalidDateOrder = 'InvalidDateOrder',
  DateRangeTooLarge = 'DateRangeTooLarge',
}

export type DashboardSectionProps = {
  dashboardMetrics: DashboardMetrics;
  loading: boolean;
  error?: string;
  className?: string;
};

export type DashboardDateFilter = {
  from: Date;
  to: Date;
};

export type DateRangeValidationResult = {
  title: string;
  message: string;
};
