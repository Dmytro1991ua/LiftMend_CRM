import gql from 'graphql-tag';

import { ELEVATOR_RECORD_FRAGMENT } from '../fragments';

export const GET_ELEVATOR_RECORD_BY_ID = gql`
  query GetElevatorRecordById($id: ID!) {
    getElevatorRecordById(id: $id) {
      ...ElevatorRecordFields
    }
  }

  ${ELEVATOR_RECORD_FRAGMENT}
`;
