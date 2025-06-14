import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { withFormProvider } from '@/mocks/testMocks';
import { getNestedError } from '@/modules/repair-job-scheduling/utils';
import ControlledMultiSelect from '@/shared/base-select/components/controlled-multi-select';
import { ControlledMultiSelectProps } from '@/shared/base-select/types';

jest.mock('@/modules/repair-job-scheduling/utils', () => ({
  ...jest.requireActual('@/modules/repair-job-scheduling/utils'),
  getNestedError: jest.fn(),
}));

describe('ControlledMultiSelect', () => {
  const mockErrorMessage = 'First name is required';
  const mockDropdownOptions = [
    {
      id: 'test-id-1',
      label: 'Option 1',
      value: 'Option 1',
    },
    {
      id: 'test-id-2',
      label: 'Option 2',
      value: 'Option 2',
    },
  ];
  const mockClearErrorsMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    name: 'firstName' as const,
    id: 'firstName',
    options: mockDropdownOptions,
    isMulti: true as const,
  };

  const ControlledMultiSelectComponent = (props?: Partial<ControlledMultiSelectProps<{ firstName: string }>>) =>
    withFormProvider(<ControlledMultiSelect {...defaultProps} {...props} />);

  it('should render component without crashing', () => {
    render(ControlledMultiSelectComponent());

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should render label it is provided', () => {
    render(ControlledMultiSelectComponent({ label: 'Test label' }));

    expect(screen.getByText('Test label')).toBeInTheDocument();
  });

  it('should render error message when getNestedError returns an error', () => {
    (getNestedError as jest.Mock).mockReturnValue({
      message: mockErrorMessage,
    });

    render(ControlledMultiSelectComponent());

    expect(screen.getByText(mockErrorMessage)).toHaveClass('field-error');
  });

  it('should not render error span when there is no error', () => {
    (getNestedError as jest.Mock).mockReturnValue(undefined);

    render(ControlledMultiSelectComponent());

    expect(screen.queryByText(mockErrorMessage)).not.toBeInTheDocument();
  });

  it('should call onChange and update the value when an option is selected', async () => {
    render(ControlledMultiSelectComponent());

    await userEvent.click(screen.getByRole('combobox'));

    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Option 1'));

    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('should call clearErrors when an option is selected', async () => {
    render(ControlledMultiSelectComponent({ clearErrors: mockClearErrorsMock }));

    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByText('Option 1'));

    expect(mockClearErrorsMock).toHaveBeenCalledWith('firstName');
  });

  it('should call clearErrors and select all options when select all is clicked', async () => {
    render(
      ControlledMultiSelectComponent({
        clearErrors: mockClearErrorsMock,
        multipleSelectControls: true,
      })
    );

    await userEvent.click(screen.getByRole('combobox'));

    await waitFor(() => {
      expect(screen.getByText('Select All')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Select All'));

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(mockClearErrorsMock).toHaveBeenCalledWith('firstName');
  });

  it('should call clearErrors and clear all selections when Clear All is clicked', async () => {
    render(
      ControlledMultiSelectComponent({
        clearErrors: mockClearErrorsMock,
        multipleSelectControls: true,
      })
    );

    await userEvent.click(screen.getByRole('combobox'));

    await userEvent.click(screen.getByText('Option 1'));

    await userEvent.click(screen.getByRole('combobox'));

    await waitFor(() => {
      expect(screen.getByTestId('clear-all-control')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Clear All'));

    await userEvent.click(screen.getByRole('combobox'));

    expect(mockClearErrorsMock).toHaveBeenCalledWith('firstName');
  });

  it('should disable select when disabled is true', () => {
    render(ControlledMultiSelectComponent({ disabled: true }));

    const input = screen.getByRole('combobox');

    expect(input).toHaveAttribute('aria-readonly', 'true');
  });
});
