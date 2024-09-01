import gql from 'graphql-tag';

import { REPAIR_JOB_FRAGMENT } from '@/graphql/fragments';

export const GET_REPAIR_JOBS = gql`
  query GetRepairJobs($paginationOptions: PaginationOptions) {
    getRepairJobs(paginationOptions: $paginationOptions) {
      edges {
        cursor
        node {
          ...RepairJobFields
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      total
    }
  }

  ${REPAIR_JOB_FRAGMENT}
`;
