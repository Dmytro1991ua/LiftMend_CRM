import gql from 'graphql-tag';

import { ELEVATOR_RECORD_FRAGMENT } from '../fragments';

export const UPDATE_ELEVATOR_RECORD = gql`
  mutation UpdateElevatorRecord($input: UpdateElevatorRecordInput!) {
    updateElevatorRecord(input: $input) {
      id
      ...ElevatorRecordFields
    }
  }
  ${ELEVATOR_RECORD_FRAGMENT}
`;
