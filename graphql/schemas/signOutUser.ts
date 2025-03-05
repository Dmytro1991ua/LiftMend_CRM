import gql from 'graphql-tag';

export const SIGN_OUT_USER = gql`
  mutation SignOutUser {
    signOut
  }
`;
