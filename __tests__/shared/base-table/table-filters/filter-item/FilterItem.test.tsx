import { AccordionContentProps, AccordionTriggerProps } from '@radix-ui/react-accordion';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DropdownOption } from '@/shared/base-select/types';
import { FilterHeaderProps } from '@/shared/base-table/table-filters/filter-header/FilterHeader';
import FilterItem, { FilterItemProps } from '@/shared/base-table/table-filters/filter-item/FilterItem';
import { FilterOptionProps } from '@/shared/base-table/table-filters/filter-option/FilterOption';
import { FilterKey, FilterLabel } from '@/shared/base-table/types';
import { TechnicianRecord } from '@/shared/types';

jest.mock('@/shared/base-table/table-filters', () => {
  const originalModule = jest.requireActual('@/shared/base-table/table-filters');

  return {
    __esModule: true,
    ...originalModule,
    FilterHeader: ({ label, selectedFiltersCount, onClear }: FilterHeaderProps) => (
      <div data-testid='FilterHeader' onClick={onClear}>
        {label} ({selectedFiltersCount})
      </div>
    ),
    FilterOption: ({ filterKey, option, isSelected, onFilterChange }: FilterOptionProps) => (
      <div
        data-selected={isSelected}
        data-testid={`FilterOption-${option.value}`}
        onClick={() => onFilterChange(filterKey, option)}>
        {option.label}
      </div>
    ),
  };
});

jest.mock('@/components/ui/accordion', () => ({
  __esModule: true,
  AccordionTrigger: ({ children, className }: AccordionTriggerProps) => (
    <div className={className} data-testid='AccordionTrigger'>
      {children}
    </div>
  ),
  AccordionContent: ({ children }: AccordionContentProps) => <div data-testid='AccordionContent'>{children}</div>,
}));

describe('FilterItem', () => {
  const mockOnClearFilter = jest.fn();
  const mockOnFilterChange = jest.fn();
  const mockOptions: DropdownOption[] = [
    { label: 'test_certificate_1', value: 'test_certificate_1' },
    { label: 'test_certificate_2', value: 'test_certificate_2' },
  ];
  const mockStoredFilters = {
    filterValues: {
      certifications: [],
    },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps: FilterItemProps<TechnicianRecord> = {
    filterKey: FilterKey.Certifications,
    filterType: 'checkbox',
    label: FilterLabel.Certifications,
    options: mockOptions,
    storedFilters: mockStoredFilters,
    onClearFilter: mockOnClearFilter,
    onFilterChange: mockOnFilterChange,
  };

  const FilterItemComponent = (props?: Partial<FilterItemProps<TechnicianRecord>>) => (
    <FilterItem {...defaultProps} {...props} />
  );

  it('should render component without crashing', () => {
    render(FilterItemComponent());

    expect(screen.getByTestId('AccordionTrigger')).toBeInTheDocument();
    expect(screen.getByTestId('AccordionContent')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear' }));
  });

  it('should call onClearFilter when Clear button is clicked', async () => {
    render(
      FilterItemComponent({
        storedFilters: {
          ...mockStoredFilters,
          filterValues: {
            certifications: [
              {
                value: 'test_certificate_1',
                label: 'test_certificate_1',
              },
            ],
          },
        },
      })
    );

    await userEvent.click(screen.getByRole('button', { name: 'Clear' }));

    expect(mockOnClearFilter).toHaveBeenCalledWith('certifications');
  });

  it('should call onFilterChange when filter option is clicked', async () => {
    render(
      FilterItemComponent({
        storedFilters: {
          ...mockStoredFilters,
          filterValues: {
            certifications: [
              {
                value: 'test_certificate_1',
                label: 'test_certificate_1',
              },
            ],
          },
        },
      })
    );

    await userEvent.click(screen.getByRole('checkbox', { name: 'test_certificate_2' }));

    expect(mockOnFilterChange).toHaveBeenCalledWith(
      'certifications',
      { label: 'test_certificate_2', value: 'test_certificate_2' },
      'checkbox'
    );
  });
});
