import gql from 'graphql-tag';

export const NOTIFICATION_FRAGMENT = gql`
  fragment NotificationFields on Notification {
    id
    userId
    category
    relatedEntityId
    message
    priority
    status
    createdAt
    readAt
  }
`;
