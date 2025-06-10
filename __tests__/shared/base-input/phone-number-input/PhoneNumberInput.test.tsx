import { render, screen } from '@testing-library/react';

import { withFormProvider } from '@/mocks/testMocks';
import { ProfileContentFormFields } from '@/modules/profile/validation';
import { getNestedError } from '@/modules/repair-job-scheduling/utils';
import PhoneNumberInput, { PhoneNumberInputProps } from '@/shared/base-input/phone-number-input/PhoneNumberInput';

jest.mock('@/modules/repair-job-scheduling/utils', () => ({
  ...jest.requireActual('@/modules/repair-job-scheduling/utils'),
  getNestedError: jest.fn(),
}));

describe('PhoneNumberInput', () => {
  const mockErrorMessage = 'Phone numberis required';

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    name: 'phoneNumber',
    id: 'phoneNumber',
  };

  const PhoneNumberInputComponent = (props?: Partial<PhoneNumberInputProps<ProfileContentFormFields>>) =>
    withFormProvider(<PhoneNumberInput {...defaultProps} {...props} />);

  it('should render component without crashing', () => {
    render(PhoneNumberInputComponent());

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render label it is provided', () => {
    render(PhoneNumberInputComponent({ label: 'Test label' }));

    expect(screen.getByText('Test label')).toBeInTheDocument();
  });

  it('should render error message when getNestedError returns an error', () => {
    (getNestedError as jest.Mock).mockReturnValue({
      message: mockErrorMessage,
    });

    render(PhoneNumberInputComponent());

    expect(screen.getByText(mockErrorMessage)).toHaveClass('text-red-500 text-sm');
  });

  it('should not render error span when there is no error', () => {
    (getNestedError as jest.Mock).mockReturnValue(undefined);

    render(PhoneNumberInputComponent());

    expect(screen.queryByText(mockErrorMessage)).not.toBeInTheDocument();
  });

  it('should disable input when disabled prop is true', () => {
    render(PhoneNumberInputComponent({ disabled: true }));

    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
