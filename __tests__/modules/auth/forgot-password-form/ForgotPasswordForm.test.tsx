import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { withApolloAndFormProvider } from '@/mocks/testMocks';
import ForgotPasswordForm from '@/modules/auth/forgot-password-form';
import { useAuthMutation } from '@/shared/auth/hooks';

jest.mock('@/shared/auth/hooks', () => ({
  ...jest.requireActual('@/shared/auth/hooks'),
  useAuthMutation: jest.fn(),
}));

describe('ForgotPasswordForm', () => {
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

  const ForgotPasswordFormComponent = () => withApolloAndFormProvider(<ForgotPasswordForm />, []);

  it('should render component without crashing', () => {
    render(ForgotPasswordFormComponent());

    expect(screen.getByText('LiftMend')).toBeInTheDocument();
    expect(screen.getByTestId('form-header-title')).toBeInTheDocument();
    expect(screen.getByText('Enter your email to receive a password reset link.')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Forgot Password/i })).toBeInTheDocument();
  });

  it('should trigger mutation on form submit', async () => {
    render(ForgotPasswordFormComponent());

    const input = screen.getByPlaceholderText('Enter your email address');
    const submitButton = screen.getByRole('button');

    await act(async () => await userEvent.type(input, 'test@gmail.com'));
    await act(async () => await userEvent.click(submitButton));

    expect(mockOnAuthMutation).toHaveBeenCalled();
  });
});
