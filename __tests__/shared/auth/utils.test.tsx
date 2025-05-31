import { render, screen } from '@testing-library/react';

import { mockUser } from '@/mocks/userMocks';
import { UserNameProps } from '@/shared/auth/types';
import { getUserName } from '@/shared/auth/utils';

jest.mock('@/components/ui/skeleton', () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div className={className} data-testid='skeleton'>
      Loading...
    </div>
  ),
}));

describe('utils', () => {
  describe('getUserName', () => {
    const renderGetUserName = (props: UserNameProps) => {
      const Component = () => getUserName(props);

      return render(<Component />);
    };

    it('should render Skeleton when loading', () => {
      renderGetUserName({ user: null, isLoading: true });

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
      expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
    });

    it('should render Skeleton when user is null', () => {
      renderGetUserName({ user: null, isLoading: false });

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    });

    it('should render full name when available', () => {
      renderGetUserName({
        user: mockUser,
        isLoading: false,
      });

      expect(screen.getByText('Welcome back, Alex Smith')).toBeInTheDocument();
    });

    it('should render email when name is missing', () => {
      renderGetUserName({
        user: { ...mockUser, firstName: '', lastName: '' },
        isLoading: false,
      });

      expect(screen.getByText('Welcome back, test@gmail.com')).toBeInTheDocument();
    });

    it('should render "User" fallback when no name or email', () => {
      renderGetUserName({
        user: { ...mockUser, firstName: '', lastName: '', email: '' },
        isLoading: false,
      });

      expect(screen.getByText('Welcome back, User')).toBeInTheDocument();
    });

    it('should append additionalMessage when provided', () => {
      renderGetUserName({
        user: mockUser,
        isLoading: false,
        additionalMessage: 'Glad to see you!',
      });

      expect(screen.getByText('Welcome back, Alex Smith Glad to see you!')).toBeInTheDocument();
    });
  });
});
