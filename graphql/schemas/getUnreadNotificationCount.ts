import gql from 'graphql-tag';

export const GET_UNREAD_NOTIFICATIONS_COUNT = gql`
  query GetUnreadNotificationsCount {
    getUnreadNotificationCount
  }
`;
