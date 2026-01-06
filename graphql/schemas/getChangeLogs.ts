import gql from 'graphql-tag';

import { CHANGE_LOG_FRAGMENT } from '../fragments/changeLogFragment';

export const GET_CHANGE_LOGS = gql`
  query GetChangeLogs($paginationOptions: PaginationOptions, $filterOptions: ChangeLogFilterOptions) {
    getChangeLogs(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {
      edges {
        cursor
        node {
          ...ChangeLogFields
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

  ${CHANGE_LOG_FRAGMENT}
`;
