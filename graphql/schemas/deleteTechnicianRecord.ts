import gql from 'graphql-tag';

export const DELETE_TECHNICIAN_RECORD = gql`
  mutation DeleteTechnicianRecord($id: ID!) {
    deleteTechnicianRecord(id: $id) {
      id
    }
  }
`;
