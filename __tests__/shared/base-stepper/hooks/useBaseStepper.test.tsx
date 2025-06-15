import { act, renderHook } from '@testing-library/react-hooks';

import { useBaseStepper } from '@/shared/base-stepper/hooks';

describe('useBaseStepper', () => {
  const mockOnSubmit = jest.fn();
  const mockOnReset = jest.fn();
  const mockOnHandleNext = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = { totalSteps: 3, onSubmit: mockOnSubmit, onReset: mockOnReset, onHandleNext: mockOnHandleNext };

  const hook = () => renderHook(() => useBaseStepper(defaultProps));

  it('should return correct initial hook data', () => {
    const { result } = hook();

    expect(result.current.activeStep).toEqual(0);
    expect(result.current.isLastStepComplete).toEqual(false);
  });

  it('should not advance to next step if onHandleNext returns false', async () => {
    mockOnHandleNext.mockResolvedValue(false);

    const { result } = hook();

    await act(async () => {
      await result.current.onNextStep();
    });

    expect(result.current.activeStep).toBe(0);
  });

  it('should advance to next step if onHandleNext returns true', async () => {
    mockOnHandleNext.mockResolvedValue(true);

    const { result } = hook();

    await act(async () => {
      await result.current.onNextStep();
    });

    expect(result.current.activeStep).toBe(1);
    expect(result.current.isLastStepComplete).toBe(false);
  });

  it('should set isLastStepComplete and call onSubmit at last step', async () => {
    mockOnHandleNext.mockResolvedValue(true);

    const { result } = hook();

    // move to last step
    await act(async () => {
      await result.current.onNextStep(); // 0 -> 1
      await result.current.onNextStep(); // 1 -> 2
      await result.current.onNextStep(); // 2 -> submit
    });

    expect(result.current.activeStep).toBe(2); // last step
    expect(result.current.isLastStepComplete).toBe(true);
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('should go back a step on previousStep', async () => {
    const { result } = hook();

    await act(async () => {
      await result.current.onNextStep();
    });

    act(() => {
      result.current.onPreviousStep();
    });

    expect(result.current.activeStep).toBe(0);
  });

  it('should not go below step 0 on previousStep', () => {
    const { result } = hook();

    act(() => {
      result.current.onPreviousStep();
    });

    expect(result.current.activeStep).toBe(0);
  });

  it('should call onReset on Cancel button lick', () => {
    const { result } = hook();

    act(() => {
      result.current.onCancel();
    });

    expect(mockOnReset).toHaveBeenCalled();
  });

  it('should return true from isStepCompleted for completed steps', async () => {
    const { result } = hook();

    await act(async () => {
      await result.current.onNextStep();
    });

    expect(result.current.isStepCompleted(0)).toBe(true);
    expect(result.current.isStepCompleted(1)).toBe(false);
  });

  it('should return true from isStepCompleted for all steps when isLastStepComplete is true', async () => {
    const { result } = hook();

    await act(async () => {
      await result.current.onNextStep(); // 0 -> 1
      await result.current.onNextStep(); // 1 -> 2
      await result.current.onNextStep(); // 2 -> submit
    });

    expect(result.current.isStepCompleted(0)).toBe(true);
    expect(result.current.isStepCompleted(1)).toBe(true);
    expect(result.current.isStepCompleted(2)).toBe(true);
  });
});
