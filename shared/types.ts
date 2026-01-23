import { Cell } from '@tanstack/react-table';
import { NextPage } from 'next';

import { ElevatorSeverityLevel, Maybe, TechnicianPerformanceMetrics } from '@/graphql/types/client/generated_types';

export enum StorageEntityName {
  RepairJobTable = 'repairJobTable',
  ElevatorManagementTable = 'elevatorManagementTable',
  TechnicianManagementTable = 'technicianManagementTable',
  DashboardPage = 'dashboardPage',
  NotificationsPage = 'notificationsPage',
  ChangeLogPage = 'changeLogPage',
}

export enum TableNames {
  RepairJobsTable = 'RepairJobs',
  ElevatorManagementTable = 'ElevatorManagement',
  TechnicianManagementTable = 'TechnicianManagement',
  RecentRepairJobs = 'RecentRepairJobs',
  ElevatorMentainanceHistory = 'ElevatorMentainanceHistory',
}

export enum FormFieldLabel {
  JobType = 'Job Type',
  JobDescription = 'Job Description',
  JobPriority = 'Job Priority',
  JobStatus = 'Job Status',
  ScheduledDates = 'Scheduled Dates',
  ElevatorType = 'Elevator Type',
  BuildingName = 'Building Name',
  ElevatorLocation = 'Elevator Location',
  TechnicianName = 'Technician Name',
  TechnicianSkill = 'Technician Skill(s)',
  ContactInformation = 'Contact Information',
  LastMaintenanceDate = 'Last Maintenance Date',
  NextMaintenanceDate = 'Next Maintenance Date',
  Capacity = 'Capacity',
  Status = 'Status',
  FullName = 'Technician Full Name',
  Certifications = 'Certifications',
  LastInspectionDate = 'Last Inspection Date',
  NextInspectionDate = 'Next Inspection Date',
}

export enum DataLoadStatus {
  Loading = 'loading',
  Error = 'error',
  Empty = 'empty',
}

export type CalendarEventInfoPayload = {
  elevatorType: string;
  buildingName: string;
  elevatorLocation: string;
  jobType: string;
};

export type CalendarEventInfo = {
  title: string;
  description: string;
};

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';

export type ItemConfig = {
  id: number;
  label?: FormFieldLabel;
  content: JSX.Element;
  className?: string;
};

export interface AppStorage {
  getData<T>(key: string): T | undefined;
  setData<T>(key: string, value: T): void;
  removeData(key: string): void;
}

export type RepairJob = {
  id: string;
  jobType: string;
  jobDetails: string;
  jobPriority: string;
  startDate: string | Date;
  endDate: string | Date;
  elevatorType: string;
  buildingName: string;
  elevatorLocation: string;
  technicianName: string;
  calendarEventId: Maybe<string>;
  status: string;
  actualEndDate?: Maybe<Date>;
  isOverdue?: Maybe<boolean>;
};

export type ElevatorInspectionStatus = {
  label: string;
  severity: ElevatorSeverityLevel;
};

export type ElevatorRecord = {
  id: string;
  elevatorType: string;
  elevatorLocation: string;
  buildingName: string;
  status: string;
  lastMaintenanceDate: Date;
  nextMaintenanceDate: Date;
  capacity: number | null;
  lastKnownStatus?: string | null;
  healthScore?: number | null;
  lastInspectionDate?: Date | null;
  nextInspectionDate?: Date | null;
  inspectionStatus?: ElevatorInspectionStatus | null;
};

export type TechnicianRecord = {
  id: string;
  availabilityStatus: string | null;
  certifications: string[];
  contactInformation: string;
  employmentStatus: string | null;
  name: string;
  skills: string[];
  lastKnownAvailabilityStatus?: string | null;
  performanceMetrics?: Maybe<TechnicianPerformanceMetrics>;
};

export type Notification = {
  id: string;
  userId: string | null;
  category: string;
  relatedEntityId: string | null;
  message: string;
  priority: string;
  status: string;
  createdAt: Date;
  readAt: Maybe<Date>;
};

export type ChangeLogFieldChange = {
  field: string;
  oldValue: unknown;
  newValue: unknown;
  action: string;
};

export type ChangeLog = {
  modifiedBy: string | null;
  id: string;
  entityType: string;
  entityId: string;
  changeList: ChangeLogFieldChange[];
  createdAt: string | null;
};

export type TableModel = RepairJob & ElevatorRecord & TechnicianRecord;
export type TableValue = string | Date | string[] | Maybe<string> | unknown;

export type ColumnsValueAccessors = {
  [key: string]: (cell: Cell<TableModel, TableValue>) => string;
};

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

export type DataLoadStatusView = Record<DataLoadStatus, JSX.Element>;
