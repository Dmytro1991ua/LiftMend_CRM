import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import * as form from 'react-hook-form';
import { UseFormReturn } from 'react-hook-form';

import { mockFormState } from '@/mocks/formStateMock';
import { mockSelectedDateRange } from '@/mocks/repairJobScheduling';
import { MockProviderHook } from '@/mocks/testMocks';
import { useRepairJobForm } from '@/modules/repair-job-scheduling/components/repair-job-tracking-from/hooks';
import { useCreateRepairJobAndCalendarEvent } from '@/modules/repair-job-scheduling/hooks/useCreateRepairJobAndCalendarEvent';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';

jest.mock('@/shared/hooks/useMutationResultToasts', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    onSuccess: jest.fn(),
    onError: jest.fn(),
  })),
}));

jest.mock('@/modules/repair-job-scheduling/hooks/useCreateRepairJobAndCalendarEvent');

describe('useRepairJobForm', () => {
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();
  const mockHandleSubmit = jest.fn();
  const mockFormTrigger = jest.fn();
  const mockOnCreateRepairJobAndEvent = jest.fn();
  const mockOnReset = jest.fn();
  const mockFromValues = {
    jobDetails: {
      jobType: 'Emergency',
      jobDescription: 'test description here',
      priority: 'Low',
    },
    elevatorInformation: {
      elevatorType: 'Stadium Lift',
      buildingName: 'Beacon Heights Office Complex',
      elevatorLocation: 'Loading Bay',
    },
    technicianAssignment: {
      selectedTechnician: {
        id: 'test-technician-id-1',
        label: 'Benjamin Hall',
        value: 'test-technician-id-1',
      },
    },
  };

  const defaultProps = {
    selectedDateRange: mockSelectedDateRange,
    onReset: mockOnReset,
  };

  beforeEach(() => {
    (useMutationResultToasts as jest.Mock).mockReturnValue({ onSuccess: mockOnSuccess, onError: mockOnError });

    (useCreateRepairJobAndCalendarEvent as jest.Mock).mockReturnValue({
      onCreateRepairJobAndEvent: mockOnCreateRepairJobAndEvent,
      isLoading: false,
    });

    jest.spyOn(form, 'useFormContext').mockReturnValue({
      formState: {
        ...mockFormState.formState,
      },
      handleSubmit: mockHandleSubmit,
      trigger: mockFormTrigger,
    } as unknown as UseFormReturn);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = () =>
    renderHook(() => useRepairJobForm({ ...defaultProps }), {
      wrapper: ({ children }) => <MockProviderHook mocks={[]}>{children}</MockProviderHook>,
    });

  it('should trigger onHandleNext and validate stepper step', async () => {
    const { result } = hook();

    await act(async () => {
      await result.current.onHandleNext(0);
    });

    expect(mockFormTrigger).toHaveBeenCalledWith('jobDetails');

    await act(async () => {
      await result.current.onHandleNext(1);
    });

    expect(mockFormTrigger).toHaveBeenCalledWith('jobDetails');
    expect(mockFormTrigger).toHaveBeenCalledWith('elevatorInformation');

    await act(async () => {
      await result.current.onHandleNext(2);
    });

    expect(mockFormTrigger).toHaveBeenCalledWith('jobDetails');
    expect(mockFormTrigger).toHaveBeenCalledWith('elevatorInformation');
    expect(mockFormTrigger).toHaveBeenCalledWith('technicianAssignment');
  });

  it('should trigger onSubmit and reset form', async () => {
    mockOnCreateRepairJobAndEvent.mockResolvedValue(true);

    const { result } = hook();

    await act(async () => {
      await result.current.onSubmit(mockFromValues);
    });

    expect(mockOnCreateRepairJobAndEvent).toHaveBeenCalled();
    expect(mockOnReset).toHaveBeenCalled();
  });

  it('should not reset form if mutation fails', async () => {
    mockOnCreateRepairJobAndEvent.mockResolvedValue(false);

    const { result } = hook();

    await act(async () => {
      await result.current.onSubmit(mockFromValues);
    });

    expect(mockOnCreateRepairJobAndEvent).toHaveBeenCalled();
    expect(mockOnReset).not.toHaveBeenCalled();
  });
});
