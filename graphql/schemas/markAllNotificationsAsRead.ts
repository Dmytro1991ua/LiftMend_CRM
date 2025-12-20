import gql from 'graphql-tag';

export const MARK_ALL_NOTIFICATIONs_AS_READ = gql`
  mutation MarkAllNotificationsAsRead {
    markAllNotificationsAsRead {
      updatedNotificationIds
    }
  }
`;
