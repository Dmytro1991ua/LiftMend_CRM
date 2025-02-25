import gql from 'graphql-tag';

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    signUp(input: $input) {
      id
    }
  }
`;
