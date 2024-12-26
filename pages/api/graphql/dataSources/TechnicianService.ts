import { PrismaClient } from '@prisma/client';
import { isNull as _isNull, omitBy as _omitBy } from 'lodash';

import {
  CreateTechnicianRecordInput,
  QueryGetTechnicianRecordsArgs,
  TechnicianRecord,
  TechnicianRecordConnection,
  TechnicianRecordFormData,
  UpdateTechnicianRecordInput,
} from '@/graphql/types/server/generated_types';
import { DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_OFFSET } from '@/shared/constants';

import { TECHNICIAN_ASSIGNMENT_BLOCKING_STATUSES } from '../constants';
import {
  createTechnicianRecordFilterOptions,
  createTechnicianRecordSortOptions,
  fetchFormDropdownData,
  getSortedFormDropdownData,
  makeConnectionObject,
} from '../utils';

class TechnicianService {
  private prisma;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getTechnicianRecords(args: QueryGetTechnicianRecordsArgs): Promise<TechnicianRecordConnection> {
    const { paginationOptions, sortOptions, filterOptions } = args;

    const filters = createTechnicianRecordFilterOptions(filterOptions);
    const orderBy = createTechnicianRecordSortOptions(sortOptions);

    const technicianRecords = await this.prisma.technicianRecord.findMany({
      skip: paginationOptions?.offset ?? DEFAULT_PAGINATION_OFFSET,
      take: paginationOptions?.limit ?? DEFAULT_PAGINATION_LIMIT,
      where: filters,
      orderBy,
    });

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

  async deleteTechnicianRecord(id: string) {
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
