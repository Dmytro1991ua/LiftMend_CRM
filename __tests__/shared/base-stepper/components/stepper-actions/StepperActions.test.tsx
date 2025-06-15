import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import StepperActions from '@/shared/base-stepper/components/stepper-actions';
import { StepperActionsProps } from '@/shared/base-stepper/components/stepper-actions/StepperActions';

describe('StepperActions', () => {
  const mockOnHandlePreviousStep = jest.fn();
  const mockOnHandleNextStep = jest.fn();
  const mockOnCancel = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    activeStep: 0,
    stepsLength: 3,
    onHandlePreviousStep: mockOnHandlePreviousStep,
    onHandleNextStep: mockOnHandleNextStep,
    onCancel: mockOnCancel,
    isComplete: false,
    isLoading: false,
  };

  const StepperActionsComponent = (props?: Partial<StepperActionsProps>) => (
    <StepperActions {...defaultProps} {...props} />
  );

  it('should render Cancel and Next buttons', () => {
    render(StepperActionsComponent());

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('should render Back button when step is second or higher but not last one', () => {
    render(StepperActionsComponent({ activeStep: 1 }));

    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
  });

  it('should render Submit button when step is last one', () => {
    render(StepperActionsComponent({ activeStep: 2 }));

    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('should trigger onCancel on Cancel button click', async () => {
    render(StepperActionsComponent());

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should trigger onHandleNextStep on Next button click', async () => {
    render(StepperActionsComponent());

    await userEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(mockOnHandleNextStep).toHaveBeenCalled();
  });

  it('should trigger onHandlePreviousStep on Back button click', async () => {
    render(StepperActionsComponent({ activeStep: 1 }));

    await userEvent.click(screen.getByRole('button', { name: 'Back' }));

    expect(mockOnHandlePreviousStep).toHaveBeenCalled();
  });

  it('should disable Submit button when last step is completed', () => {
    render(StepperActionsComponent({ activeStep: 2, isComplete: true }));

    const submitButton = screen.getByRole('button', { name: 'Submit' });

    expect(submitButton).toBeDisabled();
  });

  it('should show loader om Submit button when isLoading is true', () => {
    render(StepperActionsComponent({ activeStep: 2, isLoading: true }));

    const submitButton = screen.getAllByRole('button')[1];

    expect(submitButton).toBeDisabled();
    expect(screen.getByTestId('btn-loader')).toBeInTheDocument();
  });
});
