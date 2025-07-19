import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { TimePickerInputProps } from '@/shared/time-picker/components/TimePickerInput';
import { TimePicker, TimePickerProps } from '@/shared/time-picker/TimePicker';

jest.mock('@/shared/time-picker/components/TimePickerInput', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react');

  const TimePickerInputMock = React.forwardRef(
    (
      { onRightFocus, onLeftFocus, picker, disabled, setDate }: TimePickerInputProps,
      ref: React.Ref<HTMLInputElement>
    ) => {
      return (
        <input
          ref={ref as React.RefObject<HTMLInputElement>}
          data-testid={`timepicker-input-${picker}`}
          disabled={disabled}
          value={picker}
          onChange={() => setDate(new Date())}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') onRightFocus?.();
            if (e.key === 'ArrowLeft') onLeftFocus?.();
          }}
        />
      );
    }
  );
  TimePickerInputMock.displayName = 'TimePickerInput';

  return {
    __esModule: true,
    TimePickerInput: TimePickerInputMock,
  };
});

describe('TimePicker', () => {
  const mockSetDate = jest.fn();
  const mockDate = new Date('2023-01-01T12:34:56');

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    date: mockDate,
    setDate: mockSetDate,
    disabled: false,
  };

  const TimePickerComponent = (props?: Partial<TimePickerProps>) => <TimePicker {...defaultProps} {...props} />;

  it('should render hour and minute inputs and clock icon', () => {
    render(TimePickerComponent());

    expect(screen.getByTestId('timepicker-input-hours')).toBeInTheDocument();
    expect(screen.getByTestId('timepicker-input-minutes')).toBeInTheDocument();

    const svg = screen.getByTestId('clock-icon');

    expect(svg).toBeInTheDocument();
  });

  it('should disables inputs when disabled prop is true', () => {
    render(TimePickerComponent({ disabled: true }));

    expect(screen.getByTestId('timepicker-input-hours')).toBeDisabled();
    expect(screen.getByTestId('timepicker-input-minutes')).toBeDisabled();
  });

  it('should call setDate on input change', () => {
    render(TimePickerComponent());

    const hourInput = screen.getByTestId('timepicker-input-hours');
    fireEvent.change(hourInput, { target: { value: '10' } });

    expect(mockSetDate).toHaveBeenCalledTimes(1);
  });

  it('should focuses minute input when right arrow is pressed on hour input', () => {
    render(TimePickerComponent());

    const hourInput = screen.getByTestId('timepicker-input-hours');
    const minuteInput = screen.getByTestId('timepicker-input-minutes');

    const inputFocusSpy = jest.spyOn(minuteInput, 'focus');

    fireEvent.keyDown(hourInput, { key: 'ArrowRight' });

    expect(inputFocusSpy).toHaveBeenCalled();
  });

  it('should focus hour input when left arrow is pressed on minute input', () => {
    render(TimePickerComponent());

    const hourInput = screen.getByTestId('timepicker-input-hours');
    const minuteInput = screen.getByTestId('timepicker-input-minutes');

    const inputFocusSpy = jest.spyOn(hourInput, 'focus');

    fireEvent.keyDown(minuteInput, { key: 'ArrowLeft' });

    expect(inputFocusSpy).toHaveBeenCalled();
  });
});
