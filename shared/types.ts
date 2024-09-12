export enum StorageTableName {
  RepairJobTable = 'repairJobTable',
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
