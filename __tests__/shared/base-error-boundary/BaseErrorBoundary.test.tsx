import { useEffect } from 'react';

import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from 'react-error-boundary';

import BaseErrorBoundary from '@/shared/base-error-boundary/BaseErrorBoundary';

const ComponentWithError = (): JSX.Element => {
  useEffect(() => {
    throw new Error('Something went wrong');
  }, []);
  return <div />;
};

describe('<ErrorBoundary />', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should render error boundary when application error occurs', async () => {
    const mockError = jest.fn();

    render(
      <MockedProvider addTypename={false} mocks={[]}>
        <ErrorBoundary FallbackComponent={BaseErrorBoundary} onError={mockError}>
          <ComponentWithError />
        </ErrorBoundary>
      </MockedProvider>
    );

    expect(screen.getByTestId('base-error-boundary')).toHaveTextContent('Something went wrong');
    expect(screen.getByTestId('base-error-boundary')).toBeInTheDocument();

    expect(mockError).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByTestId('reset-error-boundary-btn'));

    await waitFor(() => {
      expect(mockError).toHaveBeenCalledTimes(2);
    });
  });
});
