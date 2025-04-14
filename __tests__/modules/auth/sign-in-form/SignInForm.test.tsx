import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { withApolloAndFormProvider } from '@/mocks/testMocks';
import SignInForm from '@/modules/auth/sign-in-form/SignInForm';
import { useAuthMutation } from '@/shared/auth/hooks';

jest.mock('@/shared/auth/hooks', () => ({
  ...jest.requireActual('@/shared/auth/hooks'),
  useAuthMutation: jest.fn(),
}));

describe('SignInForm', () => {
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

  const SignInFormComponent = () => withApolloAndFormProvider(<SignInForm />, []);

  it('should render component without crashing', () => {
    render(SignInFormComponent());

    expect(screen.getByText('LiftMend')).toBeInTheDocument();
    expect(screen.getByTestId('form-header-title')).toBeInTheDocument();
    expect(screen.getByText('Sign In to manage elevator repairs.')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  it('should trigger mutation on form submit', async () => {
    render(SignInFormComponent());

    const emailInput = screen.getByPlaceholderText('Enter your email address');
    const passwordInput = screen.getByPlaceholderText('Enter your password');

    const submitButton = screen.getByRole('button', { name: /Login/i });

    await act(async () => await userEvent.type(emailInput, 'test@gmail.com'));
    await act(async () => await userEvent.type(passwordInput, '@Dp1234567890dp@'));
    await act(async () => await userEvent.click(submitButton));

    expect(mockOnAuthMutation).toHaveBeenCalled();
  });
});
