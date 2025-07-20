import { ApolloError, FieldFunctionOptions, FieldMergeFunction } from '@apollo/client';
import Cookies from 'js-cookie';

import {
  apolloDefaultError,
  bodyMessageError,
  detailsError,
  detailsErrorWithMessage,
  messageError,
  multipleBodyDetailsError,
  nullableResponse,
  updateRepairJobGraphQLErrorMock,
} from '@/mocks/errorResponse';

import {
  concatPaginationWithEdges,
  createGraphQLErrorMap,
  findValueInArray,
  getErrorMessageFromGraphQlErrors,
  getGraphQLErrorExtensionsMessage,
  getSupabaseToken,
  handleGraphQLErrors,
} from '../../graphql/utils';

jest.mock('js-cookie', () => ({
  get: jest.fn(),
}));

describe('handleGraphQLErrors', () => {
  it('should successfully create error map from array of graphql errors', () => {
    expect(createGraphQLErrorMap(messageError.graphQLErrors)).toEqual({
      420: ['Some message error here'],
    });
  });
  it('should show message error', () => {
    expect(handleGraphQLErrors(messageError)).toEqual({
      420: ['Some message error here'],
    });
  });
  it('should show details error', () => {
    expect(handleGraphQLErrors(detailsError)).toEqual({
      426: ['Some details error here'],
    });
  });
  it('should return body message if body error is unavailable', () => {
    expect(handleGraphQLErrors(bodyMessageError)).toEqual({
      409: ['Some body message here', 'INVALID_VALUE'],
    });
  });
  it('should return empty object if method does not exist in object', () => {
    expect(handleGraphQLErrors(nullableResponse)).toEqual({});
  });
  it('should return empty object if extensions method is empty', () => {
    expect(handleGraphQLErrors(apolloDefaultError)).toEqual({});
  });
});

describe('getErrorMessageFromGraphQlErrors', () => {
  it('should create valid error message when extensions data exist', () => {
    expect(getErrorMessageFromGraphQlErrors(detailsError.graphQLErrors)).toEqual('Some details error here');
  });

  it('should return error message from graphQLErrors when only message is provided', () => {
    expect(getErrorMessageFromGraphQlErrors(messageError.graphQLErrors)).toEqual('Some message error here');
  });

  it('should create valid error message when extensions data consist detail error and error message', () => {
    const actualResult = getErrorMessageFromGraphQlErrors(detailsErrorWithMessage.graphQLErrors);
    const expectedResult = ['Some details error here', 'Some message error here'].join('\r\n');

    expect(actualResult).toEqual(expectedResult);
  });

  it('should return error message with status code when graphQLErrors includes 422 Unprocessable Entity', () => {
    expect(getErrorMessageFromGraphQlErrors(apolloDefaultError.graphQLErrors)).toEqual('422: Unprocessable Entity');
  });

  it('should create valid error message, when body has multiple errors', () => {
    const actualResult = getErrorMessageFromGraphQlErrors(multipleBodyDetailsError.graphQLErrors);
    const expectedResult = ['Some details error here', 'Error message!'].join('\r\n');

    expect(actualResult).toEqual(expectedResult);
  });
});

describe('getGraphQLErrorExtensionsMessage', () => {
  const defaultFields = {
    extraInfo: undefined,
    message: '',
    name: '',
    networkError: undefined,
    stack: '',
  };

  it('should return correct results', () => {
    expect(
      getGraphQLErrorExtensionsMessage({
        ...defaultFields,
        graphQLErrors: [
          {
            ...updateRepairJobGraphQLErrorMock,
            nodes: undefined,
            stack: undefined,
            originalError: null,
            source: undefined,
            positions: undefined,
            name: 'some error name',
          },
        ],
      } as unknown as ApolloError)
    ).toBe(
      'An operation failed because it depends on one or more records that were required but not found. Record to update not found.'
    );

    expect(
      getGraphQLErrorExtensionsMessage({
        ...defaultFields,
        graphQLErrors: [
          {
            nodes: undefined,
            stack: undefined,
            originalError: null,
            source: undefined,
            positions: undefined,
            name: 'some error name',
            extensions: {},
          },
        ],
      } as unknown as ApolloError)
    ).toBe(undefined);

    expect(
      getGraphQLErrorExtensionsMessage({
        ...defaultFields,
        graphQLErrors: [],
      } as unknown as ApolloError)
    ).toBe(undefined);

    expect(
      getGraphQLErrorExtensionsMessage({
        ...defaultFields,
        graphQLErrors: [],
      } as unknown as ApolloError)
    ).toBe(undefined);
  });
});

