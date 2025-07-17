import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateRange } from 'react-day-picker';

import { withFormProvider } from '@/mocks/testMocks';
import { getNestedError } from '@/modules/repair-job-scheduling/utils';
import ControlledDateRangePicker, {
  ControlledDateRangePickerProps,
} from '@/shared/date-picker/components/controlled-date-range-picker/ControlledDateRangePicker';

jest.mock('@/modules/repair-job-scheduling/utils', () => ({
  ...jest.requireActual('@/modules/repair-job-scheduling/utils'),
  getNestedError: jest.fn(),
}));

describe('ControlledDateRangePicker', () => {
  const mockErrorMessage = 'Date range name is required';
  const mockOnClearErrors = jest.fn();

  // Save the original Date constructor to restore later
  const RealDate = Date;

  // Fixed date string to be used as the "current" date in tests
  const FIXED_DATE_STRING = '2025-07-15T12:00:00Z';
  const FIXED_DATE = new RealDate(FIXED_DATE_STRING);

  beforeEach(() => {
    // Mock the global Date constructor to control the current date/time in tests
    global.Date = class extends RealDate {
      // @ts-ignore
      // When called without arguments, always return the fixed mock date
      // This ensures that `new Date()` inside tested code returns a consistent, predictable date
      constructor(...args: unknown[]) {
        // If called with arguments, behave like the original Date constructor
        if (args.length === 0) {
          return FIXED_DATE;
        }

        // @ts-ignore
        return new RealDate(...args);
      }

      // Override Date.now() to return the fixed timestamp, keeping it consistent with new Date()
      static now() {
        return FIXED_DATE.getTime();
      }
    } as typeof Date;
  });

  afterEach(() => {
    global.Date = RealDate;

    jest.clearAllMocks();
  });

  const defaultProps = {
    name: 'dateRange' as const,
    id: 'dateRange',
    clearErrors: mockOnClearErrors,
  };

  const ControlledDateRangePickerComponent = (
    props?: Partial<ControlledDateRangePickerProps<{ dateRange: DateRange }>>
  ) => withFormProvider(<ControlledDateRangePicker {...defaultProps} {...props} />);

  it('should render label if it is provided', () => {
    render(ControlledDateRangePickerComponent({ label: 'Test label' }));

    expect(screen.getByText('Test label')).toBeInTheDocument();
  });

  it('should render infoTooltip if it is provided', () => {
    render(ControlledDateRangePickerComponent({ infoTooltip: <p>Test Info Tooltip</p>, isDisabled: true }));

    expect(screen.getByText('Test Info Tooltip')).toBeInTheDocument();
  });

  it('should render error message when getNestedError returns an error', () => {
    (getNestedError as jest.Mock).mockReturnValue({
      message: mockErrorMessage,
    });

    render(ControlledDateRangePickerComponent());

    expect(screen.getByText(mockErrorMessage)).toHaveClass('field-error');
  });

  it('should not render error span when there is no error', () => {
    (getNestedError as jest.Mock).mockReturnValue(undefined);

    render(ControlledDateRangePickerComponent());

    expect(screen.queryByText(mockErrorMessage)).not.toBeInTheDocument();
  });

  it('should call onChange and clearErrors and update the value when an option is selected', async () => {
    render(ControlledDateRangePickerComponent());

    await userEvent.click(screen.getByRole('button', { name: /pick a date/i }));

    const day15Btns = screen.getAllByRole('gridcell', { name: '15' });
    const day15Btn = day15Btns.find((btn) => !btn.hasAttribute('disabled'));

    expect(day15Btn).toBeDefined();
    await userEvent.click(day15Btn!);

    const day16Btns = screen.getAllByRole('gridcell', { name: '16' });
    const day16Btn = day16Btns.find((btn) => !btn.hasAttribute('disabled'));

    expect(day16Btn).toBeDefined();
    await userEvent.click(day16Btn!);

    expect(
      screen.getByRole('button', {
        name: /Jul 15, 2025.*Jul 16, 2025/i,
      })
    ).toBeInTheDocument();
    expect(mockOnClearErrors).toHaveBeenCalledWith('dateRange');
  });
});
