import { act, renderHook } from '@testing-library/react-hooks';

import { mockFormState } from '@/mocks/formStateMock';
import { mockRepairJob } from '@/mocks/repairJobTrackingMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import { useCompleteRepairJob } from '@/modules/repair-job-tracking/components/complete-repair-job/hooks';
import { useFormState, useModal } from '@/shared/hooks';
import { useUpdateRepairJob } from '@/shared/repair-job/hooks';

jest.mock('@/shared/hooks', () => ({
  ...jest.requireActual('@/shared/hooks'),
  useFormState: jest.fn(),
  useModal: jest.fn(),
}));

jest.mock('@/shared/repair-job/hooks', () => ({
  useUpdateRepairJob: jest.fn(),
}));

describe('useCompleteRepairJob', () => {
  const mockOnReset = jest.fn();
  const mockOnOpenModal = jest.fn();
  const mockOnCloseModal = jest.fn();
  const mockOnCompleteRepairJob = jest.fn();

  beforeEach(() => {
    (useFormState as jest.Mock).mockReturnValue({
      formState: mockFormState,
      onReset: mockOnReset,
    });

    (useModal as jest.Mock).mockReturnValue({
      isModalOpen: false,
      onOpenModal: mockOnOpenModal,
      onCloseModal: mockOnCloseModal,
    });

    (useUpdateRepairJob as jest.Mock).mockReturnValue({
      onCompleteRepairJob: mockOnCompleteRepairJob,
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = () =>
    renderHook(() => useCompleteRepairJob(mockRepairJob), {
      wrapper: ({ children }) => <MockProviderHook mocks={[]}>{children}</MockProviderHook>,
    });

  it('should return correct initial data ', () => {
    const { result } = hook();

    expect(result.current.isLoading).toEqual(false);
    expect(result.current.isModalOpen).toEqual(false);
  });

  it('should opens modal when complete button clicked', () => {
    const { result } = hook();

    const stopPropagation = jest.fn();

    act(() => {
      result.current.onHandleCompleteButtonClick({
        stopPropagation,
      } as unknown as React.MouseEvent);
    });

    expect(stopPropagation).toHaveBeenCalled();
    expect(mockOnOpenModal).toHaveBeenCalled();
  });

  it('should close modal and reset form', () => {
    const { result } = hook();

    act(() => {
      result.current.onHandleCloseModal();
    });

    expect(mockOnCloseModal).toHaveBeenCalled();
    expect(mockOnReset).toHaveBeenCalled();
  });

  it('should submit checklist and closes modal on success', async () => {
    mockOnCompleteRepairJob.mockResolvedValue({});

    const { result } = hook();

    const values = {
      checklist: [{ id: 'a', label: 'Check motor', checked: true }],
    };

    await act(async () => {
      await result.current.onHandleComplete(values);
    });

    expect(mockOnCompleteRepairJob).toHaveBeenCalledWith({
      ...mockRepairJob,
      checklist: values.checklist,
    });

    expect(mockOnCloseModal).toHaveBeenCalled();
    expect(mockOnReset).toHaveBeenCalled();
  });

  it('should not close modal if API returns errors', async () => {
    mockOnCompleteRepairJob.mockResolvedValue({
      errors: ['validation failed'],
    });

    const { result } = hook();

    await act(async () => {
      await result.current.onHandleComplete({ checklist: [] });
    });

    expect(mockOnCompleteRepairJob).toHaveBeenCalled();
    expect(mockOnCloseModal).not.toHaveBeenCalled();
    expect(mockOnReset).not.toHaveBeenCalled();
  });
});
