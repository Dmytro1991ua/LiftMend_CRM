import { Prisma, PrismaClient } from '@prisma/client';
import { Maybe } from 'graphql/jsutils/Maybe';
import { isNull as _isNull, omitBy as _omitBy } from 'lodash';

import {
  CreateRepairJobInput,
  ElevatorDetails,
  InputMaybe,
  QueryGetElevatorMaintenanceHistoryArgs,
  QueryGetRepairJobsArgs,
  RepairJob,
  RepairJobConnection,
  RepairJobEdge,
  RepairJobScheduleData,
  RepairJobsMetrics,
  UpdateRepairJobInput,
} from '@/graphql/types/server/generated_types';

import {
  createRepairJobFilterOptions,
  createRepairJobSortOptions,
  fetchFormDropdownData,
  getSortedFormDropdownData,
  isRepairJobOverdue,
  isToday,
  makeConnectionObject,
} from '../utils/utils';

import {
  DEFAULT_RECENT_JOBS_COUNT,
  DEFAULT_SORTING_OPTION,
  REPAIR_JOB_PRIORITY_MAP,
  REPAIR_JOB_STATUS_MAP,
  REPAIR_JOB_TYPE_MAP,
} from './constants';

class RepairJobService {
  private prisma;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getRepairJobs(args: QueryGetRepairJobsArgs): Promise<RepairJobConnection> {
    const { filterOptions, paginationOptions, sortOptions } = args;

    const filters = createRepairJobFilterOptions(filterOptions);
    const orderBy = createRepairJobSortOptions(sortOptions);

    const queryOptions: Prisma.RepairJobFindManyArgs = {
      where: {
        ...filters,
        ...(filterOptions?.startDate || filterOptions?.endDate
          ? {
              createdAt: {
                ...(filterOptions?.startDate && {
                  gte: new Date(filterOptions.startDate),
                }),
                ...(filterOptions?.endDate && {
                  lte: new Date(filterOptions.endDate),
                }),
              },
            }
          : {}),
      },
      orderBy,
    };

    if (paginationOptions) {
      queryOptions.skip = paginationOptions.offset ?? undefined;
      queryOptions.take = paginationOptions.limit ?? undefined;
    }

    const scheduledRepairJobs = await this.prisma.repairJob.findMany(queryOptions);

    const totalItems = await this.prisma.repairJob.count({
      where: filters,
    });

    return makeConnectionObject({
      items: scheduledRepairJobs,
      totalItems,
      paginationOptions,
      getCursor: (repairJob: RepairJob) => repairJob.id,
    });
  }

  async findRepairJobById(id: string): Promise<RepairJob | null> {
    return await this.prisma.repairJob.findUnique({
      where: { id },
    });
  }

  async getRepairJobScheduleData(): Promise<RepairJobScheduleData> {
    const repairJobScheduleData: Partial<RepairJobScheduleData> = {};

    repairJobScheduleData.repairJobTypes = await fetchFormDropdownData(
      () => getSortedFormDropdownData(this.prisma.jobTypes, 'job_types'),
      'repair job types'
    );

    repairJobScheduleData.elevatorTypes = await fetchFormDropdownData(
      () => getSortedFormDropdownData(this.prisma.elevatorTypes, 'elevator_types'),
      'elevator types'
    );

    repairJobScheduleData.buildingNames = await fetchFormDropdownData(
      () => getSortedFormDropdownData(this.prisma.buildingNames, 'building_names'),
      'building names'
    );

    repairJobScheduleData.elevatorLocations = await fetchFormDropdownData(
      () => getSortedFormDropdownData(this.prisma.elevatorLocations, 'locations'),
      'elevator locations'
    );

    repairJobScheduleData.technicianNames = await fetchFormDropdownData(
      () => getSortedFormDropdownData(this.prisma.technicianNames, 'names'),
      'technician names'
    );

    repairJobScheduleData.technicianSkills = await fetchFormDropdownData(
      () => getSortedFormDropdownData(this.prisma.technicianSkills, 'skills'),
      'technician skills'
    );

    repairJobScheduleData.priorities = await fetchFormDropdownData(
      () => getSortedFormDropdownData(this.prisma.priorities, 'priorities'),
      'repair job priorities'
    );
    repairJobScheduleData.statuses = await fetchFormDropdownData(
      () => getSortedFormDropdownData(this.prisma.statuses, 'statuses'),
      'repair job statutes'
    );

    return repairJobScheduleData as RepairJobScheduleData;
  }

  async getElevatorDetailsByBuildingName(
    buildingName: string,
    selectedElevatorType?: Maybe<string>
  ): Promise<ElevatorDetails> {
    const elevatorRecords = await this.prisma.elevatorRecord.findMany({
      where: { buildingName },
      select: { elevatorType: true, elevatorLocation: true },
    });

    const { elevatorTypes, elevatorLocations } = elevatorRecords.reduce(
      (acc, record) => {
        const shouldIncludeLocationForSelectedType =
          !selectedElevatorType || record.elevatorType === selectedElevatorType;

        if (record.elevatorType) {
          acc.elevatorTypes.push(record.elevatorType);
        }

        if (record.elevatorLocation && shouldIncludeLocationForSelectedType) {
          acc.elevatorLocations.push(record.elevatorLocation);
        }
        return acc;
      },
      {
        elevatorTypes: [] as string[],
        elevatorLocations: [] as string[],
      }
    );

    return {
      elevatorTypes,
      elevatorLocations,
    };
  }

