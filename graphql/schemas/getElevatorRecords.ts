import gql from 'graphql-tag';

import { ELEVATOR_RECORD_FRAGMENT } from '@/graphql/fragments';

export const GET_ELEVATOR_RECORDS = gql`
  query GetElevatorRecords($paginationOptions: PaginationOptions) {
    getElevatorRecords(paginationOptions: $paginationOptions) {
      edges {
        cursor
        node {
          ...ElevatorRecordFields
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

  ${ELEVATOR_RECORD_FRAGMENT}
`;
