import gql from 'graphql-tag';

export const LOGIN_USER = gql`
  mutation LoginUser($input: SignInUserInput!) {
    signIn(input: $input) {
      id
    }
  }
`;
