import { ElevatorRecord, PrismaClient } from '@prisma/client';
import { addMonths } from 'date-fns';
import { isNull as _isNull, omitBy as _omitBy } from 'lodash';

import { ElevatorRecordConnection } from '@/graphql/types/client/generated_types';
import {
  CreateRepairJobInput,
  ElevatorRecordFormData,
  QueryGetElevatorRecordsArgs,
  RepairJob,
  UpdateElevatorRecordInput,
} from '@/graphql/types/server/generated_types';
import { DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_OFFSET } from '@/shared/constants';

import {
  createElevatorRecordFilterOptions,
  createElevatorRecordSortOptions,
  fetchFormDropdownData,
  getSortedFormDropdownData,
  makeConnectionObject,
} from '../utils';

class ElevatorService {
  private prisma;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getElevatorRecords(args: QueryGetElevatorRecordsArgs): Promise<ElevatorRecordConnection> {
    const { paginationOptions, sortOptions, filterOptions } = args;

    const filters = createElevatorRecordFilterOptions(filterOptions);
    const orderBy = createElevatorRecordSortOptions(sortOptions);

    const elevatorRecords = await this.prisma.elevatorRecord.findMany({
      skip: paginationOptions?.offset ?? DEFAULT_PAGINATION_OFFSET,
      take: paginationOptions?.limit ?? DEFAULT_PAGINATION_LIMIT,
      where: filters,
      orderBy,
    });

    const totalItems = await this.prisma.elevatorRecord.count({
      where: filters,
    });

    return makeConnectionObject({
      items: elevatorRecords,
      totalItems,
      paginationOptions,
      getCursor: (elevatorRecord: ElevatorRecord) => elevatorRecord.id,
    });
  }

  async findElevatorRecordById(id: string): Promise<ElevatorRecord | null> {
    return await this.prisma.elevatorRecord.findUnique({
      where: { id },
    });
  }

  async findElevatorRecordByRepairJob(repairJob: RepairJob | null): Promise<ElevatorRecord | null> {
    return await this.prisma.elevatorRecord.findFirst({
      where: {
        buildingName: repairJob?.buildingName,
        elevatorLocation: repairJob?.elevatorLocation,
        elevatorType: repairJob?.elevatorType,
      },
    });
  }

  async getElevatorRecordFormData(): Promise<ElevatorRecordFormData> {
    const elevatorRecordFormData: Partial<ElevatorRecordFormData> = {};

    elevatorRecordFormData.elevatorTypes = await fetchFormDropdownData(
      () => getSortedFormDropdownData(this.prisma.elevatorTypes, 'elevator_types'),
      'elevator types'
    );

    elevatorRecordFormData.buildingNames = await fetchFormDropdownData(
      () => getSortedFormDropdownData(this.prisma.buildingNames, 'building_names'),
      'building names'
    );

    elevatorRecordFormData.elevatorLocations = await fetchFormDropdownData(
      () => getSortedFormDropdownData(this.prisma.elevatorLocations, 'locations'),
      'elevator locations'
    );

    elevatorRecordFormData.elevatorStatuses = await fetchFormDropdownData(
      () => getSortedFormDropdownData(this.prisma.elevatorStatuses, 'elevatorStatuses'),
      'elevator record statutes'
    );

    return elevatorRecordFormData as ElevatorRecordFormData;
  }

  async updateElevatorRecord(input: UpdateElevatorRecordInput): Promise<ElevatorRecord> {
    const { id, ...fieldsToUpdate } = input;

    return await this.prisma.elevatorRecord.update({
      where: { id },
      data: _omitBy(fieldsToUpdate, _isNull),
    });
  }

  async deleteElevatorRecord(id: string): Promise<ElevatorRecord> {
    return await this.prisma.elevatorRecord.delete({
      where: { id },
    });
  }

  async validateElevator(repairJobInput: CreateRepairJobInput): Promise<ElevatorRecord> {
    const elevatorRecord = await this.prisma.elevatorRecord.findFirst({
      where: {
        buildingName: repairJobInput.buildingName,
        elevatorLocation: repairJobInput.elevatorLocation,
        elevatorType: repairJobInput.elevatorType,
      },
    });

    // If no elevator record is found, throw an error
    if (!elevatorRecord) {
      throw new Error(
        `Elevator record with the combination of ${repairJobInput.buildingName}, ${repairJobInput.elevatorType} and ${repairJobInput.elevatorLocation} not found for the given details. Please revisit Elevator Management page for more information about available elevator records`
      );
    }

    return elevatorRecord;
  }

  async updateElevatorStatus(id: string, status?: string): Promise<ElevatorRecord> {
    return this.prisma.elevatorRecord.update({
      where: { id },
      data: { status },
    });
  }

  async updateElevatorMaintenanceDates(elevatorId: string): Promise<void> {
    const currentDate = new Date();
    // Calculate 6 months from now to determinepElevator nextMaintenanceDate
    const nextMaintenanceDate = addMonths(currentDate, 6);

    await this.prisma.elevatorRecord.update({
      where: { id: elevatorId },
      data: {
        lastMaintenanceDate: currentDate,
        nextMaintenanceDate,
      },
    });
  }
}

export default ElevatorService;
