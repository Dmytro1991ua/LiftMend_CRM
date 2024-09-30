import { Cell } from '@tanstack/react-table';

import { Maybe } from '@/graphql/types/client/generated_types';

export enum StorageTableName {
  RepairJobTable = 'repairJobTable',
}

export enum TableNames {
  RepairJobsTable = 'RepairJobs',
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

export type FormFieldConfig = {
  id: number;
  content: JSX.Element;
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

export type TableModel = RepairJob;
export type TableValue = string | Date | string[] | Maybe<string> | unknown;

export type ColumnsValueAccessors = {
  [key: string]: (cell: Cell<TableModel, TableValue>) => string;
};
