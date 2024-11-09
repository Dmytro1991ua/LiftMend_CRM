import gql from 'graphql-tag';

import { TECHNICIAN_RECORD_FRAGMENT } from '../fragments';

export const GET_TECHNICIAN_RECORDS = gql`
  query GetTechnicianRecords($paginationOptions: PaginationOptions) {
    getTechnicianRecords(paginationOptions: $paginationOptions) {
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
