import { ElevatorRecord, Prisma, PrismaClient } from '@prisma/client';
import { addMonths } from 'date-fns';
import { Maybe } from 'graphql/jsutils/Maybe';
import { isNull as _isNull, omitBy as _omitBy } from 'lodash';

import {
  CreateRepairJobInput,
  ElevatorRecordFormData,
  ElevatorRecordsMetrics,
  QueryGetElevatorRecordsArgs,
  UpdateElevatorRecordInput,
} from '@/graphql/types/server/generated_types';
import { DEFAULT_ELEVATOR_SCHEDULED_INTERVAL_MONTHS, ELEVATOR_MAINTENANCE_INTERVALS } from '@/shared/constants';

import {
  createElevatorRecordFilterOptions,
  createElevatorRecordSortOptions,
  fetchFormDropdownData,
  getSortedFormDropdownData,
  makeConnectionObject,
} from '../utils/utils';

import { ELEVATOR_STATUS_MAP, ELEVATOR_TYPE_MAP } from './constants';

class ElevatorService {
  private prisma;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getElevatorRecords(args: QueryGetElevatorRecordsArgs) {
    const { paginationOptions, sortOptions, filterOptions } = args;

    const filters = createElevatorRecordFilterOptions(filterOptions);
    const orderBy = createElevatorRecordSortOptions(sortOptions);

    const queryOptions: Prisma.ElevatorRecordFindManyArgs = {
      where: filters,
      orderBy,
    };

    if (paginationOptions) {
      queryOptions.skip = paginationOptions.offset ?? undefined;
      queryOptions.take = paginationOptions.limit ?? undefined;
    }

    const elevatorRecords = await this.prisma.elevatorRecord.findMany(queryOptions);

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

  async findElevatorRecordById(id: Maybe<string>): Promise<ElevatorRecord | null> {
    if (!id) {
      throw new Error('RepairJob missing elevatorId');
    }

    return await this.prisma.elevatorRecord.findUnique({
      where: { id },
    });
  }

  async findElevatorRecordByRepairJob(repairJob: CreateRepairJobInput | null): Promise<ElevatorRecord | null> {
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

  async getElevatorRecordsMetrics(): Promise<ElevatorRecordsMetrics> {
    const elevatorRecords = await this.getElevatorRecords({});

    const initialElevatorRecordsMetrics: ElevatorRecordsMetrics = {
      totalElevatorRecords: 0,
      operationalElevators: 0,
      outOfServiceElevators: 0,
      pausedElevators: 0,
      underMaintenanceElevators: 0,
      passengerElevators: 0,
      freightElevators: 0,
      serviceElevators: 0,
      homeElevators: 0,
      luxuryHighSpeedElevators: 0,
      vehicleParkingElevators: 0,
      specialtyElevators: 0,
    };

    const metrics = elevatorRecords.edges.reduce((acc, elevatorRecord) => {
      const statusKey = ELEVATOR_STATUS_MAP.get(elevatorRecord.node.status ?? '');
      const typeKey = ELEVATOR_TYPE_MAP.get(elevatorRecord.node.elevatorType);

      if (statusKey) {
        acc[statusKey as keyof ElevatorRecordsMetrics]++;
      }

      if (typeKey) {
        acc[typeKey as keyof ElevatorRecordsMetrics]++;
      }

      acc.totalElevatorRecords++;

      return acc;
    }, initialElevatorRecordsMetrics);

    return metrics;
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

  async updateElevatorStatus(id: string, status?: string): Promise<ElevatorRecord> {
    return this.prisma.elevatorRecord.update({
      where: { id },
      data: { status },
    });
  }

  async updateElevatorMaintenanceDates(elevatorId: string, elevatorType: string): Promise<void> {
    const currentDate = new Date();

    // Determine maintenance interval in months based on elevator type
    const maintenanceIntervalMonths =
      ELEVATOR_MAINTENANCE_INTERVALS[elevatorType] ?? DEFAULT_ELEVATOR_SCHEDULED_INTERVAL_MONTHS;

    // Calculate next maintenance date based on interval
    const nextMaintenanceDate = addMonths(currentDate, maintenanceIntervalMonths);

    await this.prisma.elevatorRecord.update({
      where: { id: elevatorId },
      data: {
        lastMaintenanceDate: currentDate,
        nextMaintenanceDate,
      },
    });
  }

  async completeElevatorInspection(elevatorId: string): Promise<ElevatorRecord> {
    const currentDate = new Date();

    const nextInspectionDate = addMonths(currentDate, DEFAULT_ELEVATOR_SCHEDULED_INTERVAL_MONTHS);

    return this.prisma.elevatorRecord.update({
      where: { id: elevatorId },
      data: {
        lastInspectionDate: currentDate,
        nextInspectionDate,
      },
    });
  }
}

export default ElevatorService;
