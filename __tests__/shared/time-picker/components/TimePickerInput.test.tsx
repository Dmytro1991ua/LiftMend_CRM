import { fireEvent, render, screen } from '@testing-library/react';

import { TimePickerInput, TimePickerInputProps } from '@/shared/time-picker/components/TimePickerInput';
import { getArrowByType, getDateByType, setDateByType } from '@/shared/time-picker/utils';

jest.mock('@/shared/time-picker/utils', () => ({
  ...jest.requireActual('@/shared/time-picker/utils'),
  getDateByType: jest.fn(),
  setDateByType: jest.fn(),
  getArrowByType: jest.fn(),
}));

describe('TimePickerInput', () => {
  const mockOnSetDate = jest.fn();
  const mockOnRightFocus = jest.fn();
  const mockOnLeftFocus = jest.fn();
  const mockOnChange = jest.fn();
  const mockOnKeyDown = jest.fn();

  const defaultProps: TimePickerInputProps = {
    picker: '12hours',
    date: new Date('2023-01-01T10:30:00'),
    setDate: mockOnSetDate,
    onRightFocus: mockOnRightFocus,
    onLeftFocus: mockOnLeftFocus,
    onChange: mockOnChange,
    onKeyDown: mockOnKeyDown,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const TimePickerInputComponent = (props?: Partial<TimePickerInputProps>) => (
    <TimePickerInput {...defaultProps} {...props} />
  );

  it('should render with default calculated value', () => {
    (getDateByType as jest.Mock).mockReturnValue('10');

    render(TimePickerInputComponent());

    const input = screen.getByRole('textbox');

    expect(input).toHaveValue('10');
  });

  it('should use controlled value prop if provided', () => {
    render(TimePickerInputComponent({ value: '15' }));

    const input = screen.getByRole('textbox');

    expect(input).toHaveValue('15');
  });

  it('should call onChange when user types, but prevents default', () => {
    render(TimePickerInputComponent());

    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: '1' } });

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should ignore Tab key on keyDown and call onKeyDown', () => {
    render(TimePickerInputComponent());

    const input = screen.getByRole('textbox');

    fireEvent.keyDown(input, { key: 'Tab' });

    expect(mockOnKeyDown).toHaveBeenCalled();
    expect(mockOnSetDate).not.toHaveBeenCalled();
  });

  it('should call onRightFocus on ArrowRight key and onLeftFocus on ArrowLeft key', () => {
    render(TimePickerInputComponent());

    const input = screen.getByRole('textbox');

    fireEvent.keyDown(input, { key: 'ArrowRight' });
    expect(mockOnRightFocus).toHaveBeenCalled();

    fireEvent.keyDown(input, { key: 'ArrowLeft' });
    expect(mockOnLeftFocus).toHaveBeenCalled();
  });

  it('should handle ArrowUp, ArrowDown keys, and updates date', () => {
    (getArrowByType as jest.Mock).mockImplementation((val, step) => {
      if (step === 1) return '11';
      if (step === -1) return '09';

      return val;
    });
    (setDateByType as jest.Mock).mockImplementation((date) => {
      return new Date(date.getTime());
    });

    render(TimePickerInputComponent());

    const input = screen.getByRole('textbox');

    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(mockOnSetDate).toHaveBeenCalled();

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(mockOnSetDate).toHaveBeenCalledTimes(2);
  });

  it('should handle digit keys, update date, toggles flag and call onRightFocus if flag is true and picker is 12hours', () => {
    (setDateByType as jest.Mock).mockImplementation((date, val) => date);
    (getDateByType as jest.Mock).mockReturnValue('01');

    render(TimePickerInputComponent({ date: new Date() }));

    const input = screen.getByRole('textbox');

    fireEvent.keyDown(input, { key: '0' });
    expect(mockOnSetDate).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(input, { key: '1' });
    expect(mockOnRightFocus).toHaveBeenCalled();
  });

  it('should disable input if disabled prop is true', () => {
    render(TimePickerInputComponent({ disabled: true }));

    const input = screen.getByRole('textbox');

    expect(input).toBeDisabled();
  });
});
