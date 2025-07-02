import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FilterHeader from '@/shared/base-table/table-filters/filter-header';
import { FilterHeaderProps } from '@/shared/base-table/table-filters/filter-header/FilterHeader';

describe('FilterHeader', () => {
  const mockLabel = 'Test Filter';
  const mockOnClear = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    label: mockLabel,
    selectedFiltersCount: 0,
    onClear: mockOnClear,
  };

  const FilterHeaderComponent = (props?: Partial<FilterHeaderProps>) => <FilterHeader {...defaultProps} {...props} />;

  it('should render component without crashing', () => {
    render(FilterHeaderComponent());

    expect(screen.getByText(mockLabel)).toBeInTheDocument();
    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  it('should disable clear button when selectedFiltersCount is 0', () => {
    render(FilterHeaderComponent());

    const clearBtn = screen.getByRole('button', { name: 'Clear' });

    expect(clearBtn).toBeDisabled();
  });

  it('should enable clear button when selectedFiltersCount is grater than 0', () => {
    render(FilterHeaderComponent({ selectedFiltersCount: 2 }));

    const clearBtn = screen.getByRole('button', { name: 'Clear' });

    expect(clearBtn).toBeEnabled();
  });

  it('should clear applied filters on Clear button click', async () => {
    render(FilterHeaderComponent({ selectedFiltersCount: 2 }));

    expect(screen.getByText(mockLabel)).toBeInTheDocument();
    expect(screen.getByText('(2)')).toBeInTheDocument();

    const clearBtn = screen.getByRole('button', { name: 'Clear' });

    await userEvent.click(clearBtn);

    expect(mockOnClear).toHaveBeenCalled();
  });
});
