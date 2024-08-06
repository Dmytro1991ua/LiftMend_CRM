import gql from 'graphql-tag';

export const GET_REPAIR_JOB_SCHEDULE_DATA = gql`
  query GET_REPAIR_JOB_SCHEDULE_DATA {
    getRepairJobScheduleData {
      repairJobTypes
      elevatorTypes
      buildingNames
      elevatorLocations
      technicianNames
      technicianSkills
      priorities
    }
  }
`;
