import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateRange } from 'react-day-picker';

import DashboardDateRangeFilter from '@/modules/dashboard/components/dashboard-date-range-filter';
import { DEFAULT_INFO_TOOLTIP_MESSAGE } from '@/modules/dashboard/components/dashboard-date-range-filter/DashboardDateRangeFilter';
import { DashboardDateRangeFilterProps } from '@/modules/dashboard/components/dashboard-date-range-filter/types';

describe('DashboardDateRangeFilter', () => {
  const mockOnHandleCalendarPopoverClose = jest.fn();

  const defaultProps = {
    sanitizedDateRange: {
      from: new Date('2025-03-31T21:00:00.000Z'),
      to: new Date('2025-04-30T20:59:59.999Z'),
    },
    isCalendarOpen: false,
    onHandleCalendarPopoverClose: mockOnHandleCalendarPopoverClose,
  };

  const DashboardDateRangeFilterComponent = (props?: Partial<DashboardDateRangeFilterProps>) => (
    <DashboardDateRangeFilter {...defaultProps} {...props} />
  );

  it('should render component without crashing', () => {
    render(DashboardDateRangeFilterComponent());

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should render even if sanitizedDateRange has undefined from and to', () => {
    const partialRange = { from: undefined, to: undefined } as unknown as DateRange;

    render(DashboardDateRangeFilterComponent({ sanitizedDateRange: partialRange }));

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should show info tooltip message on info icon hover', async () => {
    render(DashboardDateRangeFilterComponent());

    const infoIcon = screen.getByTestId('info-icon');

    await userEvent.hover(infoIcon);

    const tooltipText = await screen.findByText(DEFAULT_INFO_TOOLTIP_MESSAGE);

    expect(tooltipText).toBeInTheDocument();
  });

  it('should render datepicker calendar', () => {
    render(DashboardDateRangeFilterComponent({ isCalendarOpen: true }));

    expect(screen.getByTestId('popover-content')).toBeInTheDocument();
  });

  it('should call onHandleCalendarPopoverClose when popover changes', async () => {
    render(DashboardDateRangeFilterComponent());

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(mockOnHandleCalendarPopoverClose).toHaveBeenCalled();
  });
});
