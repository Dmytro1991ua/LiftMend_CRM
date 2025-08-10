import { Readable } from 'stream';

import { MockedResponse } from '@apollo/client/testing';
import { GraphQLError } from 'graphql';
import { FileUpload } from 'graphql-upload/processRequest.mjs';

import { GET_USER } from '@/graphql/schemas';
import { GetUserQuery } from '@/graphql/types/client/generated_types';

export const mockUser = {
  id: 'test-user-id-1',
  email: 'test@gmail.com',
  firstName: 'Alex',
  lastName: 'Smith',
  phone: '+380667877878',
  createdAt: '2025-04-06T07:40:51.255Z',
  updatedAt: '2025-04-06T08:14:16.380Z',
  lastSignInAt: null,
  avatarUrl:
    'https://qgaqvfqcyjcewjnntzci.supabase.co/storage/v1/object/public/profile_pictures/test-user-id-1/userAvatar.jpg?v=1743927256298',
};

export const mockSupabaseUser = {
  id: 'test-id',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'test@gmail.com',
  email_confirmed_at: '2025-08-09T10:22:58.256976744Z',
  phone: '',
  last_sign_in_at: '2025-08-09T10:22:58.265607008Z',
  app_metadata: { provider: 'email', providers: ['email'] },
  user_metadata: {
    email: 'test@gmail.com',
    email_verified: true,
    name: 'Mike Arrow',
    phone_verified: false,
    sub: 'f647adad-df41-4725-b7b0-3f5d7267c0c2',
  },
  identities: [
    {
      identity_id: 'dae3e3e9-7b11-41d4-83cf-a065a03f6112',
      id: 'test-id',
      user_id: 'test-user-id',
      identity_data: [Object],
      provider: 'email',
      last_sign_in_at: '2025-08-09T10:22:58.241587835Z',
      created_at: '2025-08-09T10:22:58.241646Z',
      updated_at: '2025-08-09T10:22:58.241646Z',
      email: 'test@gmail.com',
    },
  ],
  created_at: '2025-08-09T10:22:58.223446Z',
  updated_at: '2025-08-09T10:22:58.278024Z',
  is_anonymous: false,
};

export const mockUserResponse: MockedResponse<GetUserQuery> = {
  request: {
    query: GET_USER,
    variables: {
      id: 'test-user-id-1',
    },
  },
  result: {
    data: {
      getUser: { ...mockUser, __typename: 'AppUser' },
    },
  },
};

export const mockUserGQLErrorResponse: MockedResponse<GetUserQuery> = {
  request: {
    query: GET_USER,
    variables: {
      id: 'test-user-id-1',
    },
  },
  result: {
    data: undefined,
    errors: [new GraphQLError('Test GQL error')],
  },
};

export const mockUserNetworkErrorResponse = {
  request: {
    query: GET_USER,
    variables: {
      id: 'test-user-id-1',
    },
  },
  result: {
    data: undefined,
    error: new Error('Network Error occurs'),
  },
};

export const createMockFile = (): FileUpload => {
  const stream = new Readable();
  stream._read = () => {}; // no-op for testing

  return {
    filename: 'test.png',
    mimetype: 'image/png',
    encoding: '7bit',
    createReadStream: () => stream,
  };
};
