import gql from 'graphql-tag';

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UserProfileInput!) {
    updateUserProfile(input: $input) {
      id
      firstName
      lastName
      phone
    }
  }
`;
