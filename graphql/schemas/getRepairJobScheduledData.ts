import gql from 'graphql-tag';

export const GET_REPAIR_JOB_SCHEDULED_DATA = gql`
  query GET_REPAIR_JOB_SCHEDULED_DATA {
    getCalendarEvents {
      allDay
      end
      id
      start
      title
      description
      repairJobId
    }
    getRepairJobs {
      id
      jobType
      jobDetails
      elevatorType
      buildingName
      elevatorLocation
      technicianName
      technicianSkills
      contactInformation
      startDate
      endDate
    }
  }
`;
