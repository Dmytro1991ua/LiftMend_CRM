import { MockedResponse } from '@apollo/client/testing';

import { GET_DASHBOARD_METRICS } from '@/graphql/schemas/getDashboardMetrics';
import { GetDashboardMetricsQuery } from '@/graphql/types/client/generated_types';
import { DashboardDateFilter } from '@/modules/dashboard/types';

export const mockRepairJobMetrics = {
  totalRepairJobs: 0,
  overdueRepairJobs: 0,
  ongoingRepairJobs: 0,
  completedRepairJobsToday: 0,
  scheduledRepairJobs: 0,
  inProgressRepairJobs: 0,
  cancelledRepairJobs: 0,
  onHoldRepairJobs: 0,
  completedRepairJobs: 0,
  lowPriorityRepairJobs: 0,
  mediumPriorityRepairJobs: 0,
  highPriorityRepairJobs: 0,
  repairJobs: 0,
  mentainanceJobs: 0,
  installationJobs: 0,
  inspectionJobs: 0,
  upgradeJobs: 0,
  emergencyJobs: 0,
  routineJobs: 0,
  consultationJobs: 0,
  modernizationJobs: 0,
  complianceJobs: 0,
};

export const mockElevatorRecordMetrics = {
  totalElevatorRecords: 74,
  operationalElevators: 72,
  underMaintenanceElevators: 2,
  outOfServiceElevators: 0,
  pausedElevators: 0,
  passengerElevators: 19,
  freightElevators: 10,
  serviceElevators: 6,
  homeElevators: 12,
  luxuryHighSpeedElevators: 5,
  vehicleParkingElevators: 5,
  specialtyElevators: 9,
};

export const mockTechnicianRecordMetrics = {
  totalTechnicianRecords: 22,
  availableTechnicians: 20,
  busyTechnicians: 2,
  onLeaveTechnicians: 0,
  inactiveTechnicians: 0,
  unavailableTechnicians: 0,
  reservedTechnicians: 0,
};

export const mockDashboardMetricsProps = {
  dashboardMetrics: {
    repairJobsMetrics: mockRepairJobMetrics,
    elevatorRecordsMetrics: mockElevatorRecordMetrics,
    technicianRecordsMetrics: mockTechnicianRecordMetrics,
  },
  classname: '',
  loading: false,
  error: undefined,
};

export const mockExpectedDashboardMetricsData = {
  elevatorRecordsMetrics: {
    freightElevators: 10,
    homeElevators: 12,
    luxuryHighSpeedElevators: 5,
    operationalElevators: 72,
    outOfServiceElevators: 0,
    passengerElevators: 19,
    pausedElevators: 0,
    serviceElevators: 6,
    specialtyElevators: 9,
    totalElevatorRecords: 74,
    underMaintenanceElevators: 2,
    vehicleParkingElevators: 5,
  },
  repairJobsMetrics: {
    cancelledRepairJobs: 0,
    completedRepairJobs: 0,
    completedRepairJobsToday: 0,
    complianceJobs: 0,
    consultationJobs: 0,
    emergencyJobs: 0,
    highPriorityRepairJobs: 0,
    inProgressRepairJobs: 0,
    inspectionJobs: 0,
    installationJobs: 0,
    lowPriorityRepairJobs: 0,
    mediumPriorityRepairJobs: 0,
    mentainanceJobs: 0,
    modernizationJobs: 0,
    onHoldRepairJobs: 0,
    ongoingRepairJobs: 0,
    overdueRepairJobs: 0,
    repairJobs: 0,
    routineJobs: 0,
    scheduledRepairJobs: 0,
    totalRepairJobs: 0,
    upgradeJobs: 0,
  },
  technicianRecordsMetrics: {
    availableTechnicians: 20,
    busyTechnicians: 2,
    inactiveTechnicians: 0,
    onLeaveTechnicians: 0,
    reservedTechnicians: 0,
    totalTechnicianRecords: 22,
    unavailableTechnicians: 0,
  },
};

export const getDashboardMetricsResponseMock = (
  dateRange: DashboardDateFilter
): MockedResponse<GetDashboardMetricsQuery> => {
  return {
    request: {
      query: GET_DASHBOARD_METRICS,
      variables: {
        startDate: dateRange?.from?.toISOString(),
        endDate: dateRange?.to?.toISOString(),
      },
    },
    result: {
      data: {
        getDashboardMetrics: mockExpectedDashboardMetricsData,
      },
    },
  };
};

export const getDashboardMetricsErrorMock = (
  dateRange: DashboardDateFilter
): MockedResponse<GetDashboardMetricsQuery> => {
  return {
    request: {
      query: GET_DASHBOARD_METRICS,
      variables: {
        startDate: dateRange?.from?.toISOString(),
        endDate: dateRange?.to?.toISOString(),
      },
    },
    error: new Error('Something went wrong'),
  };
};
