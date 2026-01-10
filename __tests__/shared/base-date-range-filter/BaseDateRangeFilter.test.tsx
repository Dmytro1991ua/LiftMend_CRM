import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateRange } from 'react-day-picker';

import { DEFAULT_CHANGE_LOG_DATE_RANGE_INFO_TOOLTIP_MESSAGE } from '@/modules/change-log/constants';
import BaseDateRangeFilter from '@/shared/base-date-range-filter';
import { BaseDateRangeFilterProps } from '@/shared/base-date-range-filter/types';

describe('BaseDateRangeFilter', () => {
  const mockOnHandleCalendarPopoverClose = jest.fn();

  const defaultProps = {
    sanitizedDateRange: {
      from: new Date('2025-03-31T21:00:00.000Z'),
      to: new Date('2025-04-30T20:59:59.999Z'),
    },
    isCalendarOpen: false,
    onHandleCalendarPopoverClose: mockOnHandleCalendarPopoverClose,
  };

  const BaseDateRangeFilterComponent = (props?: Partial<BaseDateRangeFilterProps>) => (
    <BaseDateRangeFilter {...defaultProps} {...props} />
  );

  it('should render component without crashing', () => {
    render(BaseDateRangeFilterComponent());

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should render even if sanitizedDateRange has undefined from and to', () => {
    const partialRange = { from: undefined, to: undefined } as unknown as DateRange;

    render(BaseDateRangeFilterComponent({ sanitizedDateRange: partialRange }));

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should show info tooltip message on info icon hover', async () => {
    render(BaseDateRangeFilterComponent({ tooltipMessage: DEFAULT_CHANGE_LOG_DATE_RANGE_INFO_TOOLTIP_MESSAGE }));

    const infoIcon = screen.getByTestId('info-icon');

    await userEvent.hover(infoIcon);

    const tooltipText = await screen.findByText(DEFAULT_CHANGE_LOG_DATE_RANGE_INFO_TOOLTIP_MESSAGE);

    expect(tooltipText).toBeInTheDocument();
  });

  it('should render datepicker calendar', () => {
    render(BaseDateRangeFilterComponent({ isCalendarOpen: true }));

    expect(screen.getByTestId('popover-content')).toBeInTheDocument();
  });

  it('should call onHandleCalendarPopoverClose when popover changes', async () => {
    render(BaseDateRangeFilterComponent());

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(mockOnHandleCalendarPopoverClose).toHaveBeenCalled();
  });
});
