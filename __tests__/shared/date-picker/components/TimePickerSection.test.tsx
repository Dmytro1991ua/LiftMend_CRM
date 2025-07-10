import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TimePickerFieldProps } from '@/shared/date-picker/components/TimePickerField';
import TimePickerSection, { TimePickerSectionProps } from '@/shared/date-picker/components/TimePickerSection';

jest.mock('@/shared/date-picker/components/TimePickerField', () => ({
  __esModule: true,
  default: ({ label, subLabel, isDisabled, date, onHandleTimeChange, dataTestId }: TimePickerFieldProps) => (
    <button
      data-testid={dataTestId}
      disabled={isDisabled}
      onClick={() => onHandleTimeChange?.(new Date('2025-01-01T12:00:00'))}>
      Mock Time Picker Field - {label} ({subLabel}) - {date?.toISOString()}
    </button>
  ),
}));

describe('TimePickerSection', () => {
  const mockFromDate = new Date('2024-07-10T10:00:00Z');
  const mockToDate = new Date('2024-07-11T15:00:00Z');
  const mockSingleDate = new Date('2024-08-12T08:30:00Z');
  const mockOnHandleTimeChange = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    dateRange: {
      from: mockFromDate,
      to: mockToDate,
    },
    singleDate: mockSingleDate,
    isDisabled: false,
    onHandleTimeChange: mockOnHandleTimeChange,
  };

  const TimePickerSectionComponent = (props?: Partial<TimePickerSectionProps>) => (
    <TimePickerSection {...defaultProps} {...props} />
  );

  it('should render both start and end time pickers when dateRange is provided', () => {
    render(TimePickerSectionComponent());

    expect(screen.getByTestId('time-picker-from-date-range')).toBeInTheDocument();
    expect(screen.getByTestId('time-picker-to-date-range')).toBeInTheDocument();
  });

  it('should render only single date time picker when singleDate is provided', () => {
    render(TimePickerSectionComponent({ dateRange: undefined }));

    expect(screen.getByTestId('time-picker-single-date')).toBeInTheDocument();
  });

  it('should nothing when neither dateRange nor singleDate is provided', () => {
    render(TimePickerSectionComponent({ dateRange: undefined, singleDate: undefined }));

    expect(screen.queryByTestId('time-picker-from-date-range')).not.toBeInTheDocument();
    expect(screen.queryByTestId('time-picker-to-date-range')).not.toBeInTheDocument();
    expect(screen.queryByTestId('time-picker-single-date')).not.toBeInTheDocument();
  });

  it('should calls onHandleTimeChange when clicking start time picker from date range)', async () => {
    render(TimePickerSectionComponent());

    await userEvent.click(screen.getByTestId('time-picker-from-date-range'));

    expect(mockOnHandleTimeChange).toHaveBeenCalledWith(new Date('2025-01-01T12:00:00'), true);
  });

  it('should call onHandleTimeChange when clicking end time picker from date range', async () => {
    render(TimePickerSectionComponent());

    await userEvent.click(screen.getByTestId('time-picker-to-date-range'));

    expect(mockOnHandleTimeChange).toHaveBeenCalledWith(new Date('2025-01-01T12:00:00'), false);
  });

  it('should call onHandleTimeChange with date only in singleDate mode', async () => {
    render(TimePickerSectionComponent({ dateRange: undefined }));

    await userEvent.click(screen.getByTestId('time-picker-single-date'));

    expect(mockOnHandleTimeChange).toHaveBeenCalledWith(new Date('2025-01-01T12:00:00'));
  });
});
