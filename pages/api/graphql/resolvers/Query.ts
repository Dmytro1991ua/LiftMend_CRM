import { CalendarEvent, RepairJob } from '@/graphql/types/client/generated_types';
import { QueryResolvers, RepairJobScheduleData } from '@/graphql/types/server/generated_types';

import prisma from '../../../../prisma/db';

import { fetchRepairJobData, getSortedRepairJobData } from './utils';

const Query: QueryResolvers = {
  getRepairJobScheduleData: async (): Promise<RepairJobScheduleData> => {
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

    return repairJobScheduleData as RepairJobScheduleData;
  },
  getCalendarEvents: async (): Promise<CalendarEvent[]> => {
    const calendarEvents = await prisma.calendarEvent.findMany();

    return calendarEvents || [];
  },
  getRepairJobs: async (): Promise<RepairJob[]> => {
    const scheduledRepairJobs = await prisma.repairJob.findMany();

    return scheduledRepairJobs || [];
  },
};

export default Query;
