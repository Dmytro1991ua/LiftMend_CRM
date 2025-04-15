import { ApolloError } from '@apollo/client';
import { act } from '@testing-library/react';
import { GraphQLError } from 'graphql';

import { getErrorMessageFromGraphQlErrors, getGraphQLErrorExtensionsMessage } from '@/graphql/utils';
import { logError, onHandleMutationErrors } from '@/shared/utils';

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
