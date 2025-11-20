import { Prisma, PrismaClient } from '@prisma/client';
import { isNull as _isNull, omitBy as _omitBy } from 'lodash';

import {
  CreateTechnicianRecordInput,
  QueryGetTechnicianRecordsArgs,
  TechnicianRecord,
  TechnicianRecordConnection,
  TechnicianRecordEdges,
  TechnicianRecordFormData,
  TechnicianRecordsMetrics,
  UpdateTechnicianRecordInput,
} from '@/graphql/types/server/generated_types';

import {
  createTechnicianRecordFilterOptions,
  createTechnicianRecordSortOptions,
  fetchFormDropdownData,
  getSortedFormDropdownData,
  makeConnectionObject,
} from '../utils/utils';

import { TECHNICIAN_ASSIGNMENT_BLOCKING_STATUSES, TECHNICIAN_AVAILABILITY_STATUS_MAP } from './constants';

class TechnicianService {
  private prisma;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getTechnicianRecords(args: QueryGetTechnicianRecordsArgs): Promise<TechnicianRecordConnection> {
    const { paginationOptions, sortOptions, filterOptions } = args;

    const filters = createTechnicianRecordFilterOptions(filterOptions);
    const orderBy = createTechnicianRecordSortOptions(sortOptions);

    const queryOptions: Prisma.TechnicianRecordFindManyArgs = {
      where: filters,
      orderBy,
    };

    if (paginationOptions) {
      queryOptions.skip = paginationOptions.offset ?? undefined;
      queryOptions.take = paginationOptions.limit ?? undefined;
    }

    const technicianRecords = await this.prisma.technicianRecord.findMany(queryOptions);

    const totalItems = await this.prisma.technicianRecord.count({
      where: filters,
    });

    return makeConnectionObject({
      items: technicianRecords,
      totalItems,
      paginationOptions,
      getCursor: (technicianRecord: TechnicianRecord) => technicianRecord.id,
    });
  }

  async findTechnicianRecordByName(name: string): Promise<TechnicianRecord | null> {
    return await this.prisma.technicianRecord.findFirst({
      where: { name },
    });
  }

  async findTechnicianRecordById(id: string): Promise<TechnicianRecord | null> {
    return await this.prisma.technicianRecord.findUnique({
      where: { id },
    });
  }

  async getTechnicianRecordFormData(): Promise<TechnicianRecordFormData> {
    const technicianRecordFormData: Partial<TechnicianRecordFormData> = {};

    technicianRecordFormData.availabilityStatuses = await fetchFormDropdownData(
      () => getSortedFormDropdownData(this.prisma.availabilityStatuses, 'availabilityStatuses'),
      'availability statuses'
    );

    technicianRecordFormData.certifications = await fetchFormDropdownData(
      () => getSortedFormDropdownData(this.prisma.certifications, 'certifications'),
      'certifications'
    );

    technicianRecordFormData.skills = await fetchFormDropdownData(
      () => getSortedFormDropdownData(this.prisma.technicianSkills, 'skills'),
      'technician skills'
    );

    technicianRecordFormData.employmentStatuses = await fetchFormDropdownData(
      () => getSortedFormDropdownData(this.prisma.employmentStatuses, 'employmentStatuses'),
      'employment statuses'
    );

    return technicianRecordFormData as TechnicianRecordFormData;
  }

  async getAvailableTechniciansForAssignment(): Promise<TechnicianRecord[]> {
    return await this.prisma.technicianRecord.findMany({
      where: {
        availabilityStatus: {
          notIn: TECHNICIAN_ASSIGNMENT_BLOCKING_STATUSES,
        },
      },
    });
  }

  async getTechnicianRecordsMetrics(): Promise<TechnicianRecordsMetrics> {
    const technicianRecords = await this.getTechnicianRecords({});

    const initialTechnicianRecordsMetrics: TechnicianRecordsMetrics = {
      availableTechnicians: 0,
      busyTechnicians: 0,
      onLeaveTechnicians: 0,
      inactiveTechnicians: 0,
      reservedTechnicians: 0,
      unavailableTechnicians: 0,
      totalTechnicianRecords: 0,
    };

    const metrics = technicianRecords.edges.reduce((acc, technician: TechnicianRecordEdges) => {
      const statusKey = TECHNICIAN_AVAILABILITY_STATUS_MAP.get(technician.node.availabilityStatus ?? '');

      if (statusKey) {
        acc[statusKey as keyof TechnicianRecordsMetrics]++;
      }

      acc.totalTechnicianRecords++;

      return acc;
    }, initialTechnicianRecordsMetrics);

    return metrics;
  }

  async createTechnicianRecord(input: CreateTechnicianRecordInput): Promise<TechnicianRecord> {
    const { certifications, ...rest } = input;

    const sanitizedInput = {
      ...rest,
      certifications: certifications ?? [],
    };

    return await this.prisma.technicianRecord.create({
      data: sanitizedInput,
    });
  }

  async updateTechnicianRecord(input: UpdateTechnicianRecordInput): Promise<TechnicianRecord> {
    const { id, ...fieldsToUpdate } = input;

    return await this.prisma.technicianRecord.update({
      where: { id },
      data: _omitBy(fieldsToUpdate, _isNull),
    });
  }

  async updateTechnicianStatus(id: string, status: string): Promise<void> {
    await this.prisma.technicianRecord.update({
      where: { id },
      data: { availabilityStatus: status },
    });
  }

  async deleteTechnicianRecord(id: string): Promise<TechnicianRecord> {
    return await this.prisma.technicianRecord.delete({
      where: { id },
    });
  }

  async validateTechnicianAssignment(name: string): Promise<TechnicianRecord> {
    const technicianRecord = await this.findTechnicianRecordByName(name);

    if (!technicianRecord) {
      throw new Error(`Technician record for ${name} was not found`);
    }

    if (TECHNICIAN_ASSIGNMENT_BLOCKING_STATUSES.includes(technicianRecord.availabilityStatus ?? '')) {
      throw new Error(
        `Technician ${name} is already assigned to another job. Please check the Repair Job Tracking page to see current assignments o select a different technician.`
      );
    }

    return technicianRecord;
  }
}

export default TechnicianService;
