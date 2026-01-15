import gql from 'graphql-tag';

export const ELEVATOR_RECORD_FRAGMENT = gql`
  fragment ElevatorRecordFields on ElevatorRecord {
    id
    elevatorType
    buildingName
    elevatorLocation
    lastMaintenanceDate
    nextMaintenanceDate
    capacity
    status
    lastKnownStatus
    healthScore
    lastInspectionDate
    nextInspectionDate
  }
`;
