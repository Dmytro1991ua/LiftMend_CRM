import gql from 'graphql-tag';

export const TECHNICIAN_RECORD_FRAGMENT = gql`
  fragment TechnicianRecordFields on TechnicianRecord {
    id
    name
    contactInformation
    skills
    certifications
    availabilityStatus
    employmentStatus
    lastKnownAvailabilityStatus
    performanceMetrics {
      activeRepairJobs
      onTimeCompletionRate
      overdueRepairJobs
      totalRepairJobs
      completedRepairJobs
      averageDurationDays
      performanceScore
    }
  }
`;
