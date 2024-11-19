import gql from 'graphql-tag';

import { TECHNICIAN_RECORD_FRAGMENT } from '../fragments';

export const GET_TECHNICIAN_RECORDS = gql`
  query GetTechnicianRecords(
    $paginationOptions: PaginationOptions
    $filterOptions: TechnicianRecordFilterOptions
    $sortOptions: TechnicianRecordSortInput
  ) {
    getTechnicianRecords(
      paginationOptions: $paginationOptions
      filterOptions: $filterOptions
      sortOptions: $sortOptions
    ) {
      edges {
        cursor
        node {
          ...TechnicianRecordFields
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

  ${TECHNICIAN_RECORD_FRAGMENT}
`;
