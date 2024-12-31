import { orderBy as _orderBy } from 'lodash';

import {
  CreateRepairJobInput,
  ElevatorRecordFilterOptions,
  ElevatorRecordSortField,
  ElevatorRecordSortInput,
  InputMaybe,
  PaginationOptions,
  RepairJobFilterOptions,
  RepairJobSortField,
  RepairJobSortInput,
  TechnicianRecordFilterOptions,
  TechnicianRecordSortField,
  TechnicianRecordSortInput,
} from '@/graphql/types/server/generated_types';

import { DEFAULT_PAGINATION } from './constants';
import { Connection, Edge, PageInfo } from './types';

export const getSortedFormDropdownData = async <T>(
  model: { findMany: () => Promise<T[]> },
  field: keyof T
): Promise<string[]> => {
  const data = await model.findMany();

  return _orderBy(data.flatMap((item) => item[field] as string[]));
};

export async function fetchFormDropdownData<T>(fetchFunction: () => Promise<T>, label: string): Promise<T> {
  try {
    return await fetchFunction();
  } catch (error) {
    console.error(`Error fetching ${label}:`, error);
    throw new Error(`Failed to fetch ${label}: ${(error as Error).message}`);
  }
}

export const makeConnectionObject = <T>({
  items,
  totalItems,
  paginationOptions,
  getCursor,
}: {
  items: T[];
  totalItems: number;
  paginationOptions: InputMaybe<PaginationOptions>;
  getCursor: (item: T) => string;
}): Connection<T> => {
  const limit = paginationOptions?.limit ?? DEFAULT_PAGINATION.limit;
  const offset = paginationOptions?.offset ?? DEFAULT_PAGINATION.offset;

  // Create an array of edges, each containing a cursor and the node (item)
  const edges: Edge<T>[] = items.map((item) => ({
    cursor: getCursor(item), // Generate a unique cursor for each item using getCursor function
    node: item,
  }));

  const hasNextPage = offset + limit < totalItems;
  const hasPreviousPage = offset > 0;

  const pageInfo: PageInfo = {
    hasNextPage,
    hasPreviousPage,
    startCursor: edges.length > 0 ? edges[0].cursor : null, // Cursor of the first item on the page, or null if no items
    endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null, // Cursor of the last item on the page, or null if no items
  };

  return {
    edges,
    pageInfo,
    total: totalItems,
  };
};

export const createRepairJobFilterOptions = (filterOptions: InputMaybe<RepairJobFilterOptions>) => {
  const { searchTerm, jobType, jobPriority, buildingName, elevatorLocation, elevatorType, technicianName, status } =
    filterOptions || {};

  return {
    ...(searchTerm && { id: searchTerm }),
    ...(jobType && jobType.length > 0 && { jobType: { in: jobType } }),
    ...(jobPriority && jobPriority.length > 0 && { jobPriority: { in: jobPriority } }),
    ...(elevatorType && elevatorType.length > 0 && { elevatorType: { in: elevatorType } }),
    ...(buildingName && buildingName.length > 0 && { buildingName: { in: buildingName } }),
    ...(elevatorLocation && elevatorLocation.length > 0 && { elevatorLocation: { in: elevatorLocation } }),
    ...(technicianName && technicianName.length > 0 && { technicianName: { in: technicianName } }),
    ...(status && status.length > 0 && { status: { in: status } }),
  };
};

export const createRepairJobSortOptions = (sortOptions: InputMaybe<RepairJobSortInput>): Record<string, string> => {
  const fieldMap: { [key in RepairJobSortField]: string } = {
    [RepairJobSortField.JobType]: 'jobType',
    [RepairJobSortField.JobPriority]: 'jobPriority',
    [RepairJobSortField.Status]: 'status',
    [RepairJobSortField.StartDate]: 'startDate',
    [RepairJobSortField.EndDate]: 'endDate',
    [RepairJobSortField.ElevatorType]: 'elevatorType',
    [RepairJobSortField.BuildingName]: 'buildingName',
    [RepairJobSortField.ElevatorLocation]: 'elevatorLocation',
    [RepairJobSortField.TechnicianName]: 'technicianName',
  };

  return sortOptions?.field && sortOptions?.order
    ? { [fieldMap[sortOptions.field]]: sortOptions.order.toLowerCase() }
    : {};
};

