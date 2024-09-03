import { DateRange } from 'react-day-picker';

import { RepairJob } from '@/graphql/types/client/generated_types';
import { ButtonVariant } from '@/shared/types';

export enum ActionButtonLabel {
  EDIT = 'Edit',
  DELETE = 'Delete',
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
}

export type ActionButtonConfig = {
  id: number;
  label: ActionButtonLabel;
  icon: JSX.Element;
  variant: ButtonVariant;
  onClick: () => void;
};

export type RepairJobDetailsFormValues = {
  id: string;
  calendarEventId: string | null;
  jobType: string | null;
  jobDescription?: string;
  jobPriority: string | null;
  scheduledDates?: DateRange;
  elevatorType: string | null;
  buildingName: string | null;
  elevatorLocation: string | null;
  technicianName: string | null;
  technicianSkill: string[];
  contactInfo?: string;
  status: string | null;
};

export type FormFieldConfig = {
  id: number;
  label: FormFieldLabel;
  content: JSX.Element;
  className?: string;
};

export type OverlappingKeys = keyof RepairJob & keyof RepairJobDetailsFormValues;
