import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { withApolloProvider } from '@/mocks/testMocks';
import { useAuthMutation } from '@/shared/auth/hooks';
import ThirdPartyAuthButton from '@/shared/auth/third-party-auth-button';

jest.mock('@/shared/auth/hooks', () => ({
  ...jest.requireActual('@/shared/auth/hooks'),
  useAuthMutation: jest.fn(),
}));

describe('ThirdPartyAuthButton', () => {
  const mockOnAuthMutation = jest.fn();

  beforeEach(() => {
    (useAuthMutation as jest.Mock).mockReturnValue({
      onAuthMutation: mockOnAuthMutation,
      isLoading: false,
    });

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href: '' },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const ThirdPartyAuthButtonComponent = () => withApolloProvider(<ThirdPartyAuthButton />);

  it('should render component without crashing', () => {
    render(ThirdPartyAuthButtonComponent());

    expect(screen.getByTestId('third-party-auth-buttons')).toBeInTheDocument();
  });

  it('should handle sign-in with Google provider on button click', async () => {
    render(ThirdPartyAuthButtonComponent());

    const button = screen.getByLabelText('google-auth-button');

    await userEvent.click(button);

    expect(mockOnAuthMutation).toHaveBeenCalledWith({ input: { provider: 'GOOGLE' } });
  });

  it('should handle sign-in with Github provider on button click', async () => {
    render(ThirdPartyAuthButtonComponent());

    const button = screen.getByLabelText('github-auth-button');

    await userEvent.click(button);

    expect(mockOnAuthMutation).toHaveBeenCalledWith({ input: { provider: 'GITHUB' } });
  });

  it('should redirect to OAuth URL when response contains signInWithOAuth', async () => {
    const mockRedirectUrl = 'https://oauth-redirect.com';

    mockOnAuthMutation.mockResolvedValueOnce({
      data: {
        signInWithOAuth: mockRedirectUrl,
      },
    });

    render(ThirdPartyAuthButtonComponent());

    const button = screen.getByLabelText('google-auth-button');
    await userEvent.click(button);

    expect(window.location.href).toBe(mockRedirectUrl);
  });
});
