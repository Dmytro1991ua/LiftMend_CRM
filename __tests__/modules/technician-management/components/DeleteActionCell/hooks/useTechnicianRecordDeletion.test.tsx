import { act } from '@testing-library/react';
import { RenderHookResult, renderHook } from '@testing-library/react-hooks';

import { MockProviderHook } from '@/mocks/testMocks';
import { UseTechnicianRecordDeletion } from '@/modules/technician-management/components/delete-action-cell/hooks';
import useTechnicianRecordDeletion from '@/modules/technician-management/components/delete-action-cell/hooks/useTechnicianRecordDeletion';
import { useDeleteTechnicianRecord } from '@/modules/technician-management/hooks';

jest.mock('@/modules/technician-management/hooks', () => ({
  ...jest.requireActual('@/modules/technician-management/hooks'),
  useDeleteTechnicianRecord: jest.fn(),
}));

describe('useTechnicianRecordDeletion', () => {
  const mockOnCloseModal = jest.fn();
  const mockOnRedirect = jest.fn();
  const mockOnDeleteElevatorRecord = jest.fn();

  beforeEach(() => {
    (useDeleteTechnicianRecord as jest.Mock).mockReturnValue({
      onDeleteTechnicianRecord: mockOnDeleteElevatorRecord,
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    id: 'test_id_1',
    onCloseModal: mockOnCloseModal,
    onRedirect: mockOnRedirect,
  };

  const hook = (): RenderHookResult<unknown, UseTechnicianRecordDeletion> => {
    return renderHook(() => useTechnicianRecordDeletion(defaultProps), {
      wrapper: ({ children }) => <MockProviderHook mocks={[]}>{children}</MockProviderHook>,
    });
  };

  it('should return correct initial data', () => {
    const { result } = hook();

    expect(result.current.isDeleteTechnicianRecordLoading).toBe(false);
  });

  it('should trigger onHandleDeleteTechnicianRecord, close modal and redirect', async () => {
    const { result } = hook();

    await act(async () => result.current.onHandleDeleteTechnicianRecord());

    expect(mockOnDeleteElevatorRecord).toHaveBeenCalled();
    expect(mockOnCloseModal).toHaveBeenCalled();
    expect(mockOnRedirect).toHaveBeenCalled();
  });
});
