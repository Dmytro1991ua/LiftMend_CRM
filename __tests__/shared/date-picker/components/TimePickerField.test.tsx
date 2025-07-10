import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TimePickerField, { TimePickerFieldProps } from '@/shared/date-picker/components/TimePickerField';
import { TimePickerProps } from '@/shared/time-picker/TimePicker';

const mockNewDate = new Date('2020-11-20T19:23:36Z');

jest.mock('@/shared/time-picker/TimePicker', () => ({
  __esModule: true,
  TimePicker: ({ date, disabled, setDate }: TimePickerProps) => (
    <button data-testid='mock-timepicker' disabled={disabled} onClick={() => setDate(mockNewDate)}>
      Mock TimePicker (date: {date?.toISOString()})
    </button>
  ),
}));

describe('TimePickerField', () => {
  const mockDate = new Date('2020-11-17T19:23:36Z');
  const mockOnHandleTimeChange = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    label: 'Start Date Time',
    subLabel: '(hours/minutes)',
    date: mockDate,
    isDisabled: false,
    onHandleTimeChange: mockOnHandleTimeChange,
    isStartPosition: true,
    dataTestId: 'time-picker-field',
  };

  const TimePickerFieldComponent = (props?: Partial<TimePickerFieldProps>) => (
    <TimePickerField {...defaultProps} {...props} />
  );

  it('should render component without crashing', () => {
    render(TimePickerFieldComponent());

    expect(screen.getByTestId('time-picker-field')).toBeInTheDocument();
  });

  it('should call onHandleTimeChange with correct args when TimePicker setDate is called', async () => {
    render(TimePickerFieldComponent());

    await userEvent.click(screen.getByTestId('mock-timepicker'));

    expect(mockOnHandleTimeChange).toHaveBeenCalledWith(mockNewDate, true);
  });

  it('should disable TimePicker when isDisabled is true and not call handler on click', async () => {
    render(TimePickerFieldComponent({ isDisabled: true }));

    const button = screen.getByTestId('mock-timepicker');
    expect(button).toBeDisabled();

    await userEvent.click(button);

    expect(mockOnHandleTimeChange).not.toHaveBeenCalled();
  });

  it('should call onHandleTimeChange with false as second argument when isStartPosition is false', async () => {
    render(TimePickerFieldComponent({ isStartPosition: false }));

    await userEvent.click(screen.getByTestId('mock-timepicker'));

    expect(mockOnHandleTimeChange).toHaveBeenCalledWith(mockNewDate, false);
  });
});
