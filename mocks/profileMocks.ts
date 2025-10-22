import { MockedResponse } from '@apollo/client/testing';
import { GraphQLError } from 'graphql';

import { UPLOAD_PROFILE_PICTURE } from '@/graphql/schemas';
import { DELETE_ACCOUNT } from '@/graphql/schemas/deleteAccount';
import { UPDATE_PROFILE } from '@/graphql/schemas/updateProfile';
import {
  DeleteAccountMutation,
  UpdateProfileMutation,
  UploadProfilePictureMutation,
} from '@/graphql/types/client/generated_types';

export const mockUpdatedProfile = {
  id: 'test-user-id-1',
  firstName: 'Mike',
  lastName: 'Smith',
  phone: '+380667877777',
};

export const mockUploadFile = {
  path: './test.jpeg',
  relativePath: './test.jpeg',
  lastModified: 1741430159661,
  name: 'png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png',
  size: 7413,
  type: 'image/png',
  webkitRelativePath: '',
};

export const mockUploadProfilePicture = {
  id: 'test-user-id-1',
  avatarUrl:
    'https://qgaqvfqcyjcewjnntzci.supabase.co/storage/v1/object/public/profile_pictures/test-user-id-1/userAvatar.jpg?v=1745870309882',
};

export const mockUpdateProfileResponse: MockedResponse<UpdateProfileMutation> = {
  request: {
    query: UPDATE_PROFILE,
    variables: {
      input: {
        ...mockUpdatedProfile,
      },
    },
  },
  result: {
    data: {
      updateUserProfile: {
        ...mockUpdatedProfile,
        __typename: 'AppUser',
      },
    },
    errors: [],
  },
};

export const mockUpdateProfileGQLErrorResponse: MockedResponse<UploadProfilePictureMutation> = {
  request: {
    query: UPDATE_PROFILE,
    variables: {
      input: {
        ...mockUpdatedProfile,
      },
    },
  },
  result: {
    data: undefined,
    errors: [new GraphQLError('Test GQL error')],
  },
};

export const mockUpdateProfileNetworkErrorResponse = {
  request: {
    query: UPDATE_PROFILE,
    variables: {
      input: {
        ...mockUpdatedProfile,
      },
    },
  },
  result: {
    data: undefined,
    error: new Error('Network Error occurs'),
  },
};

export const mockUpdateProfilePictureResponse: MockedResponse<UploadProfilePictureMutation> = {
  request: {
    query: UPLOAD_PROFILE_PICTURE,
    variables: {
      input: {
        ...mockUploadFile,
      },
    },
  },
  result: {
    data: {
      uploadProfilePicture: {
        ...mockUploadProfilePicture,
        __typename: 'UploadProfilePicturePayload',
      },
    },
    errors: [],
  },
};

export const mockUpdateProfilePictureGQLErrorResponse: MockedResponse<UploadProfilePictureMutation> = {
  request: {
    query: UPLOAD_PROFILE_PICTURE,
    variables: {
      input: {
        ...mockUploadFile,
      },
    },
  },
  result: {
    data: undefined,
    errors: [new GraphQLError('Test GQL error')],
  },
};

export const mockUpdateProfilePictureNetworkErrorResponse = {
  request: {
    query: UPLOAD_PROFILE_PICTURE,
    variables: {
      input: {
        ...mockUploadFile,
      },
    },
  },
  result: {
    data: undefined,
    error: new Error('Network Error occurs'),
  },
};

export const mockDeleteUserAccountResponse: MockedResponse<DeleteAccountMutation> = {
  request: {
    query: DELETE_ACCOUNT,
    variables: {
      userId: 'test-user-id-1',
    },
  },
  result: {
    data: {
      removeAccount: {
        userId: 'test-user-id-1',
      },
    },
    errors: [],
  },
};

export const mockDeleteUserAccountGqlErrorResponse: MockedResponse<DeleteAccountMutation> = {
  request: {
    query: DELETE_ACCOUNT,
    variables: {
      userId: 'test-user-id-1',
    },
  },
  result: {
    data: undefined,
    errors: [new GraphQLError('Test GQL error')],
  },
};

export const mockDeleteUserAccountNetworkErrorResponse = {
  request: {
    query: DELETE_ACCOUNT,
    variables: {
      userId: 'test-user-id-1',
    },
  },
  result: {
    data: undefined,
    error: new Error('Network Error occurs'),
  },
};
