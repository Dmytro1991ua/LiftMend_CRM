import {
  CalendarEvent,
  ElevatorRecord,
  ElevatorRecordConnection,
  ElevatorRecordFormData,
  QueryResolvers,
  RepairJob,
  RepairJobConnection,
  RepairJobScheduleData,
  TechnicianRecord,
  TechnicianRecordConnection,
  TechnicianRecordFormData,
} from '@/graphql/types/server/generated_types';

import {
  createElevatorRecordFilterOptions,
  createElevatorRecordSortOptions,
  createRepairJobFilterOptions,
  createRepairJobSortOptions,
  fetchFormDropdownData,
  getSortedFormDropdownData,
  makeConnectionObject,
} from './utils';

const Query: QueryResolvers = {
  getRepairJobScheduleData: async (_, __, { prisma }): Promise<RepairJobScheduleData> => {
    const repairJobScheduleData: Partial<RepairJobScheduleData> = {};

    repairJobScheduleData.repairJobTypes = await fetchFormDropdownData(
      () => getSortedFormDropdownData(prisma.jobTypes, 'job_types'),
      'repair job types'
    );

    repairJobScheduleData.elevatorTypes = await fetchFormDropdownData(
      () => getSortedFormDropdownData(prisma.elevatorTypes, 'elevator_types'),
      'elevator types'
    );

    repairJobScheduleData.buildingNames = await fetchFormDropdownData(
      () => getSortedFormDropdownData(prisma.buildingNames, 'building_names'),
      'building names'
    );

    repairJobScheduleData.elevatorLocations = await fetchFormDropdownData(
      () => getSortedFormDropdownData(prisma.elevatorLocations, 'locations'),
      'elevator locations'
    );

    repairJobScheduleData.technicianNames = await fetchFormDropdownData(
      () => getSortedFormDropdownData(prisma.technicianNames, 'names'),
      'technician names'
    );

    repairJobScheduleData.technicianSkills = await fetchFormDropdownData(
      () => getSortedFormDropdownData(prisma.technicianSkills, 'skills'),
      'technician skills'
    );

    repairJobScheduleData.priorities = await fetchFormDropdownData(
      () => getSortedFormDropdownData(prisma.priorities, 'priorities'),
      'repair job priorities'
    );
    repairJobScheduleData.statuses = await fetchFormDropdownData(
      () => getSortedFormDropdownData(prisma.statuses, 'statuses'),
      'repair job statutes'
    );

    return repairJobScheduleData as RepairJobScheduleData;
  },
  getCalendarEvents: async (_, __, { prisma }): Promise<CalendarEvent[]> => {
    const calendarEvents = await prisma.calendarEvent.findMany();

    return calendarEvents || [];
  },
  getRepairJobs: async (
    _,
    { paginationOptions, sortOptions, filterOptions },
    { prisma }
  ): Promise<RepairJobConnection> => {
    const filters = createRepairJobFilterOptions(filterOptions);
    const orderBy = createRepairJobSortOptions(sortOptions);

    const scheduledRepairJobs = await prisma.repairJob.findMany({
      skip: paginationOptions?.offset,
      take: paginationOptions?.limit,
      where: filters,
      orderBy,
    });

    const totalItems = await prisma.repairJob.count();

    return makeConnectionObject({
      items: scheduledRepairJobs,
      totalItems,
      paginationOptions,
      getCursor: (repairJob: RepairJob) => repairJob.id,
    });
  },
  getRepairJobById: async (_, { id }, { prisma }): Promise<RepairJob> => {
    const repairJob = await prisma.repairJob.findUnique({ where: { id } });

    return repairJob || null;
  },
  getElevatorRecordFormData: async (_, __, { prisma }): Promise<ElevatorRecordFormData> => {
    const elevatorRecordFormData: Partial<ElevatorRecordFormData> = {};

    elevatorRecordFormData.elevatorTypes = await fetchFormDropdownData(
      () => getSortedFormDropdownData(prisma.elevatorTypes, 'elevator_types'),
      'elevator types'
    );

    elevatorRecordFormData.buildingNames = await fetchFormDropdownData(
      () => getSortedFormDropdownData(prisma.buildingNames, 'building_names'),
      'building names'
    );

    elevatorRecordFormData.elevatorLocations = await fetchFormDropdownData(
      () => getSortedFormDropdownData(prisma.elevatorLocations, 'locations'),
      'elevator locations'
    );

    elevatorRecordFormData.technicianNames = await fetchFormDropdownData(
      () => getSortedFormDropdownData(prisma.technicianNames, 'names'),
      'technician names'
    );

    elevatorRecordFormData.elevatorStatuses = await fetchFormDropdownData(
      () => getSortedFormDropdownData(prisma.elevatorStatuses, 'elevatorStatuses'),
      'elevator record statutes'
    );

    return elevatorRecordFormData as ElevatorRecordFormData;
  },
  getElevatorRecords: async (
    _,
    { paginationOptions, filterOptions, sortOptions },
    { prisma }
  ): Promise<ElevatorRecordConnection> => {
    const filters = createElevatorRecordFilterOptions(filterOptions);
    const orderBy = createElevatorRecordSortOptions(sortOptions);

    const elevatorRecords = await prisma.elevatorRecord.findMany({
      skip: paginationOptions?.offset,
      take: paginationOptions?.limit,
      where: filters,
      orderBy,
    });

    const totalItems = await prisma.elevatorRecord.count();

    return makeConnectionObject({
      items: elevatorRecords,
      totalItems,
      paginationOptions,
      getCursor: (elevatorRecord: ElevatorRecord) => elevatorRecord.id,
    });
  },
  getElevatorRecordById: async (_, { id }, { prisma }): Promise<ElevatorRecord> => {
    const elevatorRecord = await prisma.elevatorRecord.findUnique({ where: { id } });

    return elevatorRecord || null;
  },
  getTechnicianRecords: async (_, { paginationOptions }, { prisma }): Promise<TechnicianRecordConnection> => {
    const technicianRecords = await prisma.technicianRecord.findMany({
      skip: paginationOptions?.offset,
      take: paginationOptions?.limit,
    });

    const totalItems = await prisma.technicianRecord.count();

    return makeConnectionObject({
      items: technicianRecords,
      totalItems,
      paginationOptions,
      getCursor: (technicianRecord: TechnicianRecord) => technicianRecord.id,
    });
  },
  getTechnicianRecordFormData: async (_, __, { prisma }): Promise<TechnicianRecordFormData> => {
    const technicianRecordFormData: Partial<TechnicianRecordFormData> = {};

    technicianRecordFormData.availabilityStatuses = await fetchFormDropdownData(
      () => getSortedFormDropdownData(prisma.availabilityStatuses, 'availabilityStatuses'),
      'availability statuses'
    );

    technicianRecordFormData.certifications = await fetchFormDropdownData(
      () => getSortedFormDropdownData(prisma.certifications, 'certifications'),
      'certifications'
    );

    technicianRecordFormData.skills = await fetchFormDropdownData(
      () => getSortedFormDropdownData(prisma.technicianSkills, 'skills'),
      'technician skills'
    );

    technicianRecordFormData.employmentStatuses = await fetchFormDropdownData(
      () => getSortedFormDropdownData(prisma.employmentStatuses, 'employmentStatuses'),
      'employment statuses'
    );

    return technicianRecordFormData as TechnicianRecordFormData;
  },
};

export default Query;
