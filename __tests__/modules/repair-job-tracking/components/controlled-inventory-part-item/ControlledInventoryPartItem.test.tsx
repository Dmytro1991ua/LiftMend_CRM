import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useFormContext } from 'react-hook-form';

import ControlledInventoryPartItem, {
  ControlledInventoryPartItemProps,
} from '@/modules/repair-job-tracking/components/complete-repair-job/controlled-inventory-part-item/ControlledInventoryPartItem';
import { RepairJobFormInventoryPartUsed } from '@/shared/types';
import { getFormErrorState } from '@/shared/utils';

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useFormContext: jest.fn(),
  Controller: jest.fn(({ render }) => render({ field: { name: 'test', onChange: jest.fn() } })),
}));

jest.mock('@/shared/utils', () => ({
  ...jest.requireActual('@/shared/utils'),
  getFormErrorState: jest.fn(),
}));

jest.mock('@/shared/repair-job/base-inventory-part-item', () =>
  jest.fn(({ renderInput, renderSelect, renderRemove }) => (
    <div data-testid='base-inventory-part-item'>
      {renderSelect}
      {renderInput}
      {renderRemove}
    </div>
  ))
);

jest.mock('@/shared/base-input/form-input', () =>
  jest.fn(({ placeholder }) => <input data-testid='form-input' placeholder={placeholder} />)
);

jest.mock('@/shared/base-select/components/controlled-single-select', () =>
  jest.fn(({ placeholder, disabled }) => (
    <div data-disabled={String(disabled)} data-testid='controlled-single-select'>
      {placeholder}
    </div>
  ))
);

describe('ControlledInventoryPartItem', () => {
  const mockWatch = jest.fn();
  const mockClearErrors = jest.fn();
  const mockOnRemove = jest.fn();

  const mockUseFormContext = useFormContext as jest.Mock;
  const mockGetFormErrorState = getFormErrorState as jest.Mock;

  beforeEach(() => {
    (getFormErrorState as jest.Mock).mockReturnValue({
      errorMessage: undefined,
      hasRootError: false,
      hasFieldError: false,
    });

    mockUseFormContext.mockReturnValue({
      control: {},
      watch: mockWatch.mockReturnValue(''),
      clearErrors: mockClearErrors,
      formState: { errors: {} },
    });

    mockGetFormErrorState.mockReturnValue({ hasFieldError: false });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps: ControlledInventoryPartItemProps<{ partsUsed: RepairJobFormInventoryPartUsed[] }> = {
    name: 'partsUsed.0',
    isDisabled: false,
    options: [],
    onRemove: mockOnRemove,
  };

  const ControlledInventoryPartItemComponent = (
    props?: Partial<
      ControlledInventoryPartItemProps<
        ControlledInventoryPartItemProps<{ partsUsed: RepairJobFormInventoryPartUsed[] }>
      >
    >
  ) => render(<ControlledInventoryPartItem {...defaultProps} {...props} />);

  it('should render all child components', () => {
    ControlledInventoryPartItemComponent();

    expect(screen.getByTestId('base-inventory-part-item')).toBeInTheDocument();
    expect(screen.getByTestId('form-input')).toBeInTheDocument();
    expect(screen.getByTestId('controlled-single-select')).toBeInTheDocument();
  });

  it('should render form input with correct placeholder', () => {
    ControlledInventoryPartItemComponent();

    expect(screen.getByPlaceholderText('Add part quantity')).toBeInTheDocument();
  });

  it('should render select with correct placeholder', () => {
    ControlledInventoryPartItemComponent();

    expect(screen.getByText('Select an inventory part...')).toBeInTheDocument();
  });

  it('should pass disabled to ControlledSingleSelect when isDisabled is true', () => {
    ControlledInventoryPartItemComponent({ isDisabled: true });

    expect(screen.getByTestId('controlled-single-select')).toHaveAttribute('data-disabled', 'true');
  });

  it('should render remove button', () => {
    ControlledInventoryPartItemComponent();

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should call onRemove when remove button is clicked', async () => {
    ControlledInventoryPartItemComponent();

    await userEvent.click(screen.getByRole('button'));

    expect(mockOnRemove).toHaveBeenCalledTimes(1);
  });

  it('should not call onRemove when it is not provided', async () => {
    ControlledInventoryPartItemComponent({ onRemove: undefined });

    await userEvent.click(screen.getByRole('button'));

    expect(mockOnRemove).not.toHaveBeenCalled();
  });

  it('should watch the quantity field', () => {
    ControlledInventoryPartItemComponent();

    expect(mockWatch).toHaveBeenCalledWith('partsUsed.0.quantity');
  });
});
