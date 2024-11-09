import gql from 'graphql-tag';

import { TECHNICIAN_RECORD_FRAGMENT } from '../fragments';

export const CREATE_TECHNICIAN_RECORD = gql`
  mutation CreateTechnicianRecord($input: CreateTechnicianRecordInput!) {
    createTechnicianRecord(input: $input) {
      ...TechnicianRecordFields
    }
  }
  ${TECHNICIAN_RECORD_FRAGMENT}
`;
