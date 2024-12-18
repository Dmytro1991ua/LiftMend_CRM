import { PrismaClient } from '@prisma/client';
import { isNull as _isNull, omitBy as _omitBy } from 'lodash';

import {
  CreateRepairJobInput,
  QueryGetRepairJobsArgs,
  RepairJob,
  RepairJobConnection,
  RepairJobScheduleData,
  UpdateRepairJobInput,
} from '@/graphql/types/server/generated_types';
import { DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_OFFSET } from '@/shared/constants';

import {
  createRepairJobFilterOptions,
  createRepairJobSortOptions,
  fetchFormDropdownData,
  getSortedFormDropdownData,
  makeConnectionObject,
} from '../utils';

class RepairJobService {
  private prisma;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getRepairJobs(args: QueryGetRepairJobsArgs): Promise<RepairJobConnection> {
    const { filterOptions, paginationOptions, sortOptions } = args;

    const filters = createRepairJobFilterOptions(filterOptions);
    const orderBy = createRepairJobSortOptions(sortOptions);

    const scheduledRepairJobs = await this.prisma.repairJob.findMany({
      skip: paginationOptions?.offset ?? DEFAULT_PAGINATION_OFFSET,
      take: paginationOptions?.limit ?? DEFAULT_PAGINATION_LIMIT,
      where: filters,
      orderBy,
    });

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

  async createRepairJob(repairJobInput: CreateRepairJobInput): Promise<RepairJob> {
    return this.prisma.repairJob.create({
      data: repairJobInput,
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

    return this.prisma.repairJob.update({
      where: { id },
      data: _omitBy(fieldsToUpdate, _isNull),
    });
  }

  async deleteRepairJob(id: string): Promise<RepairJob> {
    return await this.prisma.repairJob.delete({
      where: { id },
    });
  }
}

export default RepairJobService;
