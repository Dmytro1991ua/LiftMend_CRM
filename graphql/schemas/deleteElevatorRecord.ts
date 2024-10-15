import gql from 'graphql-tag';

export const DELETE_ELEVATOR_RECORD = gql`
  mutation DeleteElevatorRecord($id: ID!) {
    deleteElevatorRecord(id: $id) {
      id
    }
  }
`;