describe('concatPaginationWithEdges', () => {
  it('should return false keyArgs by default', () => {
    expect(concatPaginationWithEdges()).toEqual({
      keyArgs: false,
      merge: expect.any(Function),
    });
  });

  it('should return keyArgs array from args', () => {
    expect(concatPaginationWithEdges(['id', 'type'])).toEqual({
      keyArgs: ['id', 'type'],
      merge: expect.any(Function),
    });
  });

  it('should call merge with incoming edges only when existing is undefined', () => {
    const existing = undefined;
    const incoming = {
      edges: [{ id: '1' }],
      total: 1,
    };
    const merge = concatPaginationWithEdges().merge as FieldMergeFunction<object, object>;

    expect(merge(existing, incoming, {} as FieldFunctionOptions)).toEqual({
      total: incoming.total,
      edges: incoming.edges,
    });
  });

  it('should call merge with joined existing and incoming edges and incoming total when existing is defined and offset is more than 1', () => {
    const existing = {
      edges: [{ id: '1' }],
      total: 1,
    };
    const incoming = {
      edges: [{ id: '2' }],
      total: 2,
    };
    const merge = concatPaginationWithEdges().merge as FieldMergeFunction<object, object>;

    expect(
      merge(existing, incoming, {
        args: {
          paginationOptions: {
            offset: 1,
          },
        },
      } as FieldFunctionOptions<object>)
    ).toEqual({
      total: incoming.total,
      edges: [...existing.edges, ...incoming.edges],
    });
  });

  it('should show only incoming if paginationOptions.offset is undefined', () => {
    const existing = {
      edges: [{ id: '1' }, { id: '2' }, { id: '3' }],
      total: 1,
    };
    const incoming = {
      edges: [{ id: '2' }],
      total: 2,
    };
    const merge = concatPaginationWithEdges().merge as FieldMergeFunction<object, object>;

    expect(merge(existing, incoming, {} as FieldFunctionOptions<object>)).toEqual({
      total: incoming.total,
      edges: [...incoming.edges],
    });
  });
});

describe('findValueInArray', () => {
  it('should return correct results', () => {
    expect(findValueInArray('one', ['one', 'two', 'three'])).toBe('one');
    expect(findValueInArray('four', ['one', 'two', 'three'])).toBe(undefined);
    expect(findValueInArray('one', [])).toBe(undefined);
  });
});

describe('getSupabaseToken', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return undefined if cookie is not set', () => {
    (Cookies.get as jest.Mock).mockReturnValue(undefined);

    expect(getSupabaseToken()).toBeUndefined();
  });

  it('should return first element if cookie is a valid JSON array with elements', () => {
    const mockToken = JSON.stringify(['access_token_123', 'refresh_token']);

    (Cookies.get as jest.Mock).mockReturnValue(mockToken);

    expect(getSupabaseToken()).toBe('access_token_123');
  });

  it('should return raw token if JSON is a valid empty array', () => {
    const mockToken = JSON.stringify([]);

    (Cookies.get as jest.Mock).mockReturnValue(mockToken);

    expect(getSupabaseToken()).toBe(mockToken);
  });

  it('should return raw token if JSON.parse throws (invalid JSON)', () => {
    const invalidJSON = 'not a valid json';

    (Cookies.get as jest.Mock).mockReturnValue(invalidJSON);

    expect(getSupabaseToken()).toBe(invalidJSON);
  });

  it('should return raw token if parsed result is not an array', () => {
    const notArray = JSON.stringify({ access_token: '123' });

    (Cookies.get as jest.Mock).mockReturnValue(notArray);

    expect(getSupabaseToken()).toBe(notArray);
  });
});
