import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { withFormProvider } from '@/mocks/testMocks';
import { getNestedError } from '@/modules/repair-job-scheduling/utils';
import ControlledSingleSelect from '@/shared/base-select/components/controlled-single-select';
import { ControlledSingleSelectProps } from '@/shared/base-select/types';

jest.mock('@/modules/repair-job-scheduling/utils', () => ({
  ...jest.requireActual('@/modules/repair-job-scheduling/utils'),
  getNestedError: jest.fn(),
}));

describe('ControlledSingleSelect', () => {
  const mockErrorMessage = 'Last name is required';
  const mockDropdownOptions = [
    {
      id: 'test-id-3',
      label: 'Option 3',
      value: 'Option 3',
    },
    {
      id: 'test-id-4',
      label: 'Option 4',
      value: 'Option 4',
    },
  ];
  const mockClearErrorsMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    name: 'lastName' as const,
    id: 'lastName',
    options: mockDropdownOptions,
  };

  const ControlledSingleSelectComponent = (props?: Partial<ControlledSingleSelectProps<{ lastName: string }>>) =>
    withFormProvider(<ControlledSingleSelect {...defaultProps} {...props} />);

  it('should render component without crashing', () => {
    render(ControlledSingleSelectComponent());

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should render label it is provided', () => {
    render(ControlledSingleSelectComponent({ label: 'Test label' }));

    expect(screen.getByText('Test label')).toBeInTheDocument();
  });

  it('should render error message when getNestedError returns an error', () => {
    (getNestedError as jest.Mock).mockReturnValue({
      message: mockErrorMessage,
    });

    render(ControlledSingleSelectComponent());

    expect(screen.getByText(mockErrorMessage)).toHaveClass('field-error');
  });

  it('should not render error span when there is no error', () => {
    (getNestedError as jest.Mock).mockReturnValue(undefined);

    render(ControlledSingleSelectComponent());

    expect(screen.queryByText(mockErrorMessage)).not.toBeInTheDocument();
  });

  it('should call onChange and update the value when an option is selected', async () => {
    render(ControlledSingleSelectComponent());

    await userEvent.click(screen.getByRole('combobox'));

    await waitFor(() => {
      expect(screen.getByText('Option 4')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Option 4'));

    expect(screen.getByText('Option 4')).toBeInTheDocument();
  });

  it('should call clearErrors when an option is selected', async () => {
    render(ControlledSingleSelectComponent({ clearErrors: mockClearErrorsMock }));

    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByText('Option 3'));

    expect(mockClearErrorsMock).toHaveBeenCalledWith('lastName');
  });

  it('should disable select when disabled is true', () => {
    render(ControlledSingleSelectComponent({ disabled: true }));

    const input = screen.getByRole('combobox');

    expect(input).toHaveAttribute('aria-readonly', 'true');
  });
});
