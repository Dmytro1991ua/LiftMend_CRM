import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CustomMultiSelect from '@/shared/base-select/components/custom-multi-select';
import { MultiSelectProps } from '@/shared/base-select/types';

describe('CustomMultiSelect', () => {
  const mockOnChange = jest.fn();
  const mockOnInputChange = jest.fn();
  const mockOnSelectAll = jest.fn();
  const mockOnClearAll = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    options: [
      { label: 'Option 1', value: 'Option 1', id: '1' },
      { label: 'Option 2', value: 'Option 2', id: '2' },
    ],
    multipleSelectControls: true,
    onChange: mockOnChange,
    onInputChange: mockOnInputChange,
    onSelectAll: mockOnSelectAll,
    onClearAll: mockOnClearAll,
    isMultiSelect: true,
    closeMenuOnSelect: false,
    hideSelectedOptions: false,
    searchInputPlaceholder: 'Search...',
    hasError: false,
  } as MultiSelectProps<string>;

  const CustomMultiSelectComponent = (props?: Partial<MultiSelectProps<string>>) => (
    <CustomMultiSelect {...defaultProps} {...props} />
  );

  it('should render component without crashing', () => {
    render(CustomMultiSelectComponent());

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should call onHandleChange and update the value when an option is selected', async () => {
    const selectedOption = [defaultProps.options[0]];
    const mockActionMeta = { action: 'select-option', option: defaultProps.options[0] };

    render(CustomMultiSelectComponent());

    await userEvent.click(screen.getByRole('combobox'));

    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Option 1'));

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(mockOnChange).toHaveBeenCalledWith(selectedOption, mockActionMeta);
  });

  it('should call onHandleSelectAll and select all select dropdown options', async () => {
    render(CustomMultiSelectComponent());

    await userEvent.click(screen.getByRole('combobox'));

    await waitFor(() => {
      expect(screen.getByText('Select All')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Select All'));

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(mockOnSelectAll).toHaveBeenCalled();
  });

  it('should call onHandleClearAll and clear all selected dropdown options', async () => {
    render(CustomMultiSelectComponent());

    await userEvent.click(screen.getByRole('combobox'));

    await userEvent.click(screen.getByText('Option 1'));

    await userEvent.click(screen.getByRole('combobox'));

    await waitFor(() => {
      expect(screen.getByTestId('clear-all-control')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Clear All'));

    expect(mockOnClearAll).toHaveBeenCalled();
  });
});
