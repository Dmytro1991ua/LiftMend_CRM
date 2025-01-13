import gql from 'graphql-tag';

export const GET_DASHBOARD_METRICS = gql`
  query GetDashboardMetrics {
    getDashboardMetrics {
      repairJobsMetrics {
        totalRepairJobs
        overdueRepairJobs
        ongoingRepairJobs
        completedRepairJobsToday
      }
      elevatorRecordsMetrics {
        totalElevatorRecords
      }
      technicianRecordsMetrics {
        totalTechnicianRecords
        availableTechnicians
        busyTechnicians
        onLeaveTechnicians
        inactiveTechnicians
        unavailableTechnicians
        reservedTechnicians
      }
    }
  }
`;
