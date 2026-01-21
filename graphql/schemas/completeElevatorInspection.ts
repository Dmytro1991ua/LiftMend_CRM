import gql from 'graphql-tag';

import { ELEVATOR_RECORD_FRAGMENT } from '../fragments';

export const COMPLETE_ELEVATOR_INSPECTION = gql`
  mutation CompleteElevatorInspection($elevatorId: ID!) {
    completeElevatorInspection(elevatorId: $elevatorId) {
      id
      ...ElevatorRecordFields
    }
  }
  ${ELEVATOR_RECORD_FRAGMENT}
`;
