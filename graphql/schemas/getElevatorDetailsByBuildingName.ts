import gql from 'graphql-tag';

export const GET_ELEVATOR_DETAILS_BY_BUILDING_NAME = gql`
  query GetElevatorDetailsByBuildingName($buildingName: String!) {
    getElevatorDetailsByBuildingName(buildingName: $buildingName) {
      elevatorTypes
      elevatorLocations
    }
  }
`;
