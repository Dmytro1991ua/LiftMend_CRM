import { render, screen } from '@testing-library/react';

import { useProcessSignOut } from '@/shared/auth/hooks/useProcessSignOut';
import { SignOutCallback } from '@/shared/auth/signout-callback';

jest.mock('@/shared/auth/hooks/useProcessSignOut', () => ({
  useProcessSignOut: jest.fn(),
}));

describe('SignOutCallback', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call useProcessSignOut on mount', () => {
    render(<SignOutCallback />);

    expect(useProcessSignOut).toHaveBeenCalled();
  });

  it('should render correct title and subtitle', () => {
    render(<SignOutCallback />);

    expect(screen.getByText('Signing you out...')).toBeInTheDocument();
    expect(screen.getByText('Please wait while we redirect you to sign-in page.')).toBeInTheDocument();
  });
});
