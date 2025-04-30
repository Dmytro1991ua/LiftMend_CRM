import { MockedResponse } from '@apollo/client/testing';
import { GraphQLError } from 'graphql';

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
