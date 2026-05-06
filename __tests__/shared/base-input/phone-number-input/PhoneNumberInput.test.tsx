import { render, screen } from '@testing-library/react';

import { withFormProvider } from '@/mocks/testMocks';
import PhoneNumberInput, { PhoneNumberInputProps } from '@/shared/base-input/phone-number-input/PhoneNumberInput';
import { getFormErrorState } from '@/shared/utils';

jest.mock('@/shared/utils', () => ({
  ...jest.requireActual('@/shared/utils'),
  getFormErrorState: jest.fn(),
}));

describe('PhoneNumberInput', () => {
  const mockErrorMessage = 'Phone number is required';

  beforeEach(() => {
    (getFormErrorState as jest.Mock).mockReturnValue({
      errorMessage: undefined,
      hasRootError: false,
      hasFieldError: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    name: 'phoneNumber',
    id: 'phoneNumber',
  };

  const PhoneNumberInputComponent = (props?: Partial<PhoneNumberInputProps<{ firstName: string }>>) =>
    withFormProvider(<PhoneNumberInput {...defaultProps} {...props} />);

  it('should render component without crashing', () => {
    render(PhoneNumberInputComponent());

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render label it is provided', () => {
    render(PhoneNumberInputComponent({ label: 'Test label' }));

    expect(screen.getByText('Test label')).toBeInTheDocument();
  });

  it('should render error message when getFormErrorState returns an error', () => {
    (getFormErrorState as jest.Mock).mockReturnValue({
      errorMessage: mockErrorMessage,
      hasRootError: false,
      hasFieldError: true,
    });

    render(PhoneNumberInputComponent());

    expect(screen.getByText(mockErrorMessage)).toHaveClass('text-red-500 text-sm');
  });

  it('should not render error span when there is no error', () => {
    render(PhoneNumberInputComponent());

    expect(screen.queryByText(mockErrorMessage)).not.toBeInTheDocument();
  });

  it('should disable input when disabled prop is true', () => {
    render(PhoneNumberInputComponent({ disabled: true }));

    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
