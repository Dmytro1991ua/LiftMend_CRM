import gql from 'graphql-tag';

export const UPLOAD_PROFILE_PICTURE = gql`
  mutation UploadProfilePicture($file: Upload!) {
    uploadProfilePicture(file: $file) {
      id
      avatarUrl
    }
  }
`;
