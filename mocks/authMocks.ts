import { MockedResponse } from '@apollo/client/testing';
import { GraphQLError } from 'graphql';

import { SIGN_OUT_USER } from '@/graphql/schemas';
import { LoginUserMutation, SignOutUserMutation } from '@/graphql/types/client/generated_types';

import { LOGIN_USER } from './../graphql/schemas/loginUser';

export const mockSignedInUserResponse = {
  id: 'test-user-id-1',
};

export const mockLoginUserData = {
  email: 'testUser123dp@gmail.com',
  password: '@TestPassword123@',
};

export const mockUserLoginResponse: MockedResponse<LoginUserMutation> = {
  request: {
    query: LOGIN_USER,
    variables: {
      input: {
        ...mockLoginUserData,
      },
    },
  },
  result: {
    data: {
      signIn: {
        ...mockSignedInUserResponse,
        __typename: 'AuthResponse',
      },
    },
  },
};

export const mockUserLoginGQLErrorResponse: MockedResponse<LoginUserMutation> = {
  request: {
    query: LOGIN_USER,
    variables: {
      input: {
        ...mockLoginUserData,
      },
    },
  },
  result: {
    data: undefined,
    errors: [new GraphQLError('Test error')],
  },
};

export const mockUserLoginNetworkErrorResponse = {
  request: {
    query: LOGIN_USER,
    variables: {
      input: {
        ...mockLoginUserData,
      },
    },
  },
  result: {
    data: undefined,
    error: new Error('Error occurs'),
  },
};

export const mockSignOutResponse: MockedResponse<SignOutUserMutation> = {
  request: {
    query: SIGN_OUT_USER,
    variables: {},
  },
  result: {
    data: {
      signOut: true,
    },
  },
};
