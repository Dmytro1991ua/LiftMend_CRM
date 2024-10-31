import { Cell } from '@tanstack/react-table';

import { Maybe } from '@/graphql/types/client/generated_types';

export enum StorageTableName {
  RepairJobTable = 'repairJobTable',
  ElevatorManagementTable = 'elevatorManagementTable',
}

export enum TableNames {
  RepairJobsTable = 'RepairJobs',
  ElevatorManagementTable = 'ElevatorManagement',
  TechnicianManagementTable = 'TechnicianManagement',
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
  startDate: Date;
  endDate: Date;
  elevatorType: string;
  buildingName: string;
  elevatorLocation: string;
  technicianName: string;
  technicianSkills: string[];
  contactInformation: string;
  calendarEventId: Maybe<string>;
  status: string;
};

export type ElevatorRecord = {
  id: string;
  elevatorType: string;
  elevatorLocation: string;
  buildingName: string;
  status: string;
  lastMaintenanceDate: Date;
  nextMaintenanceDate: Date;
  technicianName: string;
  capacity: number | null;
  contactInformation: string;
};

export type TechnicianRecord = {
  id: string;
  availabilityStatus: string;
  certifications: string[];
  contactInformation: string;
  employmentStatus: string;
  name: string;
  skills: string[];
};

export type TableModel = RepairJob & ElevatorRecord & TechnicianRecord;
export type TableValue = string | Date | string[] | Maybe<string> | unknown;

export type ColumnsValueAccessors = {
  [key: string]: (cell: Cell<TableModel, TableValue>) => string;
};
