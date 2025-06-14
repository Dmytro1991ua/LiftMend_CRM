import { fireEvent, render, screen } from '@testing-library/react';

import CustomSearchInput from '@/shared/base-select/components/custom-seacrh-input/CustomSearchInput';
import { CustomSearchInputProps } from '@/shared/base-select/types';

describe('CustomSearchInput', () => {
  const mockOnInputChange = jest.fn();
  const mockOnFocus = jest.fn();
  const mockStopPropagation = jest.fn();

  const mockOptions = [
    { label: 'Option 1', value: 'Option 1', id: '1' },
    { label: 'Option 2', value: 'Option 2', id: '2' },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    selectProps: {
      innerProps: {},
      inputValue: 'Initial',
      maxVisibleOptionsCount: 10,
      options: mockOptions,
      onInputChange: mockOnInputChange,
      onFocus: mockOnFocus,
      'aria-label': 'custom-search',
      'aria-labelledby': 'custom-label-id',
      searchInputPlaceholder: 'Search here...',
    },
  };

  const CustomSearchInputComponent = (props?: Partial<CustomSearchInputProps<string, true>>) => (
    <CustomSearchInput {...defaultProps} {...props} />
  );

  it('should render component without crashing', () => {
    render(CustomSearchInputComponent());

    const input = screen.getByRole('textbox');

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Search here...');
  });

  it('should trigger onInputChange when the input value changes', () => {
    render(CustomSearchInputComponent());

    const input = screen.getByTestId('custom-search-input');

    fireEvent.change(input, { target: { value: 'Updated' } });

    expect(mockOnInputChange).toHaveBeenCalledWith('Updated', {
      action: 'input-change',
      prevInputValue: 'Initial',
    });
  });

  it('should trigger onFocus when input is focused', () => {
    render(CustomSearchInputComponent());

    const input = screen.getByTestId('custom-search-input');

    fireEvent.focus(input);

    expect(mockOnFocus).toHaveBeenCalled();
  });

  it('should trigger stopPropagation and focuses input on mouse down', () => {
    render(CustomSearchInputComponent());

    const input = screen.getByTestId('custom-search-input');

    // Create a mouse event with stopPropagation manually mocked
    fireEvent.mouseDown(input, {
      bubbles: true,
      cancelable: true,
    });

    // Manually simulate focus and stopPropagation (since fireEvent doesn't allow us to pass a real MouseEvent)
    const event = new MouseEvent('mousedown', { bubbles: true });
    Object.defineProperty(event, 'target', { value: input });
    event.stopPropagation = mockStopPropagation;

    input.dispatchEvent(event);

    expect(mockStopPropagation).toHaveBeenCalled();
    expect(input).toHaveFocus();
  });

  it('should trigger stopPropagation and focuses input on touch end', () => {
    render(CustomSearchInputComponent());

    const input = screen.getByTestId('custom-search-input');

    // Manually simulate touchend and inject stopPropagation,
    // since fireEvent does not support mocking stopPropagation directly
    const touchEvent = new TouchEvent('touchend', { bubbles: true });
    Object.defineProperty(touchEvent, 'target', { value: input });
    touchEvent.stopPropagation = mockStopPropagation;

    input.dispatchEvent(touchEvent);

    expect(mockStopPropagation).toHaveBeenCalled();
    expect(input).toHaveFocus();
  });
});
