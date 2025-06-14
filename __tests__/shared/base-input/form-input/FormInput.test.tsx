import { render, screen } from '@testing-library/react';

import { withFormProvider } from '@/mocks/testMocks';
import { getNestedError } from '@/modules/repair-job-scheduling/utils';
import FormInput, { FormInputProps } from '@/shared/base-input/form-input/FormInput';

jest.mock('@/modules/repair-job-scheduling/utils', () => ({
  ...jest.requireActual('@/modules/repair-job-scheduling/utils'),
  getNestedError: jest.fn(),
}));

describe('FormInput', () => {
  const mockErrorMessage = 'First name is required';
  const mockErrorClassName = 'test-error-class';

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

  it('should render error message when getNestedError returns an error', () => {
    (getNestedError as jest.Mock).mockReturnValue({
      message: mockErrorMessage,
    });

    render(FormInputComponent({ errorClassName: mockErrorClassName }));

    expect(screen.getByText(mockErrorMessage)).toHaveClass('text-red-500');
    expect(screen.getByText(mockErrorMessage)).toHaveClass(mockErrorClassName);
  });

  it('should not render error span when there is no error', () => {
    (getNestedError as jest.Mock).mockReturnValue(undefined);

    render(FormInputComponent());

    expect(screen.queryByText(mockErrorMessage)).not.toBeInTheDocument();
  });
});
