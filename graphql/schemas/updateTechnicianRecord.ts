import gql from 'graphql-tag';

import { TECHNICIAN_RECORD_FRAGMENT } from '../fragments/technicianRecordFragment';

export const UPDATE_TECHNICIAN_RECORD = gql`
  mutation UpdateTechnicianRecord($input: UpdateTechnicianRecordInput!) {
    updateTechnicianRecord(input: $input) {
      id
      ...TechnicianRecordFields
    }
  }

  ${TECHNICIAN_RECORD_FRAGMENT}
`;
