import { ApolloError } from '@apollo/client';
import { act } from '@testing-library/react';
import { GraphQLError } from 'graphql';

import { getErrorMessageFromGraphQlErrors, getGraphQLErrorExtensionsMessage } from '@/graphql/utils';
import { convertYearValueToCorrectFormat, formatDate, logError, onHandleMutationErrors } from '@/shared/utils';

jest.mock('@/graphql/utils');

describe('logErrorBoundary', () => {
  it('should call console error', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error');

    logError(new Error('some error'), { componentStack: 'stack' });

    expect(consoleErrorSpy).toHaveBeenCalledTimes(3);
  });
});

describe('onHandleMutationErrors', () => {
  const onFailureMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle GraphQL errors', () => {
    const mockGQLError = 'Test GraphQL Error';
    const errors = [{ graphQLErrors: [{ message: mockGQLError }] }] as unknown as ReadonlyArray<GraphQLError>;

    (getErrorMessageFromGraphQlErrors as jest.Mock).mockReturnValue(mockGQLError);

    act(() => {
      onHandleMutationErrors({
        message: 'Repair Job Update Failed',
        errors,
        onFailure: onFailureMock,
      });
    });

    expect(onFailureMock).toHaveBeenCalled();
    expect(onFailureMock).toHaveBeenCalledWith('Repair Job Update Failed', 'Test GraphQL Error');
  });

  it('should handle network errors', () => {
    const mockNetworkError = 'Test network Error';
    const error = { message: mockNetworkError } as ApolloError;

    (getErrorMessageFromGraphQlErrors as jest.Mock).mockReturnValue(null);
    (getGraphQLErrorExtensionsMessage as jest.Mock).mockReturnValue(mockNetworkError);

    act(() => {
      onHandleMutationErrors({
        message: 'Repair Job Update Failed',
        error,
        onFailure: onFailureMock,
      });
    });

    expect(onFailureMock).toHaveBeenCalled();
    expect(onFailureMock).toHaveBeenCalledWith('Repair Job Update Failed', 'Test network Error');
  });

  it('should not call onFailureUpdate and onSetGraphQLErrorsMock when both errors are falsy', () => {
    (getErrorMessageFromGraphQlErrors as jest.Mock).mockReturnValue(null);
    (getGraphQLErrorExtensionsMessage as jest.Mock).mockReturnValue(null);

    act(() => {
      onHandleMutationErrors({
        message: 'Repair Job Update Failed',
        onFailure: onFailureMock,
      });
    });

    expect(onFailureMock).not.toHaveBeenCalled();
  });
});

describe('convertYearValueToCorrectFormat', () => {
  // eslint-disable-next-line quotes
  it("should return '2-digit' year string if it is not an Ad start or end date", () => {
    expect(convertYearValueToCorrectFormat()).toEqual('2-digit');
  });

  // eslint-disable-next-line quotes
  it("should return 'numeric' year string if it is an Ad start or end date", () => {
    expect(convertYearValueToCorrectFormat(true)).toEqual('numeric');
  });
});

describe('formatDate', () => {
  const mockScenarios = [
    {
      name: 'default format with time included',
      input: { value: new Date('2025-12-09T15:30:00') },
      expected: '12/09/25 03:30 PM',
    },
    {
      name: 'without time',
      input: { value: new Date('2025-12-09T15:30:00'), includeTime: false },
      expected: '12/09/25',
    },
    {
      name: 'long year format',
      input: { value: new Date('2025-12-09T15:30:00'), isYearFormatLong: true },
      expected: '12/09/2025 03:30 PM',
    },
    {
      name: 'without time and long year format',
      input: { value: new Date('2025-12-09T15:30:00'), includeTime: false, isYearFormatLong: true },
      expected: '12/09/2025',
    },
    {
      name: 'invalid date',
      input: { value: new Date('invalid') },
      expected: 'Invalid Date',
    },
  ];

  mockScenarios.forEach(({ name, input, expected }) => {
    it(name, () => {
      expect(formatDate(input.value, input.includeTime, input.isYearFormatLong)).toBe(expected);
    });
  });
});
