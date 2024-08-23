import gql from 'graphql-tag';

import { REPAIR_JOB_FRAGMENT } from '../fragments';

export const UPDATE_REPAIR_JOB = gql`
  mutation UpdateRepairJob($input: UpdateRepairJobInput!) {
    updateRepairJob(input: $input) {
      id
      ...RepairJobFields
    }
  }
  ${REPAIR_JOB_FRAGMENT}
`;
