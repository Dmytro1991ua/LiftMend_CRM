import gql from 'graphql-tag';

export const GET_USER = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      email
      firstName
      lastName
      phone
      createdAt
      updatedAt
      lastSignInAt
      avatarUrl
    }
  }
`;
