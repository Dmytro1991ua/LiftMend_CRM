import gql from 'graphql-tag';

import { REPAIR_JOB_FRAGMENT } from '../fragments';

export const GET_REPAIR_JOB_BY_ID = gql`
  query GetRepairJobById($id: ID!) {
    getRepairJobById(id: $id) {
      status
      ...RepairJobFields
    }
  }

  ${REPAIR_JOB_FRAGMENT}
`;
