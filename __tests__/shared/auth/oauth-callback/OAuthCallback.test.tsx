import { render, screen } from '@testing-library/react';

import { useProcessAuth } from '@/shared/auth/hooks';
import OAuthCallback from '@/shared/auth/oauth-callback';

jest.mock('@/shared/auth/hooks');

describe('OAuthCallback', () => {
  const mockWelcomeMessage = 'Hello, John Doe';

  beforeEach(() => {
    (useProcessAuth as jest.Mock).mockReturnValue({
      welcomeMessage: mockWelcomeMessage,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render component without crashing', () => {
    render(<OAuthCallback />);

    expect(screen.getByText(mockWelcomeMessage)).toBeInTheDocument();
    expect(screen.getByText('Please wait while we redirect you to your dashboard.')).toBeInTheDocument();
  });
});
