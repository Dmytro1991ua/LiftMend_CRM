import { DocumentNode } from 'graphql';

import { GET_REPAIR_JOB_FORM_DATA } from '@/graphql/schemas';
import { GET_CHANGE_LOG_FILTER_DATA } from '@/graphql/schemas/getChangeLogFilterData';
import { GET_ELEVATOR_DETAILS_BY_BUILDING_NAME } from '@/graphql/schemas/getElevatorDetailsByBuildingName';
import { GET_ELEVATOR_RECORD_FORM_DATA } from '@/graphql/schemas/getElevatorRecordFormData';
import { GET_TECHNICIAN_RECORD_FORM_DATA } from '@/graphql/schemas/getTechnicianRecordFormData';
import { DropdownOption } from '@/shared/base-select/types';

export enum DropdownOptions {
  RepairJob,
  ElevatorManagement,
  TechnicianManagement,
  ElevatorDetails,
  ChangeLog,
}

export enum PredefinedDropdownOptions {
  NotificationsCategory,
  NotificationsStatus,
  ElevatorDeactivationReason,
}

export type DropdownOptionConfig = {
  fields: string[];
  schema: DocumentNode;
  queryName: string;
  requiresVariable?: boolean;
};

export const PREDEFINED_DROPDOWN_OPTIONS_CONFIG: Record<PredefinedDropdownOptions, DropdownOption[]> = {
  [PredefinedDropdownOptions.NotificationsCategory]: [
    { value: 'Overdue', label: 'Overdue' },
    { value: 'Upcoming', label: 'Upcoming' },
    { value: 'Urgent', label: 'Urgent' },
  ],
  [PredefinedDropdownOptions.NotificationsStatus]: [
    { value: 'Read', label: 'Read' },
    { value: 'Unread', label: 'Unread' },
  ],
  [PredefinedDropdownOptions.ElevatorDeactivationReason]: [
    { value: 'Awaiting Parts', label: 'Awaiting Parts' },
    { value: 'Breakdown', label: 'Breakdown' },
    { value: 'Inspection', label: 'Inspection' },
    { value: 'Manual Shutdown', label: 'Manual Shutdown' },
    { value: 'Safety Lock', label: 'Safety Lock' },
  ],
};

export const DROPDOWN_OPTIONS_CONFIG: Record<DropdownOptions, DropdownOptionConfig> = {
  [DropdownOptions.RepairJob]: {
    schema: GET_REPAIR_JOB_FORM_DATA,
    queryName: 'getRepairJobScheduleData',
    fields: [
      'repairJobTypes',
      'elevatorTypes',
      'buildingNames',
      'elevatorLocations',
      'technicianNames',
      'technicianSkills',
      'priorities',
      'statuses',
    ],
  },
  [DropdownOptions.ElevatorManagement]: {
    schema: GET_ELEVATOR_RECORD_FORM_DATA,
    queryName: 'getElevatorRecordFormData',
    fields: ['elevatorTypes', 'buildingNames', 'elevatorLocations', 'elevatorStatuses'],
  },
  [DropdownOptions.TechnicianManagement]: {
    schema: GET_TECHNICIAN_RECORD_FORM_DATA,
    queryName: 'getTechnicianRecordFormData',
    fields: ['availabilityStatuses', 'certifications', 'employmentStatuses', 'skills'],
  },
  [DropdownOptions.ElevatorDetails]: {
    schema: GET_ELEVATOR_DETAILS_BY_BUILDING_NAME,
    queryName: 'getElevatorDetailsByBuildingName',
    fields: ['elevatorTypes', 'elevatorLocations'],
    requiresVariable: true,
  },
  [DropdownOptions.ChangeLog]: {
    schema: GET_CHANGE_LOG_FILTER_DATA,
    queryName: 'getChangeLogFilterData',
    fields: ['actions', 'entityTypes', 'users'],
  },
};
