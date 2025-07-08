import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { withFormProvider } from '@/mocks/testMocks';
import { getNestedError } from '@/modules/repair-job-scheduling/utils';
import BaseTextarea, { BaseTextareaProps } from '@/shared/base-textarea/BaseTextarea';

jest.mock('@/modules/repair-job-scheduling/utils', () => ({
  ...jest.requireActual('@/modules/repair-job-scheduling/utils'),
  getNestedError: jest.fn(),
}));

describe('BaseTextarea', () => {
  const mockErrorMessage = 'Description name is required';
  const mockOnChange = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    name: 'firstName',
    id: 'firstName',
    onChange: mockOnChange,
  };

  const FormTextareaComponent = (props?: Partial<BaseTextareaProps<{ description: string }>>) =>
    withFormProvider(<BaseTextarea {...defaultProps} {...props} />);

  it('should render component without crashing', () => {
    render(FormTextareaComponent());

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render label it is provided', () => {
    render(FormTextareaComponent({ label: 'Test label' }));

    expect(screen.getByText('Test label')).toBeInTheDocument();
  });

  it('should render error message when getNestedError returns an error', () => {
    (getNestedError as jest.Mock).mockReturnValue({
      message: mockErrorMessage,
    });

    render(FormTextareaComponent());

    expect(screen.getByText(mockErrorMessage)).toHaveClass('field-error');
  });

  it('should not render error span when there is no error', () => {
    (getNestedError as jest.Mock).mockReturnValue(undefined);

    render(FormTextareaComponent());

    expect(screen.queryByText(mockErrorMessage)).not.toBeInTheDocument();
  });

  it('should disable input when disabled prop is true', () => {
    render(FormTextareaComponent({ disabled: true }));

    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('should trigger custom onChange and update value in textarea if provided', async () => {
    const mockNewValue = 'New Description';

    render(FormTextareaComponent());

    const textArea = screen.getByRole('textbox');

    await userEvent.type(textArea, mockNewValue);

    expect(mockOnChange).toHaveBeenCalled();
  });
});
