import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { withApolloAndFormProvider } from '@/mocks/testMocks';
import ResetPasswordForm from '@/modules/auth/reset-password-form/ResetPasswordForm';
import { useAuthMutation } from '@/shared/auth/hooks';

jest.mock('@/shared/auth/hooks', () => ({
  ...jest.requireActual('@/shared/auth/hooks'),
  useAuthMutation: jest.fn(),
}));

describe('ResetPasswordForm', () => {
  const mockOnAuthMutation = jest.fn();

  beforeEach(() => {
    (useAuthMutation as jest.Mock).mockReturnValue({
      onAuthMutation: mockOnAuthMutation,
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const ResetPasswordFormComponent = () => withApolloAndFormProvider(<ResetPasswordForm />, []);

  it('should render component without crashing', () => {
    render(ResetPasswordFormComponent());

    expect(screen.getByText('LiftMend')).toBeInTheDocument();
    expect(screen.getByTestId('form-header-title')).toBeInTheDocument();
    expect(screen.getByText('Set a new password to regain access to your account.')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reset Password/i })).toBeInTheDocument();
  });

  it('should trigger mutation on form submit', async () => {
    render(ResetPasswordFormComponent());

    const newPasswordInput = screen.getByPlaceholderText('Enter your password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
    const submitButton = screen.getByRole('button');

    await act(async () => await userEvent.type(newPasswordInput, '@Dp1234567890dp@'));
    await act(async () => await userEvent.type(confirmPasswordInput, '@Dp1234567890dp@'));
    await act(async () => await userEvent.click(submitButton));

    expect(mockOnAuthMutation).toHaveBeenCalled();
  });
});
