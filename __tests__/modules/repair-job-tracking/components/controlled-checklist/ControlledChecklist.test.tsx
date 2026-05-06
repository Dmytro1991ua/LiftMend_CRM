import { render, screen } from '@testing-library/react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import ControlledChecklist from '@/modules/repair-job-tracking/components/complete-repair-job/controlled-checklist';
import { ControlledChecklistProps } from '@/modules/repair-job-tracking/components/complete-repair-job/controlled-checklist/ControlledChecklist';
import { ControlledChecklistItemProps } from '@/modules/repair-job-tracking/components/complete-repair-job/controlled-checklist-Item/ControlledChecklistItem';
import { getFormErrorState } from '@/shared/utils';

jest.mock('react-hook-form', () => ({
  useFormContext: jest.fn(),
  useFieldArray: jest.fn(),
}));

jest.mock('@/shared/utils', () => ({
  ...jest.requireActual('@/shared/utils'),
  getFormErrorState: jest.fn(),
}));

jest.mock('@/modules/repair-job-tracking/components/complete-repair-job/controlled-checklist-Item', () => {
  const MockControlledChecklistItem = (props: ControlledChecklistItemProps<{ checklist: any }>) => (
    <div data-testid='checklist-item'>
      {props.label}
      {props.hasError ? ' error' : ''}
      {props.isDisabled ? ' disabled' : ''}
    </div>
  );

  MockControlledChecklistItem.displayName = 'MockControlledChecklistItem';

  return MockControlledChecklistItem;
});

describe('ControlledChecklist', () => {
  const mockUseFormContext = useFormContext as jest.Mock;
  const mockUseFieldArray = useFieldArray as jest.Mock;
  const mockGetFormErrorState = getFormErrorState as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    name: 'checklist' as const,
    isDisabled: false,
  };

  const mockFormContext = () => {
    mockUseFormContext.mockReturnValue({
      control: {},
      formState: { errors: {} },
    });
  };

  const ControlledChecklistComponent = (props?: Partial<ControlledChecklistProps>) => (
    <ControlledChecklist {...defaultProps} {...props} />
  );

  it('renders checklist items from field array', () => {
    mockFormContext();

    mockUseFieldArray.mockReturnValue({
      fields: [
        { id: '1', label: 'Check motor' },
        { id: '2', label: 'Inspect cables' },
      ],
    });

    mockGetFormErrorState.mockReturnValue({
      errorMessage: undefined,
      hasRootError: false,
      hasFieldError: false,
    });

    render(ControlledChecklistComponent());

    const items = screen.getAllByTestId('checklist-item');

    expect(items).toHaveLength(2);
    expect(screen.getByText('Check motor')).toBeInTheDocument();
    expect(screen.getByText('Inspect cables')).toBeInTheDocument();
  });

  it('should mark items as disabled when isDisabled is true', () => {
    mockFormContext();

    mockUseFieldArray.mockReturnValue({
      fields: [{ id: '1', label: 'Check motor' }],
    });

    mockGetFormErrorState.mockReturnValue({
      errorMessage: undefined,
      hasRootError: false,
      hasFieldError: false,
    });

    render(ControlledChecklistComponent({ isDisabled: true }));

    expect(screen.getByText(/disabled/)).toBeInTheDocument();
  });

  it('should passe error state to checklist items', () => {
    mockFormContext();

    mockUseFieldArray.mockReturnValue({
      fields: [{ id: '1', label: 'Check motor' }],
    });

    mockGetFormErrorState.mockReturnValue({
      errorMessage: undefined,
      hasRootError: false,
      hasFieldError: true,
    });

    render(ControlledChecklistComponent());

    expect(screen.getByText(/error/)).toBeInTheDocument();
  });

  it('should render form error message when present', () => {
    mockFormContext();

    mockUseFieldArray.mockReturnValue({
      fields: [{ id: '1', label: 'Check motor' }],
    });

    mockGetFormErrorState.mockReturnValue({
      errorMessage: 'Checklist is required',
      hasRootError: true,
      hasFieldError: false,
    });

    render(ControlledChecklistComponent());

    expect(screen.getByText('Checklist is required')).toBeInTheDocument();
  });

  it('should not render form items when field array is empty', () => {
    mockFormContext();

    mockUseFieldArray.mockReturnValue({
      fields: [],
    });

    mockGetFormErrorState.mockReturnValue({
      errorMessage: undefined,
      hasRootError: false,
      hasFieldError: false,
    });

    render(ControlledChecklistComponent());

    expect(screen.queryByTestId('checklist-item')).not.toBeInTheDocument();
  });
});
