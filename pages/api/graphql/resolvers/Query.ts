import { orderBy as _orderBy } from 'lodash';

import {
  AppUser,
  CalendarEvent,
  DashboardMetrics,
  ElevatorRecord,
  ElevatorRecordConnection,
  ElevatorRecordFormData,
  QueryResolvers,
  RepairJob,
  RepairJobConnection,
  RepairJobScheduleData,
  TechnicianPerformanceMetrics,
  TechnicianRecord,
  TechnicianRecordConnection,
  TechnicianRecordFormData,
} from '@/graphql/types/server/generated_types';

const Query: QueryResolvers = {
  getRepairJobScheduleData: async (_, __, { dataSources }): Promise<RepairJobScheduleData> => {
    return dataSources.repairJob.getRepairJobScheduleData();
  },
  getCalendarEvents: async (_, __, { dataSources }): Promise<CalendarEvent[]> => {
    return dataSources.calendarEvent.getCalendarEvents();
  },
  getRepairJobs: async (_, args, { dataSources }): Promise<RepairJobConnection> => {
    return await dataSources.repairJob.getRepairJobs(args);
  },
  getRepairJobById: async (_, { id }, { dataSources }): Promise<RepairJob> => {
    const repairJob = await dataSources.repairJob.findRepairJobById(id);

    return repairJob as RepairJob;
  },
  getElevatorDetailsByBuildingName: async (_, { buildingName }, { dataSources }) => {
    return await dataSources.repairJob.getElevatorDetailsByBuildingName(buildingName);
  },
  getElevatorRecordFormData: async (_, __, { dataSources }): Promise<ElevatorRecordFormData> => {
    return await dataSources.elevatorRecord.getElevatorRecordFormData();
  },
  getElevatorRecords: async (_, args, { dataSources }): Promise<ElevatorRecordConnection> => {
    return await dataSources.elevatorRecord.getElevatorRecords(args);
  },
  getElevatorRecordById: async (_, { id }, { dataSources }): Promise<ElevatorRecord> => {
    const elevatorRecord = await dataSources.elevatorRecord.findElevatorRecordById(id);

    return elevatorRecord as ElevatorRecord;
  },
  getTechnicianRecords: async (_, args, { dataSources }): Promise<TechnicianRecordConnection> => {
    return await dataSources.technicianRecord.getTechnicianRecords(args);
  },
  getTechnicianRecordFormData: async (_, __, { dataSources }): Promise<TechnicianRecordFormData> => {
    return await dataSources.technicianRecord.getTechnicianRecordFormData();
  },
  getTechnicianRecordById: async (_, { id }, { dataSources }): Promise<TechnicianRecord> => {
    const technicianRecord = await dataSources.technicianRecord.findTechnicianRecordById(id);

    return technicianRecord as TechnicianRecord;
  },
  getAvailableTechniciansForAssignment: async (_, __, { dataSources }): Promise<TechnicianRecord[]> => {
    const technicianRecord = await dataSources.technicianRecord.getAvailableTechniciansForAssignment();

    return _orderBy(technicianRecord, ['name'], 'asc');
  },
  getDashboardMetrics: async (_, { startDate, endDate }, { dataSources }): Promise<DashboardMetrics> => {
    const [repairJobsMetrics, elevatorRecordsMetrics, technicianRecordsMetrics] = await Promise.all([
      dataSources.repairJob.getRepairJobsMetrics(startDate, endDate),
      dataSources.elevatorRecord.getElevatorRecordsMetrics(),
      dataSources.technicianRecord.getTechnicianRecordsMetrics(),
    ]);

    return {
      repairJobsMetrics,
      elevatorRecordsMetrics,
      technicianRecordsMetrics,
    };
  },
  getUser: async (_, { id }, { dataSources }): Promise<AppUser> => {
    return await dataSources.user.user(id);
  },
  getRecentRepairJobs: async (_, { jobsCount }, { dataSources }): Promise<RepairJob[]> => {
    return await dataSources.repairJob.recentRepairJobs(jobsCount);
  },
  getElevatorMentainanceHistory: async (_, args, { dataSources }): Promise<RepairJobConnection> => {
    return await dataSources.repairJob.elevatorMentainanceHistory(args);
  },
  getTechnicianPerformance: async (_, { technicianName }, { dataSources }): Promise<TechnicianPerformanceMetrics> => {
    return await dataSources.repairJob.technicianPerformanceMetrics(technicianName);
  },
};

export default Query;
