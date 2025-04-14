import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { withApolloAndFormProvider } from '@/mocks/testMocks';
import SignUpForm from '@/modules/auth/sign-up-form';
import { useAuthMutation } from '@/shared/auth/hooks';

jest.mock('@/shared/auth/hooks', () => ({
  ...jest.requireActual('@/shared/auth/hooks'),
  useAuthMutation: jest.fn(),
}));

describe('SignUpForm', () => {
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

  const SignUpFormComponent = () => withApolloAndFormProvider(<SignUpForm />, []);

  it('should render component without crashing', () => {
    render(SignUpFormComponent());

    expect(screen.getByText('LiftMend')).toBeInTheDocument();
    expect(screen.getByText('Create a new account')).toBeInTheDocument();
    expect(screen.getByText('Sign up to manage and track elevator repairs effortlessly.')).toBeInTheDocument();
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByText('Phone')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('should trigger mutation on form submit', async () => {
    render(SignUpFormComponent());

    const firstNameInput = screen.getByPlaceholderText('Enter your first name');
    const lastNameInput = screen.getByPlaceholderText('Enter your last name');
    const emailInput = screen.getByPlaceholderText('Enter your email address');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');

    const submitButton = screen.getByText('Sign Up');

    await act(async () => await userEvent.type(firstNameInput, 'Alex'));
    await act(async () => await userEvent.type(lastNameInput, 'Smith'));
    await act(async () => await userEvent.type(emailInput, 'test@gmail.com'));
    await act(async () => await userEvent.type(passwordInput, '@Dp1234567890dp@'));
    await act(async () => await userEvent.type(confirmPasswordInput, '@Dp1234567890dp@'));
    await act(async () => await userEvent.click(submitButton));

    expect(mockOnAuthMutation).toHaveBeenCalled();
  });
});