export const createElevatorRecordFilterOptions = (filterOptions: InputMaybe<ElevatorRecordFilterOptions>) => {
  const { searchTerm, elevatorType, elevatorLocation, buildingName, status } = filterOptions || {};

  return {
    ...(searchTerm && { id: searchTerm }),
    ...(elevatorType && elevatorType.length > 0 && { elevatorType: { in: elevatorType } }),
    ...(buildingName && buildingName.length > 0 && { buildingName: { in: buildingName } }),
    ...(elevatorLocation && elevatorLocation.length > 0 && { elevatorLocation: { in: elevatorLocation } }),
    ...(status && status.length > 0 && { status: { in: status } }),
  };
};

export const createElevatorRecordSortOptions = (
  sortOptions: InputMaybe<ElevatorRecordSortInput>
): Record<string, string> => {
  const fieldMap: { [key in ElevatorRecordSortField]: string } = {
    [ElevatorRecordSortField.Status]: 'status',
    [ElevatorRecordSortField.LastMaintenanceDate]: 'lastMaintenanceDate',
    [ElevatorRecordSortField.NextMaintenanceDate]: 'nextMaintenanceDate',
    [ElevatorRecordSortField.ElevatorType]: 'elevatorType',
    [ElevatorRecordSortField.BuildingName]: 'buildingName',
    [ElevatorRecordSortField.ElevatorLocation]: 'elevatorLocation',
  };

  return sortOptions?.field && sortOptions?.order
    ? { [fieldMap[sortOptions.field]]: sortOptions.order.toLowerCase() }
    : {};
};

export const createTechnicianRecordFilterOptions = (filterOptions: InputMaybe<TechnicianRecordFilterOptions>) => {
  const { searchTerm, availabilityStatus, employmentStatus, skills, certifications } = filterOptions || {};

  return {
    ...(searchTerm && { id: searchTerm }),
    ...(availabilityStatus && availabilityStatus.length > 0 && { availabilityStatus: { in: availabilityStatus } }),
    ...(employmentStatus && employmentStatus.length > 0 && { employmentStatus: { in: employmentStatus } }),
    ...(skills && skills.length > 0 && { skills: { hasSome: skills } }),
    ...(certifications && certifications.length > 0 && { certifications: { hasSome: certifications } }),
  };
};

export const createTechnicianRecordSortOptions = (
  sortOptions: InputMaybe<TechnicianRecordSortInput>
): Record<string, string> => {
  const fieldMap: { [key in TechnicianRecordSortField]: string } = {
    [TechnicianRecordSortField.Name]: 'name',
    [TechnicianRecordSortField.AvailabilityStatus]: 'availabilityStatus',
    [TechnicianRecordSortField.EmploymentStatus]: 'employmentStatus',
  };

  return sortOptions?.field && sortOptions?.order
    ? { [fieldMap[sortOptions.field]]: sortOptions.order.toLowerCase() }
    : {};
};

export const getElevatorStatusErrorMessage = (repairJobInput: CreateRepairJobInput): Record<string, string> => {
  return {
    'Under Maintenance': `Elevator (${repairJobInput.elevatorType}) in ${repairJobInput.elevatorLocation}, ${repairJobInput.buildingName} is already Under Maintenance. Repair job cannot be created.`,
    'Out of Service': `Cannot create repair job. Elevator (${repairJobInput.elevatorType}) in ${repairJobInput.elevatorLocation}, ${repairJobInput.buildingName} is Out of Service and Inactive. Reactivate it in the Elevator Management page before creating a repair job.`,
  };
};

export function isRepairJobOverdue(plannedEndDate: Date, status: string): boolean {
  const isPlannedEndDatePast = new Date(plannedEndDate) < new Date();

  return isPlannedEndDatePast && status !== 'Completed' && status !== 'Cancelled';
}
