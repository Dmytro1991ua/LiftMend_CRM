import gql from 'graphql-tag';

import { ELEVATOR_RECORD_FRAGMENT } from '../fragments';

export const CREATE_ELEVATOR_RECORD = gql`
  mutation CreateElevatorRecord($input: CreateElevatorRecordInput!) {
    createElevatorRecord(input: $input) {
      ...ElevatorRecordFields
    }
  }
  ${ELEVATOR_RECORD_FRAGMENT}
`;
