import gql from 'graphql-tag';

export const GET_ELEVATOR_DETAILS_BY_BUILDING_NAME = gql`
  query GetElevatorDetailsByBuildingName($buildingName: String!, $selectedElevatorType: String) {
    getElevatorDetailsByBuildingName(buildingName: $buildingName, selectedElevatorType: $selectedElevatorType) {
      elevatorTypes
      elevatorLocations
    }
  }
`;
