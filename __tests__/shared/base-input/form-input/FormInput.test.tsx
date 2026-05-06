import { render, screen } from '@testing-library/react';

import { withFormProvider } from '@/mocks/testMocks';
import FormInput, { FormInputProps } from '@/shared/base-input/form-input/FormInput';
import { getFormErrorState } from '@/shared/utils';

jest.mock('@/shared/utils', () => ({
  ...jest.requireActual('@/shared/utils'),
  getFormErrorState: jest.fn(),
}));

describe('FormInput', () => {
  const mockErrorMessage = 'First name is required';
  const mockErrorClassName = 'test-error-class';

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
    name: 'firstName',
    id: 'firstName',
  };

  const FormInputComponent = (props?: Partial<FormInputProps<{ fullName: string }>>) =>
    withFormProvider(<FormInput {...defaultProps} {...props} />);

  it('should render component without crashing', () => {
    render(FormInputComponent());

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render label it is provided', () => {
    render(FormInputComponent({ label: 'Test label' }));

    expect(screen.getByText('Test label')).toBeInTheDocument();
  });

  it('should render error message when getFormErrorState returns an error', () => {
    (getFormErrorState as jest.Mock).mockReturnValue({
      errorMessage: mockErrorMessage,
      hasFieldError: true,
    });

    render(FormInputComponent({ errorClassName: mockErrorClassName }));

    expect(screen.getByText(mockErrorMessage)).toHaveClass('field-error test-error-class');
    expect(screen.getByText(mockErrorMessage)).toHaveClass(mockErrorClassName);
  });

  it('should not render error span when there is no error', () => {
    render(FormInputComponent());

    expect(screen.queryByText(mockErrorMessage)).not.toBeInTheDocument();
  });
});
