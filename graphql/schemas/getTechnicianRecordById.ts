import gql from 'graphql-tag';

import { TECHNICIAN_RECORD_FRAGMENT } from '../fragments';

export const GET_TECHNICIAN_RECORD_BY_ID = gql`
  query GetTechnicianRecordById($id: ID!) {
    getTechnicianRecordById(id: $id) {
      ...TechnicianRecordFields
    }
  }

  ${TECHNICIAN_RECORD_FRAGMENT}
`;
