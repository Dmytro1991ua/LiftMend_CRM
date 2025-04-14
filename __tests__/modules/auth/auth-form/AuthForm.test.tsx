import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { withFormProvider } from '@/mocks/testMocks';
import AuthForm, { AuthFormProps } from '@/modules/auth/auth-form/AuthForm';
import { AuthButtonLabel, AuthFormType } from '@/modules/auth/types';

describe('AuthForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnSelectCountry = jest.fn();

  const defaultProps = {
    formType: AuthFormType.SIGN_IN,
    buttonLabel: AuthButtonLabel.SIGN_UP,
    onSubmit: mockOnSubmit,
    isLoading: false,
    oAuthButtons: <p>Test OAuth Buttons</p>,
    authFormSeparator: <p>Test Auth Form Separator</p>,
    selectedCountry: 'us',
    onSelectCountry: mockOnSelectCountry,
  };

  const AuthFromComponent = (props?: Partial<AuthFormProps>) =>
    withFormProvider(<AuthForm {...defaultProps} {...props} />);

  it('should render component without crashing', () => {
    render(AuthFromComponent());

    expect(screen.getByText('LiftMend')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign In to manage elevator repairs.')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
    expect(screen.getByText('Test OAuth Buttons')).toBeInTheDocument();
    expect(screen.getByText('Test Auth Form Separator')).toBeInTheDocument();
  });

  it('should correctly render Sign-In form based on formType', () => {
    render(AuthFromComponent({ formType: AuthFormType.SIGN_IN, buttonLabel: AuthButtonLabel.LOGIN }));

    expect(screen.getByText('LiftMend')).toBeInTheDocument();
    expect(screen.getByTestId('form-header-title')).toBeInTheDocument();
    expect(screen.getByText('Sign In to manage elevator repairs.')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('Test OAuth Buttons')).toBeInTheDocument();
    expect(screen.getByText('Test Auth Form Separator')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  it('should correctly render Sign-Up form based on formType', () => {
    render(AuthFromComponent({ formType: AuthFormType.SIGN_UP, buttonLabel: AuthButtonLabel.SIGN_UP }));

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
    expect(screen.getByText('Test OAuth Buttons')).toBeInTheDocument();
    expect(screen.getByText('Test Auth Form Separator')).toBeInTheDocument();
  });

  it('should correctly render Forgot Password form based on formType', () => {
    render(AuthFromComponent({ formType: AuthFormType.FORGOT_PASSWORD, buttonLabel: AuthButtonLabel.FORGOT_PASSWORD }));

    expect(screen.getByText('LiftMend')).toBeInTheDocument();
    expect(screen.getByTestId('form-header-title')).toBeInTheDocument();
    expect(screen.getByText('Enter your email to receive a password reset link.')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Forgot Password/i })).toBeInTheDocument();
    expect(screen.getByText('Test OAuth Buttons')).toBeInTheDocument();
    expect(screen.getByText('Test Auth Form Separator')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Forgot Password/i })).toBeInTheDocument();
  });

  it('should correctly render Reset password form based on formType', () => {
    render(AuthFromComponent({ formType: AuthFormType.RESET_PASSWORD, buttonLabel: AuthButtonLabel.RESET_PASSWORD }));

    expect(screen.getByText('LiftMend')).toBeInTheDocument();
    expect(screen.getByTestId('form-header-title')).toBeInTheDocument();
    expect(screen.getByText('Set a new password to regain access to your account.')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reset Password/i })).toBeInTheDocument();
    expect(screen.getByText('Test OAuth Buttons')).toBeInTheDocument();
    expect(screen.getByText('Test Auth Form Separator')).toBeInTheDocument();
  });

  it('should show form loader when isLoading is true', () => {
    render(AuthFromComponent({ isLoading: true }));

    expect(screen.getByTestId('hourglass-svg')).toBeInTheDocument();
  });

  it('should call onSubmit handler on submit button click', async () => {
    render(AuthFromComponent({ formType: AuthFormType.RESET_PASSWORD, buttonLabel: AuthButtonLabel.RESET_PASSWORD }));

    const input = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button');

    await act(async () => await userEvent.type(input, 'test@gmail.com'));
    await act(async () => await userEvent.click(submitButton));

    expect(mockOnSubmit).toHaveBeenCalled();
  });
});
