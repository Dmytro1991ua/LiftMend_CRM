import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { withFormProvider } from '@/mocks/testMocks';
import BaseTextarea, { BaseTextareaProps } from '@/shared/base-textarea/BaseTextarea';
import { getFormErrorState } from '@/shared/utils';

jest.mock('@/shared/utils', () => ({
  ...jest.requireActual('@/shared/utils'),
  getFormErrorState: jest.fn(),
}));

describe('BaseTextarea', () => {
  const mockErrorMessage = 'Description name is required';
  const mockOnChange = jest.fn();

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

  it('should render error message when getFormErrorState returns an error', () => {
    (getFormErrorState as jest.Mock).mockReturnValue({
      errorMessage: mockErrorMessage,
      hasFieldError: true,
    });

    render(FormTextareaComponent());

    expect(screen.getByText(mockErrorMessage)).toHaveClass('field-error');
  });

  it('should not render error span when there is no error', () => {
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
