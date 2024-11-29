import gql from 'graphql-tag';

export const GET_ELEVATOR_RECORD_FORM_DATA = gql`
  query GetElevatorRecordFormData {
    getElevatorRecordFormData {
      elevatorTypes
      buildingNames
      elevatorLocations
      elevatorStatuses
    }
  }
`;
