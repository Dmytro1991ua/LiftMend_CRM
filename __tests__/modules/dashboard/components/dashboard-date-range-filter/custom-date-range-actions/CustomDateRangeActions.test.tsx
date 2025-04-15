import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfToday,
  startOfWeek,
  subDays,
  subMonths,
} from 'date-fns';

import CustomDateRangeActions from '@/modules/dashboard/components/dashboard-date-range-filter/custom-date-range-actions';
import {
  DashboardDateRangeFilterProps,
  DateRangeActionLabel,
} from '@/modules/dashboard/components/dashboard-date-range-filter/types';

describe('CustomDateRangeActions', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  const mockOnHandleCalendarPopoverClose = jest.fn();

  const defaultProps = {
    sanitizedDateRange: {
      from: new Date('2025-03-31T21:00:00.000Z'),
      to: new Date('2025-04-30T20:59:59.999Z'),
    },
    onHandleCalendarPopoverClose: mockOnHandleCalendarPopoverClose,
  };

  const CustomDateRangeActionsComponent = (props?: Partial<DashboardDateRangeFilterProps>) => (
    <CustomDateRangeActions {...defaultProps} {...props} />
  );

  it('should render component without crashing', () => {
    render(CustomDateRangeActionsComponent());

    Object.values(DateRangeActionLabel).forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('should correctly apply dates for Today date range and close calendar', async () => {
    const mockExpectedDateRanges = { from: startOfToday(), to: startOfToday() };

    render(CustomDateRangeActionsComponent());

    const todayButton = screen.getByText(DateRangeActionLabel.Today);

    await userEvent.click(todayButton);

    expect(mockOnHandleCalendarPopoverClose).toHaveBeenCalledWith(false, mockExpectedDateRanges);
  });

  it('should correctly apply dates for Last Month date range and close calendar', async () => {
    const mockExpectedDateRanges = {
      from: startOfMonth(subMonths(new Date(), 1)),
      to: endOfMonth(subMonths(new Date(), 1)),
    };

    render(CustomDateRangeActionsComponent());

    const lastMonthButton = screen.getByText(DateRangeActionLabel.LastMonth);

    await userEvent.click(lastMonthButton);

    expect(mockOnHandleCalendarPopoverClose).toHaveBeenCalledWith(false, mockExpectedDateRanges);
  });

  it('should correctly apply dates for Last Week date range and close calendar', async () => {
    const mockExpectedDateRanges = { from: startOfWeek(subDays(new Date(), 7)), to: endOfWeek(subDays(new Date(), 7)) };

    render(CustomDateRangeActionsComponent());

    const lastWeekButton = screen.getByText(DateRangeActionLabel.LastWeek);

    await userEvent.click(lastWeekButton);

    expect(mockOnHandleCalendarPopoverClose).toHaveBeenCalledWith(false, mockExpectedDateRanges);
  });

  it('should correctly apply dates for Next Month date range and close calendar', async () => {
    const mockExpectedDateRanges = {
      from: startOfMonth(addMonths(new Date(), 1)),
      to: endOfMonth(addMonths(new Date(), 1)),
    };

    render(CustomDateRangeActionsComponent());

    const nextMonthButton = screen.getByText(DateRangeActionLabel.NextMonth);

    await userEvent.click(nextMonthButton);

    expect(mockOnHandleCalendarPopoverClose).toHaveBeenCalledWith(false, mockExpectedDateRanges);
  });

  it('should correctly apply dates for Next Week date range and close calendar', async () => {
    const mockExpectedDateRanges = { from: startOfWeek(addDays(new Date(), 7)), to: endOfWeek(addDays(new Date(), 7)) };

    render(CustomDateRangeActionsComponent());

    const nextWeekButton = screen.getByText(DateRangeActionLabel.NextWeek);

    await userEvent.click(nextWeekButton);

    expect(mockOnHandleCalendarPopoverClose).toHaveBeenCalledWith(false, mockExpectedDateRanges);
  });

  it('should correctly apply dates for This Month date range and close calendar', async () => {
    const mockExpectedDateRanges = { from: startOfMonth(new Date()), to: endOfMonth(new Date()) };

    render(CustomDateRangeActionsComponent());

    const thisMonthButton = screen.getByText(DateRangeActionLabel.ThisMonth);

    await userEvent.click(thisMonthButton);

    expect(mockOnHandleCalendarPopoverClose).toHaveBeenCalledWith(false, mockExpectedDateRanges);
  });

  it('should correctly apply dates for This Week date range and close calendar', async () => {
    const mockExpectedDateRanges = { from: startOfWeek(new Date()), to: endOfWeek(new Date()) };

    render(CustomDateRangeActionsComponent());

    const thisWeekButton = screen.getByText(DateRangeActionLabel.ThisWeek);

    await userEvent.click(thisWeekButton);

    expect(mockOnHandleCalendarPopoverClose).toHaveBeenCalledWith(false, mockExpectedDateRanges);
  });

  it('should correctly apply dates for Today date range and close calendar', async () => {
    render(CustomDateRangeActionsComponent());

    const todayButton = screen.getByText(DateRangeActionLabel.Today);

    await userEvent.click(todayButton);

    expect(mockOnHandleCalendarPopoverClose).toHaveBeenCalled();
  });

  it('should correctly apply dates for Tommorow date range and close calendar', async () => {
    const mockExpectedDateRanges = { from: addDays(startOfToday(), 1), to: addDays(startOfToday(), 1) };

    render(CustomDateRangeActionsComponent());

    const tommorowButton = screen.getByText(DateRangeActionLabel.Tomorrow);

    await userEvent.click(tommorowButton);

    expect(mockOnHandleCalendarPopoverClose).toHaveBeenCalledWith(false, mockExpectedDateRanges);
  });

  it('should correctly apply dates for Yesterday date range and close calendar', async () => {
    render(CustomDateRangeActionsComponent());

    const yesterdayButton = screen.getByText(DateRangeActionLabel.Yesterday);

    await userEvent.click(yesterdayButton);

    expect(mockOnHandleCalendarPopoverClose).toHaveBeenCalled();
  });
});
