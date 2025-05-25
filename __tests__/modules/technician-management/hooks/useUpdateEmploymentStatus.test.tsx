import { MockedResponse } from '@apollo/client/testing';
import { RenderHookResult, act, renderHook } from '@testing-library/react-hooks';

import {
  mockBenjaminHallRecordId,
  mockUpdateTechnicianRecord,
  mockUpdateTechnicianRecordGQLError,
} from '@/mocks/technicianManagementMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import {
  DEFAULT_ACTIVATION_MODAL_MESSAGE,
  DEFAULT_ACTIVATION_MODAL_TITLE,
  DEFAULT_DEACTIVATION_MODAL_MESSAGE,
  DEFAULT_DEACTIVATION_MODAL_TITLE,
} from '@/modules/technician-management/components/technician-management-table/constants';
import {
  UseUpdateEmploymentStatus,
  UseUpdateEmploymentStatusProps,
  useUpdateEmploymentStatus,
  useUpdateTechnicianVisibility,
} from '@/modules/technician-management/hooks';
import { EmploymentStatus } from '@/modules/technician-management/types';

jest.mock('@/modules/technician-management/hooks/useUpdateTechnicianVisibility');

describe('useUpdateEmploymentStatus', () => {
  const mockOnRedirect = jest.fn();
  const mockOnUpdateEmploymentStatus = jest.fn();

  beforeEach(() => {
    (useUpdateTechnicianVisibility as jest.Mock).mockReturnValue({
      loading: false,
      onUpdateEmploymentStatus: mockOnUpdateEmploymentStatus,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    employmentStatus: 'Active' as EmploymentStatus,
    technicianId: mockBenjaminHallRecordId,
    availabilityStatus: 'Available',
    lastKnownAvailabilityStatus: null,
    onRedirect: mockOnRedirect,
  };

  const hook = (
    props: Partial<UseUpdateEmploymentStatusProps>,
    mocks: MockedResponse[] = []
  ): RenderHookResult<unknown, UseUpdateEmploymentStatus> => {
    return renderHook(() => useUpdateEmploymentStatus({ ...props } as UseUpdateEmploymentStatusProps), {
      wrapper: ({ children }) => <MockProviderHook mocks={mocks}>{children}</MockProviderHook>,
    });
  };

  it('should return correct initial data', () => {
    const { result } = hook(defaultProps, [mockUpdateTechnicianRecord]);

    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  it('should trigger onHandleEmploymentStatusChange, close modal and redirect', async () => {
    const { result } = hook(defaultProps, [mockUpdateTechnicianRecord]);

    await act(async () => result.current.onHandleEmploymentStatusChange());

    expect(mockOnUpdateEmploymentStatus).toHaveBeenCalledWith({
      id: mockBenjaminHallRecordId,
      newEmploymentStatus: 'Inactive',
      newAvailabilityStatus: 'Unavailable',
      currentAvailabilityStatus: 'Available',
    });
    expect(mockOnRedirect).toHaveBeenCalled();
  });

  it('should not call onRedirect if error occurs upon technician record update', async () => {
    const mockOnRedirect = jest.fn();

    const { result } = hook({}, [mockUpdateTechnicianRecordGQLError]);

    await act(async () => result.current.onHandleEmploymentStatusChange());

    expect(mockOnRedirect).not.toHaveBeenCalled();
  });

  it('should skip calling onRedirect if it is not provided and update succeeds', async () => {
    const { result } = hook({ ...defaultProps, onRedirect: undefined }, [mockUpdateTechnicianRecord]);

    await act(async () => result.current.onHandleEmploymentStatusChange());

    expect(mockOnUpdateEmploymentStatus).toHaveBeenCalled();
    expect(mockOnRedirect).not.toHaveBeenCalled();
  });

  it('should open and close modal correctly', () => {
    const { result } = hook(defaultProps);

    act(() => {
      result.current.onOpenModal();
    });

    expect(result.current.isModalOpen).toBe(true);

    act(() => {
      result.current.onCloseModal();
    });

    expect(result.current.isModalOpen).toBe(false);
  });

  it('should return correct config for active technician based on lastKnownAvailabilityStatus', () => {
    const { result } = hook(defaultProps);

    expect(result.current.config.modalTitle).toEqual(DEFAULT_DEACTIVATION_MODAL_TITLE);
    expect(result.current.config.modalMessage).toEqual(DEFAULT_DEACTIVATION_MODAL_MESSAGE);
    expect(result.current.config.newAvailabilityStatus).toEqual('Unavailable');
    expect(result.current.config.newEmploymentStatus).toEqual('Inactive');
  });

  it('should return correct config for inactive technician based on lastKnownAvailabilityStatus', () => {
    const { result } = hook({
      ...defaultProps,
      employmentStatus: 'Inactive',
      lastKnownAvailabilityStatus: 'Available',
    });

    expect(result.current.config.modalTitle).toEqual(DEFAULT_ACTIVATION_MODAL_TITLE);
    expect(result.current.config.modalMessage).toEqual(DEFAULT_ACTIVATION_MODAL_MESSAGE);
    expect(result.current.config.newAvailabilityStatus).toEqual('Available');
    expect(result.current.config.newEmploymentStatus).toEqual('Active');
  });
});
