import { useQuery } from '@apollo/client';
import { useSession } from '@supabase/auth-helpers-react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { mockUser } from '@/mocks/userMocks';
import { UserProvider, useUser } from '@/shared/contexts/UserContext';
import { removeTypeNamesFromObject } from '@/shared/utils';

jest.mock('@apollo/client');
jest.mock('@supabase/auth-helpers-react');
jest.mock('@/shared/utils', () => ({
  ...jest.requireActual('@/shared/utils'),
  removeTypeNamesFromObject: jest.fn(),
}));

describe('UserContext', () => {
  const mockRefetch = jest.fn().mockResolvedValue({ data: { getUser: mockUser } });

  beforeEach(() => {
    (useQuery as jest.Mock).mockReturnValue({
      data: { getUser: mockUser },
      loading: false,
      error: undefined,
      refetch: mockRefetch,
    });
    (removeTypeNamesFromObject as jest.Mock).mockReturnValue(mockUser);
    (useSession as jest.Mock).mockReturnValue({ user: mockUser });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const TestComponent = () => {
    const { user, loading, error, refetch } = useUser();

    return (
      <div>
        <div data-testid='first-name'>{user ? user.firstName : 'no-user-first-name'}</div>
        <div data-testid='last-name'>{user ? user.lastName : 'no-user-last-name'}</div>
        <div data-testid='loading'>{loading.toString()}</div>
        <div data-testid='error'>{error || 'no-error'}</div>
        <button onClick={() => refetch()}>Refetch</button>
      </div>
    );
  };

  it('should render user data', async () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('first-name')).toHaveTextContent('Alex');
    expect(screen.getByTestId('last-name')).toHaveTextContent('Smith');
    expect(screen.getByTestId('error')).toHaveTextContent('no-error');
  });

  it('should return null user when session is missing', async () => {
    (useSession as jest.Mock).mockReturnValue(null);

    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
      refetch: mockRefetch,
    });

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    expect(screen.getByTestId('first-name')).toHaveTextContent('no-user-first-name');
    expect(screen.getByTestId('last-name')).toHaveTextContent('no-user-last-name');
  });

  it('should return error when GraphQL query fails', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      loading: false,
      error: { message: 'Failed to fetch user' },
      refetch: mockRefetch,
    });

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await waitFor(() => expect(screen.getByTestId('error')).toHaveTextContent('Failed to fetch user'));
  });

  it('should call refetch on button click', async () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    const button = screen.getByText('Refetch');

    await userEvent.click(button);

    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalled();
    });
  });
});
