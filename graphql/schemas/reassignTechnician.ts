import gql from 'graphql-tag';

import { REPAIR_JOB_FRAGMENT } from '../fragments';

export const REASSIGN_TECHNICIAN = gql`
  mutation ReassignTechnician($input: UpdateRepairJobInput!) {
    reassignTechnician(input: $input) {
      id
      ...RepairJobFields
    }
  }
  ${REPAIR_JOB_FRAGMENT}
`;
