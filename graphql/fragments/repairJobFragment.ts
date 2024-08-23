import gql from 'graphql-tag';

export const REPAIR_JOB_FRAGMENT = gql`
  fragment RepairJobFields on RepairJob {
    id
    jobType
    jobDetails
    jobPriority
    elevatorType
    buildingName
    elevatorLocation
    technicianName
    technicianSkills
    contactInformation
    startDate
    endDate
    calendarEventId
  }
`;
