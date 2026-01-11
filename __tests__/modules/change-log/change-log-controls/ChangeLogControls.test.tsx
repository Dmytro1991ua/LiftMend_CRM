import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { withApolloProvider } from '@/mocks/testMocks';
import ChangeLogControls from '@/modules/change-log/change-log-controls';
import { ChangeLogState } from '@/modules/change-log/types';
import usePageFilters from '@/shared/base-table/hooks/useFilterInTable';
import { useBaseToast } from '@/shared/hooks';
import { useFetchDropdownOptions } from '@/shared/hooks/useFetchDropdownOptions';

jest.mock('@/shared/hooks/useFetchDropdownOptions');
jest.mock('@/shared/base-table/hooks/useFilterInTable');
jest.mock('@/shared/hooks', () => ({
  ...jest.requireActual('@/shared/hooks'),
  useBaseToast: jest.fn(() => ({
    baseToast: jest.fn(),
  })),
}));
jest.mock('@/shared/base-date-range-filter', () => ({
  __esModule: true,
  default: jest.fn(({ isCalendarOpen, sanitizedDateRange, onHandleCalendarPopoverClose }) => (
    <div data-testid='base-date-range-filter'>
      <button data-testid='date-range-toggle' onClick={() => onHandleCalendarPopoverClose(true)} />
      <span>{String(isCalendarOpen)}</span>
      <span>{sanitizedDateRange?.from?.toISOString()}</span>
    </div>
  )),
}));

describe('ChangeLogControls', () => {
  const mockChangeLogPageStoredState = { filters: {} };
  const mockOnSetChangeLogPageStoredState = jest.fn();
  const mockOnFilterChange = jest.fn();
  const mockOnClearFilter = jest.fn();
  const mockBaseToast = jest.fn();
  const mockOnHandleCalendarPopoverClose = jest.fn();
  const mockDropdownOptions = {
    actions: [
      { value: 'Create', label: 'Create' },
      { value: 'Update', label: 'Update' },
    ],
    entityTypes: [
      { value: 'RepairJob', label: 'RepairJob' },
      { value: 'User', label: 'User' },
    ],
    users: [
      { value: '123', label: 'Alice' },
      { value: '456', label: 'Bob' },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useFetchDropdownOptions as jest.Mock).mockReturnValue({
      dropdownOptions: mockDropdownOptions,
      loading: false,
      error: undefined,
    });

    (usePageFilters as jest.Mock).mockReturnValue({
      filters: {},
      onFilterChange: mockOnFilterChange,
      onClearFilter: mockOnClearFilter,
    });

    (useBaseToast as jest.Mock).mockReturnValue({
      baseToast: mockBaseToast,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    isCalendarOpen: false,
    sanitizedDateRange: {
      from: new Date('2025-04-01T00:00:00.000Z'),
      to: new Date('2025-04-30T23:59:59.999Z'),
    },
    onHandleCalendarPopoverClose: mockOnHandleCalendarPopoverClose,
    changeLogPageStoredState: mockChangeLogPageStoredState,
    onSetChangeLogPageStoredState: mockOnSetChangeLogPageStoredState,
  };

  const ChangeLogControlsComponent = (props?: Partial<ChangeLogState>) =>
    withApolloProvider(<ChangeLogControls {...defaultProps} {...props} />);

  it('should render component without crashing', () => {
    render(ChangeLogControlsComponent());

    expect(screen.getByTestId('change-log-controls')).toBeInTheDocument();
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('should call onSetChangeLogPageStoredState when a filter is changed', async () => {
    render(ChangeLogControlsComponent());

    const filtersBtn = screen.getByText('Filters');

    await userEvent.click(filtersBtn);

    const portal = within(document.body);

    const actionFilter = await portal.findByText('Action');

    await userEvent.click(actionFilter);

    const createOption = screen.getByText('Create');

    await userEvent.click(createOption);

    expect(mockOnFilterChange).toHaveBeenCalled();
  });

  it('should display error when useFetchDropdownOptions returns error', () => {
    (useFetchDropdownOptions as jest.Mock).mockReturnValueOnce({
      dropdownOptions: mockDropdownOptions,
      loading: false,
      error: { message: 'Failed to fetch' },
    });

    render(ChangeLogControlsComponent());

    expect(mockBaseToast).toHaveBeenCalledWith('Failed to fetch change log filter data', {
      message: 'Failed to fetch',
    });
  });

  it('should call onHandleCalendarPopoverClose on button click', async () => {
    render(ChangeLogControlsComponent());

    const toggleBtn = screen.getByTestId('date-range-toggle');

    await userEvent.click(toggleBtn);

    expect(mockOnHandleCalendarPopoverClose).toHaveBeenCalledWith(true);
  });
});
