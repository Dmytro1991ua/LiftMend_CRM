import { fireEvent, render, screen } from '@testing-library/react';

import ModalFooter from '@/shared/base-modal/modal-footer';

describe('ModalFooter', () => {
  const mockSubmitButtonLabel = 'Test Submit Button';
  const mockCancelButtonLabel = 'Test Cancel Button';
  const mockOnCancelButton = jest.fn();
  const mockOnSubmitButton = jest.fn();

  const defaultProps = {
    submitButtonLabel: mockSubmitButtonLabel,
    cancelButtonLabel: mockCancelButtonLabel,
    isLoading: false,
    isDisabled: false,
    onCancel: mockOnCancelButton,
    onSubmit: mockOnSubmitButton,
  };

  it('should render component without crashing', () => {
    render(<ModalFooter {...defaultProps} />);

    expect(screen.getByText(mockSubmitButtonLabel)).toBeInTheDocument();
    expect(screen.getByText(mockCancelButtonLabel)).toBeInTheDocument();
  });

  it('should show a loader spinner when isLoading is true', () => {
    render(<ModalFooter {...defaultProps} isLoading={true} />);

    expect(screen.getByTestId('button-loader')).toBeInTheDocument();
  });

  it('should disabled submit button when isDisabled is true', () => {
    render(<ModalFooter {...defaultProps} isLoading={true} />);

    const submitButton = screen.getAllByRole('button')[0];

    expect(submitButton).toHaveClass('disabled:pointer-events-all disabled:cursor-not-allowed disabled:opacity-50');
  });

  it('should trigger onSubmit handler', () => {
    render(<ModalFooter {...defaultProps} />);

    const submitButton = screen.getByText(mockSubmitButtonLabel);

    fireEvent.click(submitButton);

    expect(mockOnSubmitButton).toHaveBeenCalled();
  });

  it('should trigger onCancel handler', () => {
    render(<ModalFooter {...defaultProps} />);

    const cancelButton = screen.getByText(mockCancelButtonLabel);

    fireEvent.click(cancelButton);

    expect(mockOnCancelButton).toHaveBeenCalled();
  });
});
