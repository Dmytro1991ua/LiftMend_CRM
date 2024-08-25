import gql from 'graphql-tag';

export const GET_REPAIR_JOB_BY_ID = gql`
  query GetRepairJobById($id: ID!) {
    getRepairJobById(id: $id) {
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
  }
`;
