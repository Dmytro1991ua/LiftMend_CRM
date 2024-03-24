import { ApolloError } from '@apollo/client';
import { GraphQLError } from 'graphql';

export const apolloDefaultError: ApolloError = {
  extraInfo: undefined,
  message: '',
  name: '',
  networkError: null,
  stack: '',
  graphQLErrors: [
    {
      nodes: undefined,
      stack: undefined,
      originalError: undefined,
      source: undefined,
      positions: undefined,
      name: 'some error name',
      message: '422: Unprocessable Entity',
      locations: [
        {
          line: 2,
          column: 3,
        },
      ],
      path: ['updateLineItem'],
      extensions: {},
    },
  ] as unknown as GraphQLError[],
  protocolErrors: [],
  clientErrors: [],
};

export const messageError: ApolloError = {
  ...apolloDefaultError,
  graphQLErrors: [
    {
      ...apolloDefaultError.graphQLErrors[0],
      extensions: {
        response: {
          url: 'https://',
          status: 420,
          statusText: 'Unprocessable Entity',
          body: {
            error: {
              id: '2de83cd2-ef5a-4977-8fae-3b97099e12b0',
              status: '420 UNPROCESSABLE_ENTITY',
              name: 'INVALID_VALUE',
              message: 'Some message error here',
              details: null,
            },
          },
        },
      },
    },
  ] as unknown as GraphQLError[],
};

export const detailsError: ApolloError = {
  ...apolloDefaultError,
  graphQLErrors: [
    {
      ...apolloDefaultError.graphQLErrors[0],
      extensions: {
        response: {
          url: 'https://',
          status: 426,
          statusText: 'Unprocessable Entity',
          body: {
            error: {
              id: '2de83cd2-ef5a-4977-8fae-3b97099e12b0',
              status: '426 UNPROCESSABLE_ENTITY',
              name: 'INVALID_VALUE',
              message: null,
              details: [{ code: 'test code', issue: 'Some details error here' }],
            },
          },
        },
      },
    },
  ] as unknown as GraphQLError[],
};

export const detailsErrorWithMessage: ApolloError = {
  ...apolloDefaultError,
  graphQLErrors: [
    {
      ...apolloDefaultError.graphQLErrors[0],
      extensions: {
        response: {
          url: 'https://',
          status: 426,
          statusText: 'Unprocessable Entity',
          body: {
            error: {
              id: '2de83cd2-ef5a-4977-8fae-3b97099e12b0',
              status: '426 UNPROCESSABLE_ENTITY',
              name: 'INVALID_VALUE',
              message: 'Some message error here',
              details: [{ code: 'test code', issue: 'Some details error here' }],
            },
          },
        },
      },
    },
  ] as unknown as GraphQLError[],
};

export const bodyMessageError: ApolloError = {
  ...apolloDefaultError,
  graphQLErrors: [
    {
      ...apolloDefaultError.graphQLErrors[0],
      extensions: {
        response: {
          status: 409,
          body: {
            name: 'INVALID_VALUE',
            message: 'Some body message here',
          },
        },
      },
    },
  ] as unknown as GraphQLError[],
};

export const nullableResponse: ApolloError = {
  ...apolloDefaultError,
  graphQLErrors: [
    {
      ...apolloDefaultError.graphQLErrors[0],
      extensions: {
        response: null,
      },
    },
  ] as unknown as GraphQLError[],
};
