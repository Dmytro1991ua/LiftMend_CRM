import { render, screen } from '@testing-library/react';

import Step from '@/shared/base-stepper/components/step';
import { StepProps } from '@/shared/base-stepper/components/step/Step';

describe('Step', () => {
  const mockIsStepCompleted = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    step: 'Test First Step',
    stepsLength: 3,
    stepIndex: 0,
    activeStep: 0,
    isStepCompleted: mockIsStepCompleted,
  };

  const StepComponent = (props?: Partial<StepProps>) => <Step {...defaultProps} {...props} />;

  it('should correctly render first step', () => {
    render(StepComponent());

    expect(screen.getByTestId('step')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Test First Step')).toBeInTheDocument();
  });

  it('should correctly render second step', () => {
    render(StepComponent({ ...defaultProps, step: 'Test Second Step', stepIndex: 1, activeStep: 1 }));

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Test Second Step')).toBeInTheDocument();
  });

  it('should correctly render third step', () => {
    render(StepComponent({ ...defaultProps, step: 'Test Third Step', stepIndex: 2, activeStep: 2 }));

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Test Third Step')).toBeInTheDocument();
  });

  it('should correctly apply styles for step if it is not the last one', () => {
    render(StepComponent());

    const step = screen.getByTestId('step');

    expect(step).toHaveClass('w-full flex items-center pr-3');
  });

  it('should correctly apply styles for step', () => {
    render(StepComponent({ stepIndex: 2 }));

    const step = screen.getByTestId('step');

    expect(step).toHaveClass('flex items-center');
  });

  it('should render step line connector', () => {
    render(StepComponent());

    expect(screen.getByTestId('line-connector'));
  });

  it('should not render step line connector if it is last step', () => {
    render(StepComponent({ stepIndex: 2 }));

    expect(screen.queryByTestId('line-connector')).not.toBeInTheDocument();
  });

  it('should render a check icon when the step is completed', () => {
    mockIsStepCompleted.mockReturnValue(true);

    render(StepComponent());

    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('should apply correct styles when step is active and not the first', () => {
    mockIsStepCompleted.mockReturnValue(false);
    render(StepComponent({ stepIndex: 1, activeStep: 1 }));

    const stepCircle = screen.getByTestId('step-circle');

    expect(stepCircle).toHaveClass('border-blue-500 text-blue-500');
  });

  it('should apply correct styles when step is active and completed', () => {
    mockIsStepCompleted.mockReturnValue(true);

    render(StepComponent({ stepIndex: 1, activeStep: 1 }));

    const stepCircle = screen.getByTestId('step-circle');

    expect(stepCircle).toHaveClass('bg-green-500 text-white border-transparent');
  });

  it('should apply gray text when step is inactive and not completed', () => {
    mockIsStepCompleted.mockReturnValue(false);

    render(StepComponent({ stepIndex: 1, activeStep: 0 }));

    expect(screen.getByText('Test First Step')).toHaveClass('text-gray-300');
  });
});
