import { fireEvent, render, screen } from '@testing-library/react';

import { withFormProvider } from '@/mocks/testMocks';
import BaseInput from '@/shared/base-input';
import { BaseInputProps } from '@/shared/base-input/BaseInput';

describe('BaseInput', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    name: 'firstName',
    id: 'firstName',
    value: 'Alex',
  };

  const BaseInputComponent = (props?: Partial<BaseInputProps<string>>) =>
    withFormProvider(<BaseInput {...defaultProps} {...props} />);

  it('should render component without crashing', () => {
    render(BaseInputComponent());

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render label it is provided', () => {
    render(BaseInputComponent({ label: 'Test label' }));

    expect(screen.getByText('Test label')).toBeInTheDocument();
  });

  it('should have the correct value', () => {
    render(BaseInputComponent({ value: 'Test Value' }));

    expect(screen.getByRole('textbox')).toHaveValue('Test Value');
  });

  it('should be disabled when disabled prop is true', () => {
    render(BaseInputComponent({ disabled: true }));

    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('should render startIcon and endIcon if provided', () => {
    const startIcon = <span data-testid='start-icon'>Start Icon</span>;
    const endIcon = <span data-testid='end-icon'>End icon</span>;

    render(BaseInputComponent({ startIcon, endIcon }));

    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  it('should have margin bottom when isLastElement is false', () => {
    render(BaseInputComponent({ isLastElement: false }));

    const inputWrapper = screen.getByTestId('base-input-wrapper');

    expect(inputWrapper).toHaveClass('mb-8');
  });

  it('should not have margin bottom when isLastElement is true', () => {
    render(BaseInputComponent({ isLastElement: true }));

    const inputWrapper = screen.getByTestId('base-input-wrapper');

    expect(inputWrapper).not.toHaveClass('mb-8');
  });

  it('should call onChange when input value changes', () => {
    const onChange = jest.fn();

    render(BaseInputComponent({ onChange }));

    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'new value' } });

    expect(onChange).toHaveBeenCalled();
  });
});
