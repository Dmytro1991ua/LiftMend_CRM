import { MockedResponse } from '@apollo/client/testing';
import { RenderHookResult, act, renderHook } from '@testing-library/react-hooks';

import { mockUpdateElevatorRecord, mockUpdateElevatorRecordGQLError } from '@/mocks/elevatorManagementMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import useUpdateElevatorRecordStatus, {
  UseUpdateEmploymentStatus,
  UseUpdateEmploymentStatusProps,
} from '@/modules/elevator-management/components/elevator-status-toggle-cell/hooks/useUpdateElevatorRecordStatus';
import { useUpdateElevatorRecordVisibility } from '@/modules/elevator-management/components/elevator-status-toggle-cell/hooks/useUpdateElevatorRecordVisibility';
import { ElevatorStatus } from '@/modules/elevator-management/types';

jest.mock(
  '@/modules/elevator-management/components/elevator-status-toggle-cell/hooks/useUpdateElevatorRecordVisibility'
);

describe('useUpdateElevatorRecordStatus', () => {
  const mockOnRedirect = jest.fn();
  const mockOnUpdateElevatorRecordStatus = jest.fn();

  beforeEach(() => {
    (useUpdateElevatorRecordVisibility as jest.Mock).mockReturnValue({
      loading: false,
      onUpdateElevatorRecordStatus: mockOnUpdateElevatorRecordStatus,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    status: 'Operational' as ElevatorStatus,
    elevatorRecordId: 'test-id-1',
    lastKnownStatus: null,
    onRedirect: mockOnRedirect,
  };

  const hook = (
    props: Partial<UseUpdateEmploymentStatusProps>,
    mocks: MockedResponse[] = []
  ): RenderHookResult<unknown, UseUpdateEmploymentStatus> => {
    return renderHook(() => useUpdateElevatorRecordStatus({ ...props } as UseUpdateEmploymentStatusProps), {
      wrapper: ({ children }) => <MockProviderHook mocks={mocks}>{children}</MockProviderHook>,
    });
  };

  it('should return correct initial data', () => {
    const { result } = hook(defaultProps, [mockUpdateElevatorRecord]);

    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  it('should trigger onHandleElevatorRecordStatusChange, close modal and redirect', async () => {
    const { result } = hook(defaultProps, [mockUpdateElevatorRecord]);

    await act(async () => result.current.onHandleElevatorRecordStatusChange());

    expect(mockOnUpdateElevatorRecordStatus).toHaveBeenCalledWith({
      currentStatus: 'Operational',
      id: 'test-id-1',
      newStatus: 'Out of Service',
    });

    expect(mockOnUpdateElevatorRecordStatus).toHaveBeenCalled();
    expect(mockOnRedirect).toHaveBeenCalled();
  });

  it('should not call onRedirect if error occurs upon elevator record update', async () => {
    const mockOnRedirect = jest.fn();

    const { result } = hook({}, [mockUpdateElevatorRecordGQLError]);

    await act(async () => result.current.onHandleElevatorRecordStatusChange());

    expect(mockOnRedirect).not.toHaveBeenCalled();
  });

  it('should skip calling onRedirect if it is not provided and update succeeds', async () => {
    const { result } = hook({ ...defaultProps, onRedirect: undefined }, [mockUpdateElevatorRecord]);

    await act(async () => {
      await result.current.onHandleElevatorRecordStatusChange();
    });

    expect(mockOnUpdateElevatorRecordStatus).toHaveBeenCalled();
    expect(mockOnRedirect).not.toHaveBeenCalled();
  });

  it('should open and close modal correctly', () => {
    const { result } = hook({});

    act(() => {
      result.current.onOpenModal();
    });

    expect(result.current.isModalOpen).toBe(true);

    act(() => {
      result.current.onCloseModal();
    });

    expect(result.current.isModalOpen).toBe(false);
  });

  it('should return correct deactivation config based on status and lastKnownStatus', () => {
    const { result } = hook(defaultProps);

    expect(result.current.config.newElevatorStatus).toBe('Out of Service');
    expect(result.current.config.modalMessage).toBe(
      'Deactivating this elevator record will mark it as out of service, making it unavailable for use. Are you sure you want to proceed?'
    );
    expect(result.current.config.modalTitle).toBe('Confirm Deactivation of Elevator Record');
  });

  it('should return correct activation config based on status and lastKnownStatus', () => {
    const { result } = hook({ ...defaultProps, status: 'Out of Service', lastKnownStatus: 'Operational' });

    expect(result.current.config.newElevatorStatus).toBe('Operational');
    expect(result.current.config.modalMessage).toBe(
      'Reactivating this elevator record will mark it as operational, making it available for use. Are you sure you want to proceed?'
    );
    expect(result.current.config.modalTitle).toBe('Confirm Activation of Elevator Record');
  });
});
