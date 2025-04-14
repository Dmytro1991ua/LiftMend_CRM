import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { withFormProvider } from '@/mocks/testMocks';
import FormFields from '@/modules/auth/form-fields';
import { FormFieldsProps } from '@/modules/auth/form-fields/FormFields';
import { FieldLabel, FormFieldPlaceholder, LinkType } from '@/modules/auth/types';
import { InputType } from '@/shared/base-input/form-input/FormInput';
import { AppRoutes } from '@/types/enums';

describe('FormFields', () => {
  const mockOnSelectCountry = jest.fn();
  const mockEmailField = {
    id: 1,
    name: 'email',
    label: FieldLabel.EMAIL,
    className: 'row-start-1 row-end-2 col-start-1 col-end-7',
    placeholder: FormFieldPlaceholder.EMAIL,
  };
  const mockPasswordField = {
    id: 2,
    name: 'password',
    label: FieldLabel.PASSWORD,
    className: 'row-start-2 row-end-3 col-start-1 col-end-7',
    isLastElement: true,
    placeholder: FormFieldPlaceholder.PASSWORD,
    type: 'password',
  };
  const mockForgotPasswordField = {
    id: 3,
    name: 'forgotPassword',
    type: 'link' as LinkType,
    label: FieldLabel.FORGOT_PASSWORD,
    route: AppRoutes.ForgotPassword,
    className: 'row-start-3 row-end-4 col-start-1 col-end-7 text-center mb-8 sm:col-start-4 sm:col-end-7 sm:text-right',
  };
  const mockPhoneNumberField = {
    id: 6,
    name: 'phoneNumber',
    label: FieldLabel.PHONE_NUMBER,
    placeholder: FormFieldPlaceholder.PHONE_NUMBER,
    className: 'row-start-6 row-end-7 col-start-1 col-end-7 sm:row-start-4 sm:row-end-5 mb-8',
    type: 'phone' as InputType,
  };

  const defaultProps = {
    formFields: [mockEmailField, mockPasswordField],
    selectedCountry: 'us',
    onSelectCountry: mockOnSelectCountry,
  };

  const FormFieldsComponent = (props?: Partial<FormFieldsProps>) =>
    withFormProvider(<FormFields {...defaultProps} {...props} />);

  it('should render component without crashing', () => {
    render(FormFieldsComponent());

    expect(screen.getByText(mockEmailField.label)).toBeInTheDocument();
    expect(screen.getByText(mockPasswordField.label)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(mockEmailField.placeholder)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(mockPasswordField.placeholder)).toBeInTheDocument();
  });

  it('should display redirect link when type is link', () => {
    render(FormFieldsComponent({ formFields: [mockForgotPasswordField] }));

    expect(screen.getByText(mockForgotPasswordField.label)).toBeInTheDocument();
    expect(screen.getByText(mockForgotPasswordField.label)).toHaveAttribute('href', AppRoutes.ForgotPassword);
  });

  it('should display phone number input when type is phone', () => {
    render(FormFieldsComponent({ formFields: [mockPhoneNumberField] }));

    expect(screen.getByText(mockPhoneNumberField.label)).toBeInTheDocument();
  });

  it('should call onSelectCountry when phone number is changed', async () => {
    render(FormFieldsComponent({ formFields: [mockPhoneNumberField] }));

    const phoneInput = screen.getByRole('textbox');

    await userEvent.type(phoneInput, '+1702123432');

    expect(mockOnSelectCountry).toHaveBeenCalled();
  });
});
