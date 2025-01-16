import gql from 'graphql-tag';

export const GET_DASHBOARD_METRICS = gql`
  query GetDashboardMetrics {
    getDashboardMetrics {
      repairJobsMetrics {
        totalRepairJobs
        overdueRepairJobs
        ongoingRepairJobs
        completedRepairJobsToday
        scheduledRepairJobs
        inProgressRepairJobs
        cancelledRepairJobs
        onHoldRepairJobs
        completedRepairJobs
        lowPriorityRepairJobs
        mediumPriorityRepairJobs
        highPriorityRepairJobs
      }
      elevatorRecordsMetrics {
        totalElevatorRecords
        operationalElevators
        underMaintenanceElevators
        outOfServiceElevators
        pausedElevators
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
