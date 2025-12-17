import gql from 'graphql-tag';

import { NOTIFICATION_FRAGMENT } from '../fragments/notificationFragment';

export const MARK_NOTIFICATION_AS_READ = gql`
  mutation MarkNotificationAsRead($input: MarkNotificationAsReadInput!) {
    markNotificationAsRead(input: $input) {
      id
      ...NotificationFields
    }
  }
  ${NOTIFICATION_FRAGMENT}
`;
