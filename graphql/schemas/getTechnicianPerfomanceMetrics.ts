import gql from 'graphql-tag';

export const GET_TECHNICIAN_PERFORMANCE_METRICS = gql`
  query GetTechnicianPerformanceMetrics($technicianName: String!) {
    getTechnicianPerformance(technicianName: $technicianName) {
      activeRepairJobs
      totalRepairJobs
      onTimeCompletionRate
      overdueRepairJobs
      averageDurationDays
      completedRepairJobs
    }
  }
`;
