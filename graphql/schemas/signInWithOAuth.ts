import gql from 'graphql-tag';

export const SIGN_IN_WITH_OAUTH = gql`
  mutation SignInWithOAuth($input: SignInWithOAuthInput!) {
    signInWithOAuth(input: $input)
  }
`;
