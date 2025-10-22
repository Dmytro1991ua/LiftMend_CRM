import gql from 'graphql-tag';

export const DELETE_ACCOUNT = gql`
  mutation DeleteAccount($userId: ID!) {
    removeAccount(userId: $userId) {
      userId
    }
  }
`;
