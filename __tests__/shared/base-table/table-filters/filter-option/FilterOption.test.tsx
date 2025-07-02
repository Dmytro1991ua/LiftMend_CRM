import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DropdownOption } from '@/shared/base-select/types';
import FilterOption, { FilterOptionProps } from '@/shared/base-table/table-filters/filter-option/FilterOption';
import { FilterKey } from '@/shared/base-table/types';

describe('FilterOption', () => {
  const mockOnFilterChange = jest.fn();
  const mockOption: DropdownOption = { label: 'test_certificate_1', value: 'test_certificate_1' };

  const defaultProps: FilterOptionProps = {
    filterKey: FilterKey.Certifications,
    filterType: 'checkbox',
    option: mockOption,
    isSelected: false,
    onFilterChange: mockOnFilterChange,
  };

  const FilterOptionComponent = (props?: Partial<FilterOptionProps>) => <FilterOption {...defaultProps} {...props} />;

  it('should render filter checkbox when filterType is checkbox', () => {
    render(FilterOptionComponent());

    expect(screen.getByTestId('filter-checkbox')).toBeInTheDocument();
  });

  it('should render filter radio when filterType is radio', () => {
    render(FilterOptionComponent({ filterType: 'radio' }));

    expect(screen.getByTestId('filter-radio')).toBeInTheDocument();
  });

  it('should trigger onFilterChange and select checkbox', async () => {
    render(FilterOptionComponent());

    const checkbox = screen.getByTestId('filter-checkbox');

    await userEvent.click(checkbox);

    expect(mockOnFilterChange).toHaveBeenCalledWith('certifications', mockOption, 'checkbox');
  });

  it('should trigger onFilterChange and select radio button', async () => {
    render(FilterOptionComponent({ filterType: 'radio' }));

    const radioButton = screen.getByTestId('filter-radio');

    await userEvent.click(radioButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith('certifications', mockOption, 'radio');
  });

  it('checkbox should be checked when isSelected is true', () => {
    render(FilterOptionComponent({ isSelected: true }));

    expect(screen.getByTestId('filter-checkbox')).toBeChecked();
  });

  it('radio should be checked when isSelected is true', () => {
    render(FilterOptionComponent({ filterType: 'radio', isSelected: true }));

    expect(screen.getByTestId('filter-radio')).toBeChecked();
  });

  it('should render label with correct text and htmlFor', () => {
    render(FilterOptionComponent());

    const label = screen.getByText(mockOption.label);

    expect(label).toHaveAttribute('for', `checkbox-${defaultProps.filterKey}_${mockOption.value}`);
  });
});
