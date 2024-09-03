import gql from 'graphql-tag';

export const GET_REPAIR_JOB_FORM_DATA = gql`
  query GetRepairJobFromData {
    getRepairJobScheduleData {
      repairJobTypes
      elevatorTypes
      buildingNames
      elevatorLocations
      technicianNames
      technicianSkills
      priorities
      statuses
    }
  }
`;
