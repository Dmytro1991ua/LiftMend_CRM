import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { ControlledInventoryPartItemProps } from '@/modules/repair-job-tracking/components/complete-repair-job/controlled-inventory-part-item/ControlledInventoryPartItem';
import ControlledInventoryPartsList, {
  ControlledInventoryPartsListProps,
} from '@/modules/repair-job-tracking/components/complete-repair-job/controlled-inventory-parts-list/ControlledInventoryPartsList';
import { RepairJobFormInventoryPartUsed } from '@/shared/types';
import { getFormErrorState } from '@/shared/utils';

jest.mock('react-hook-form', () => ({
  useFormContext: jest.fn(),
  useFieldArray: jest.fn(),
}));

jest.mock('@/shared/utils', () => ({
  ...jest.requireActual('@/shared/utils'),
  getFormErrorState: jest.fn(),
}));

jest.mock('@/modules/repair-job-tracking/components/complete-repair-job/controlled-inventory-part-item', () =>
  jest.fn(({ name, onRemove }: ControlledInventoryPartItemProps<{ partsUsed: RepairJobFormInventoryPartUsed[] }>) => (
    <div data-testid={`part-item-${name}`}>
      <button onClick={onRemove}>Remove</button>
    </div>
  ))
);

describe('ControlledInventoryPartsList', () => {
  const mockUseFormContext = useFormContext as jest.Mock;
  const mockUseFieldArray = useFieldArray as jest.Mock;
  const mockGetFormErrorState = getFormErrorState as jest.Mock;
  const mockAppend = jest.fn();
  const mockRemove = jest.fn();
  const mockTrigger = jest.fn();

  const mockFormContext = () => {
    mockUseFormContext.mockReturnValue({
      control: {},
      formState: { errors: {}, isSubmitted: false },
      trigger: mockTrigger,
    });
  };

  const mockFieldArray = () => {
    mockUseFieldArray.mockReturnValue({
      fields: [],
      append: mockAppend,
      remove: mockRemove,
    });
  };

  beforeEach(() => {
    mockFormContext();
    mockFieldArray();
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
    name: 'partsUsed' as const,
    label: 'Parts Used',
    isDisabled: false,
  };

  const ControlledInventoryPartsListComponent = (props?: Partial<ControlledInventoryPartsListProps>) => (
    <ControlledInventoryPartsList {...defaultProps} {...props} />
  );

  it('should render the  and Add Part button as header of the component', () => {
    render(ControlledInventoryPartsListComponent());

    expect(screen.getByText('Parts Used')).toBeInTheDocument();
    expect(screen.getByText('Add Part')).toBeInTheDocument();
  });

  it('should call append with empty inventory part on Add Part click', async () => {
    render(ControlledInventoryPartsListComponent());

    await userEvent.click(screen.getByText('Add Part'));

    expect(mockAppend).toHaveBeenCalledWith({ partId: '', quantity: '' });
  });

  it('should render a Inventory part item for each field', () => {
    mockUseFieldArray.mockReturnValue({
      fields: [{ id: '1' }, { id: '2' }],
    });

    render(ControlledInventoryPartsListComponent());

    expect(screen.getByTestId('part-item-partsUsed.0')).toBeInTheDocument();
    expect(screen.getByTestId('part-item-partsUsed.1')).toBeInTheDocument();
  });

  it('should show root error message when hasRootError and no fields', () => {
    mockGetFormErrorState.mockReturnValue({
      errorMessage: 'At least one part required',
      hasRootError: true,
      hasFieldError: false,
    });

    render(ControlledInventoryPartsListComponent());

    expect(screen.getByText('At least one part required')).toBeInTheDocument();
  });

  it('should hide root error when fields exist', () => {
    mockUseFieldArray.mockReturnValue({
      fields: [{ id: '1' }],
    });
    mockGetFormErrorState.mockReturnValue({
      errorMessage: 'At least one part required',
      hasRootError: true,
      hasFieldError: false,
    });

    render(ControlledInventoryPartsListComponent());

    expect(screen.queryByText('At least one part required')).not.toBeInTheDocument();
  });

  it('should call remove when onRemove is triggered', async () => {
    mockUseFieldArray.mockReturnValue({
      fields: [{ id: '1' }],
      append: mockAppend,
      remove: mockRemove,
    });
    render(ControlledInventoryPartsListComponent());

    render(ControlledInventoryPartsListComponent());

    await userEvent.click(screen.getAllByText('Remove')[0]);

    expect(mockRemove).toHaveBeenCalledWith(0);
  });

  it('should trigger validation when removing the last part and form is submitted', async () => {
    mockUseFormContext.mockReturnValue({
      formState: { errors: {}, isSubmitted: true },
      trigger: mockTrigger,
    });
    mockUseFieldArray.mockReturnValue({
      fields: [{ id: '1' }],
      append: mockAppend,
      remove: mockRemove,
    });

    render(ControlledInventoryPartsListComponent());

    await userEvent.click(screen.getByText('Remove'));

    await waitFor(() => expect(mockTrigger).toHaveBeenCalledWith('partsUsed'));
  });

  it('should not trigger validation when removing non-last part', async () => {
    mockUseFieldArray.mockReturnValue({
      fields: [{ id: '1' }, { id: '2' }],
      append: mockAppend,
      remove: mockRemove,
    });
    mockUseFormContext.mockReturnValue({
      control: {},
      formState: { errors: {} },
      trigger: mockTrigger,
    });

    render(ControlledInventoryPartsListComponent());

    await userEvent.click(screen.getAllByText('Remove')[0]);

    expect(mockTrigger).not.toHaveBeenCalled();
  });

  it('should not trigger validation when form is not submitted', async () => {
    mockUseFieldArray.mockReturnValue({
      fields: [{ id: '1' }],
      append: mockAppend,
      remove: mockRemove,
    });
    mockUseFormContext.mockReturnValue({
      control: {},
      formState: { errors: {} },
      trigger: mockTrigger,
    });

    render(ControlledInventoryPartsListComponent());

    await userEvent.click(screen.getByText('Remove'));

    expect(mockTrigger).not.toHaveBeenCalled();
  });

  it('should apply overflow styles when fields >= 3', () => {
    mockUseFieldArray.mockReturnValue({
      fields: [{ id: '1' }, { id: '2' }, { id: '3' }],
      append: mockAppend,
      remove: mockRemove,
    });

    render(ControlledInventoryPartsListComponent());

    expect(screen.getByTestId('parts-scroll-container')).toHaveClass('h-[30rem]');
  });

  it('should disable Add Part button when isDisabled', () => {
    render(ControlledInventoryPartsListComponent({ isDisabled: true }));

    const button = screen.getByRole('button', { name: /Add Part/i });

    expect(button).toBeDisabled();
  });
});
