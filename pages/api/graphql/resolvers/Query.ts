import {
  CalendarEvent,
  QueryResolvers,
  RepairJob,
  RepairJobConnection,
  RepairJobScheduleData,
} from '@/graphql/types/server/generated_types';

import {
  createRepairJobFilterOptions,
  createRepairJobSortOptions,
  fetchRepairJobData,
  getSortedRepairJobData,
  makeConnectionObject,
} from './utils';

const Query: QueryResolvers = {
  getRepairJobScheduleData: async (_, __, { prisma }): Promise<RepairJobScheduleData> => {
    const repairJobScheduleData: Partial<RepairJobScheduleData> = {};

    repairJobScheduleData.repairJobTypes = await fetchRepairJobData(
      () => getSortedRepairJobData(prisma.jobTypes, 'job_types'),
      'repair job types'
    );

    repairJobScheduleData.elevatorTypes = await fetchRepairJobData(
      () => getSortedRepairJobData(prisma.elevatorTypes, 'elevator_types'),
      'elevator types'
    );

    repairJobScheduleData.buildingNames = await fetchRepairJobData(
      () => getSortedRepairJobData(prisma.buildingNames, 'building_names'),
      'building names'
    );

    repairJobScheduleData.elevatorLocations = await fetchRepairJobData(
      () => getSortedRepairJobData(prisma.elevatorLocations, 'locations'),
      'elevator locations'
    );

    repairJobScheduleData.technicianNames = await fetchRepairJobData(
      () => getSortedRepairJobData(prisma.technicianNames, 'names'),
      'technician names'
    );

    repairJobScheduleData.technicianSkills = await fetchRepairJobData(
      () => getSortedRepairJobData(prisma.technicianSkills, 'skills'),
      'technician skills'
    );

    repairJobScheduleData.priorities = await fetchRepairJobData(
      () => getSortedRepairJobData(prisma.priorities, 'priorities'),
      'repair job priorities'
    );
    repairJobScheduleData.statuses = await fetchRepairJobData(
      () => getSortedRepairJobData(prisma.statuses, 'statuses'),
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
};

export default Query;
