import gql from 'graphql-tag';

import { NOTIFICATION_FRAGMENT } from '../fragments/notificationFragment';

export const GET_NOTIFICATIONS = gql`
  query GetNotifications($paginationOptions: PaginationOptions, $filterOptions: NotificationFilterOptions) {
    getNotifications(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {
      edges {
        cursor
        node {
          ...NotificationFields
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

  ${NOTIFICATION_FRAGMENT}
`;
