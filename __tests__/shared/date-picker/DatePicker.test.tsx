import { PopoverContentProps, PopoverProps, PopoverTriggerProps } from '@radix-ui/react-popover';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  DateRange,
  DayPickerRangeProps,
  DayPickerSingleProps,
  SelectRangeEventHandler,
  SelectSingleEventHandler,
} from 'react-day-picker';

import { CalendarProps } from '@/components/ui/calendar';
import DatePicker, { DatePickerProps } from '@/shared/date-picker/DatePicker';
import { useDatePicker } from '@/shared/date-picker/hooks';

const mockFromDate = new Date('2024-08-12T08:00:00Z');
const mockToDate = new Date('2024-08-20T12:00:00Z');
const mockSingleDate = new Date('2024-09-13T09:30:00Z');

let savedOnSelect: SelectSingleEventHandler | SelectRangeEventHandler | undefined;

jest.mock('@/components/ui/popover', () => ({
  Popover: ({ children, onOpenChange }: any) => (
    <div
      data-testid='mock-popover'
      onClick={() => onOpenChange && onOpenChange(false, { from: mockFromDate, to: mockToDate })}>
      {children}
    </div>
  ),
  PopoverTrigger: ({ children }: PopoverTriggerProps) => <div data-testid='mock-trigger'>{children}</div>,
  PopoverContent: ({ children }: PopoverContentProps) => <div data-testid='mock-content'>{children}</div>,
}));

jest.mock('@/components/ui/calendar', () => ({
  Calendar: (props: DayPickerSingleProps | DayPickerRangeProps) => {
    savedOnSelect = props.onSelect;

    return (
      <div
        data-testid='mock-calendar'
        onClick={() => {
          if (!savedOnSelect) return;

          const mockReactMouseEvent = {} as React.MouseEvent<Element, MouseEvent>;

          if (props.mode === 'single') {
            savedOnSelect(mockSingleDate as Date & DateRange, {} as Date, {} as any, mockReactMouseEvent);
          } else if (props.mode === 'range') {
            savedOnSelect(
              { from: mockFromDate, to: mockToDate } as Date & DateRange,
              {} as Date,
              {},
              mockReactMouseEvent
            );
          }
        }}>
        Mock Calendar
      </div>
    );
  },
}));

jest.mock('@/shared/date-picker/components/TimePickerSection', () => ({
  __esModule: true,
  default: () => <div data-testid='mock-time-picker-section'>Mock TimePickerSection</div>,
}));

jest.mock('@/shared/date-picker/hooks');

describe('DatePicker', () => {
  const mockOnHandlePopoverChange = jest.fn();
  const mockOnSelectSingleDate = jest.fn();

  beforeEach(() => {
    (useDatePicker as jest.Mock).mockReturnValue({
      dateRangeState: {
        from: mockFromDate,
        to: mockToDate,
      },
      singleDateState: undefined,
      onHandleSelectDates: jest.fn(),
      onHandleSelectSingleDate: mockOnSelectSingleDate,
      onHandleTimeChange: jest.fn(),
      onHandlePopoverChange: mockOnHandlePopoverChange,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps: DatePickerProps = {
    dateRange: {
      from: mockFromDate,
      to: mockToDate,
    },
    singleDate: undefined,
    isCalendarOpen: true,
    onHandlePopoverChange: mockOnHandlePopoverChange,
  };

  const DatePickerComponent = (props?: Partial<DatePickerProps>) => <DatePicker {...defaultProps} {...props} />;

  it('should render date picker button', () => {
    render(DatePickerComponent());

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Aug 12, 2024 11:00 AM - Aug 20, 2024 15:00 PM')).toBeInTheDocument();
  });

  it('should render calendar and time picker when calendar is open', () => {
    render(DatePickerComponent());

    expect(screen.getByTestId('mock-popover')).toBeInTheDocument();
    expect(screen.getByTestId('mock-calendar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-time-picker-section')).toBeInTheDocument();
  });

  it('should render disabled date picker button when isDisabled is true', () => {
    render(DatePickerComponent({ isDisabled: true }));

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should not render TimePickerSection if both dateRangeState and singleDateState are undefined', () => {
    (useDatePicker as jest.Mock).mockReturnValue({
      dateRangeState: undefined,
      singleDateState: undefined,
      onHandleSelectDates: jest.fn(),
      onHandleSelectSingleDate: jest.fn(),
      onHandleTimeChange: jest.fn(),
    });

    render(DatePickerComponent());

    expect(screen.queryByTestId('mock-time-picker-section')).not.toBeInTheDocument();
  });

  it('should call onHandlePopoverChange when popover open changes', async () => {
    render(DatePickerComponent({ isCalendarOpen: true }));

    const popover = screen.getByTestId('mock-popover');

    await userEvent.click(popover);

    expect(mockOnHandlePopoverChange).toHaveBeenCalledWith(false, defaultProps.dateRange);
  });

  it('should calls onHandleSelectSingleDate in single date mode', async () => {
    render(DatePickerComponent({ isDateRangeMode: false, isCalendarOpen: true }));

    const calendar = screen.getByTestId('mock-calendar');

    await userEvent.click(calendar);

    expect(mockOnSelectSingleDate).toHaveBeenCalled();
  });
});
