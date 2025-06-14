import { fireEvent, render, screen } from '@testing-library/react';

import BaseSelect from '@/shared/base-select';
import { BaseSelectProps } from '@/shared/base-select/types';

describe('BaseSelect', () => {
  const mockOptions = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
  ];
  const onChangeMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps: BaseSelectProps<string, false> = {
    options: mockOptions,
    value: null,
    onChange: jest.fn(),
    placeholder: 'Select option...',
    inputValue: '',
    onInputChange: jest.fn(),
    hasSearchInput: false,
    onNext: jest.fn(),
    hasMore: false,
    isMultiSelect: false,
    onClearAll: jest.fn(),
    onSelectAll: jest.fn(),
    multipleSelectControls: false,
    closeMenuOnSelect: true,
    hideSelectedOptions: false,
    searchInputPlaceholder: 'Search...',
    maxVisibleOptionsCount: 5,
    isClearable: true,
    isDisabled: false,
    hasError: false,
  };

  const BaseSelectComponent = (props?: Partial<BaseSelectProps<string, false>>) => (
    <BaseSelect {...defaultProps} {...props} />
  );

  it('should render with placeholder', () => {
    render(BaseSelectComponent());

    expect(screen.getByText('Select option...')).toBeInTheDocument();
  });

  it('should open menu on focus', () => {
    render(BaseSelectComponent());

    const input = screen.getByRole('combobox');

    fireEvent.focus(input);

    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('should trigger onChange when option is selected', () => {
    render(BaseSelectComponent({ onChange: onChangeMock }));

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);

    const option = screen.getAllByText('Option 1')[0];
    fireEvent.click(option);

    expect(onChangeMock).toHaveBeenCalled();
  });

  it('should disable select when isDisabled is true', () => {
    render(BaseSelectComponent({ isDisabled: true }));

    expect(screen.getByRole('combobox')).toBeDisabled();
  });
});