  async getRepairJobsMetrics(startDate: string, endDate: string): Promise<RepairJobsMetrics> {
    const repairJobs = await this.getRepairJobs({ filterOptions: { startDate, endDate } });

    const initialRepairJobsMetrics: RepairJobsMetrics = {
      ongoingRepairJobs: 0,
      overdueRepairJobs: 0,
      completedRepairJobsToday: 0,
      totalRepairJobs: 0,
      cancelledRepairJobs: 0,
      completedRepairJobs: 0,
      inProgressRepairJobs: 0,
      onHoldRepairJobs: 0,
      scheduledRepairJobs: 0,
      highPriorityRepairJobs: 0,
      lowPriorityRepairJobs: 0,
      mediumPriorityRepairJobs: 0,
      routineJobs: 0,
      emergencyJobs: 0,
      inspectionJobs: 0,
      installationJobs: 0,
      complianceJobs: 0,
      modernizationJobs: 0,
      upgradeJobs: 0,
      consultationJobs: 0,
      mentainanceJobs: 0,
      repairJobs: 0,
    };

    const metrics = repairJobs.edges.reduce((acc, repairJob: RepairJobEdge) => {
      const statusKey = REPAIR_JOB_STATUS_MAP.get(repairJob.node.status ?? '') || '';
      const priorityKey = REPAIR_JOB_PRIORITY_MAP.get(repairJob.node.jobPriority ?? '') || '';
      const typeKey = REPAIR_JOB_TYPE_MAP.get(repairJob.node.jobType ?? '') || '';

      if (statusKey) {
        acc[statusKey as keyof RepairJobsMetrics]++;
      }

      if (priorityKey) {
        acc[priorityKey as keyof RepairJobsMetrics]++;
      }

      if (typeKey) {
        acc[typeKey as keyof RepairJobsMetrics]++;
      }

      if (repairJob.node.isOverdue) acc.overdueRepairJobs++;
      if (repairJob.node.status === 'Completed' && isToday(new Date(repairJob.node.actualEndDate)))
        acc.completedRepairJobsToday++;

      acc.totalRepairJobs++;

      return acc;
    }, initialRepairJobsMetrics);

    return metrics;
  }

  async createRepairJob(
    repairJobInput: CreateRepairJobInput,
    elevatorId: Maybe<string>,
    technicianId: Maybe<string>
  ): Promise<RepairJob> {
    const isOverdue = isRepairJobOverdue(repairJobInput.endDate, 'Scheduled');

    return this.prisma.repairJob.create({
      data: { ...repairJobInput, isOverdue, elevatorId, technicianId },
    });
  }

  async updateRepairJobWithCalendarEventId(repairJobId: string, calendarEventId: string): Promise<RepairJob> {
    return this.prisma.repairJob.update({
      where: { id: repairJobId },
      data: { calendarEventId },
    });
  }

  async updateRepairJob(input: UpdateRepairJobInput): Promise<RepairJob> {
    const { id, ...fieldsToUpdate } = input;

    const existingJob = await this.prisma.repairJob.findUnique({ where: { id } });

    const newPlannedEndDate = fieldsToUpdate.endDate || existingJob?.endDate;
    const newStatus = fieldsToUpdate.status || existingJob?.status;

    const shouldUpdateActualEndDate = fieldsToUpdate.status === 'Completed' || fieldsToUpdate.status === 'Cancelled';
    const isOverdue = isRepairJobOverdue(newPlannedEndDate, newStatus ?? '');

    const updatedRepairJob = {
      ..._omitBy(fieldsToUpdate, _isNull),
      ...(shouldUpdateActualEndDate && { actualEndDate: new Date() }),
      isOverdue,
    };

    return this.prisma.repairJob.update({
      where: { id },
      data: updatedRepairJob,
    });
  }

  async deleteRepairJob(id: string): Promise<RepairJob> {
    return await this.prisma.repairJob.delete({
      where: { id },
    });
  }

  async recentRepairJobs(jobsCount: InputMaybe<number>): Promise<RepairJob[]> {
    const queryOptions: Prisma.RepairJobFindManyArgs = {
      take: jobsCount ?? DEFAULT_RECENT_JOBS_COUNT,
      orderBy: { startDate: DEFAULT_SORTING_OPTION },
    };

    return await this.prisma.repairJob.findMany(queryOptions);
  }

  async elevatorMaintenanceHistory(args: QueryGetElevatorMaintenanceHistoryArgs): Promise<RepairJobConnection> {
    const { elevatorId, paginationOptions } = args;

    const queryOptions: Prisma.RepairJobFindManyArgs = {
      where: {
        elevatorId,
      },
      orderBy: { startDate: DEFAULT_SORTING_OPTION },
    };

    if (paginationOptions) {
      queryOptions.skip = paginationOptions.offset ?? undefined;
      queryOptions.take = paginationOptions.limit ?? undefined;
    }

    const repairJobRecords = await this.prisma.repairJob.findMany(queryOptions);

    const totalItems = await this.prisma.repairJob.count({
      where: queryOptions.where,
    });

    return makeConnectionObject({
      items: repairJobRecords,
      totalItems,
      paginationOptions,
      getCursor: (repairJobRecord: RepairJob) => repairJobRecord.id,
    });
  }
}

export default RepairJobService;
