import gql from 'graphql-tag';

export const GET_DASHBOARD_METRICS = gql`
  query GetDashboardMetrics($startDate: String!, $endDate: String!) {
    getDashboardMetrics(startDate: $startDate, endDate: $endDate) {
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
        repairJobs
        mentainanceJobs
        installationJobs
        inspectionJobs
        upgradeJobs
        emergencyJobs
        routineJobs
        consultationJobs
        modernizationJobs
        complianceJobs
      }
      elevatorRecordsMetrics {
        totalElevatorRecords
        operationalElevators
        underMaintenanceElevators
        outOfServiceElevators
        pausedElevators
        passengerElevators
        freightElevators
        serviceElevators
        homeElevators
        luxuryHighSpeedElevators
        vehicleParkingElevators
        specialtyElevators
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
