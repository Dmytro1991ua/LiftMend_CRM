import gql from 'graphql-tag';

import { ELEVATOR_RECORD_FRAGMENT } from '@/graphql/fragments';

export const GET_ELEVATOR_RECORDS = gql`
  query GetElevatorRecords($paginationOptions: PaginationOptions, $filterOptions: ElevatorRecordFilterOptions) {
    getElevatorRecords(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {
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
