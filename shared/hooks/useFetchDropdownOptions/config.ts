import { DocumentNode } from 'graphql';

import { GET_REPAIR_JOB_FORM_DATA } from '@/graphql/schemas';
import { GET_ELEVATOR_DETAILS_BY_BUILDING_NAME } from '@/graphql/schemas/getElevatorDetailsByBuildingName';
import { GET_ELEVATOR_RECORD_FORM_DATA } from '@/graphql/schemas/getElevatorRecordFormData';
import { GET_TECHNICIAN_RECORD_FORM_DATA } from '@/graphql/schemas/getTechnicianRecordFormData';

export enum DropdownOptions {
  RepairJob,
  ElevatorManagement,
  TechnicianManagement,
  ElevatorDetails,
}

export type DropdownOptionConfig = {
  fields: string[];
  schema: DocumentNode;
  queryName: string;
  requiresVariable?: boolean;
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
};
