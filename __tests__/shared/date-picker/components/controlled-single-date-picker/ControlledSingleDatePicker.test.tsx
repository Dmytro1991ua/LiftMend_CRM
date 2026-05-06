import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { withFormProvider } from '@/mocks/testMocks';
import ControlledSingleDatePicker, {
  ControlledDatePickerProps,
} from '@/shared/date-picker/components/controlled-single-date-picker/ControlledSingleDatePicker';
import { DatePickerProps } from '@/shared/date-picker/DatePicker';
import { getFormErrorState } from '@/shared/utils';

jest.mock('@/shared/utils', () => ({
  ...jest.requireActual('@/shared/utils'),
  getFormErrorState: jest.fn(),
}));

jest.mock('@/shared/date-picker/DatePicker', () => ({
  __esModule: true,
  default: ({ onSingleDateChange, singleDate }: DatePickerProps) => (
    <>
      <button onClick={() => onSingleDateChange?.(new Date('2025-07-15'))}>Mock DatePicker</button>{' '}
      <div>Selected: {singleDate ? singleDate.toDateString() : 'none'}</div>
    </>
  ),
}));

describe('ControlledSingleDatePicker', () => {
  const mockErrorMessage = 'Date name is required';
  const mockOnClearErrors = jest.fn();

  beforeEach(() => {
    (getFormErrorState as jest.Mock).mockReturnValue({
      errorMessage: undefined,
      hasRootError: false,
      hasFieldError: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    name: 'date' as const,
    id: 'date',
    clearErrors: mockOnClearErrors,
  };

  const ControlledSingleDatePickerComponent = (props?: Partial<ControlledDatePickerProps<{ date: Date }>>) =>
    withFormProvider(<ControlledSingleDatePicker {...defaultProps} {...props} />);

  it('should render label if it is provided', () => {
    render(ControlledSingleDatePickerComponent({ label: 'Test label' }));

    expect(screen.getByText('Test label')).toBeInTheDocument();
  });

  it('should render infoTooltip if it is provided', () => {
    render(ControlledSingleDatePickerComponent({ infoTooltip: <p>Test Info Tooltip</p>, isDisabled: true }));

    expect(screen.getByText('Test Info Tooltip')).toBeInTheDocument();
  });

  it('should render error message when getFormErrorState returns an error', () => {
    (getFormErrorState as jest.Mock).mockReturnValue({
      errorMessage: mockErrorMessage,
      hasFieldError: true,
    });

    render(ControlledSingleDatePickerComponent());

    expect(screen.getByText(mockErrorMessage)).toHaveClass('field-error');
  });

  it('should not render error span when there is no error', () => {
    render(ControlledSingleDatePickerComponent());

    expect(screen.queryByText(mockErrorMessage)).not.toBeInTheDocument();
  });

  it('should call onChange and clearErrors when a date is selected', async () => {
    render(ControlledSingleDatePickerComponent());

    await userEvent.click(screen.getByRole('button', { name: /mock datepicker/i }));

    expect(screen.getByText(/Selected: Tue Jul 15 2025/)).toBeInTheDocument();
    expect(mockOnClearErrors).toHaveBeenCalledWith('date');
  });
});
