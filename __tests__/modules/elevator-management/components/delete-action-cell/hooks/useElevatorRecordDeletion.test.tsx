import { act } from '@testing-library/react';
import { RenderHookResult, renderHook } from '@testing-library/react-hooks';

import { MockProviderHook } from '@/mocks/testMocks';
import {
  UseElevatorRecordDeletion,
  useElevatorRecordDeletion,
} from '@/modules/elevator-management/components/delete-action-cell/hooks/useElevatorRecordDeletion';
import { useDeleteElevatorRecord } from '@/modules/elevator-management/hooks';

jest.mock('@/modules/elevator-management/hooks', () => ({
  ...jest.requireActual('@/modules/elevator-management/hooks'),
  useDeleteElevatorRecord: jest.fn(),
}));

describe('useElevatorRecordDeletion', () => {
  const mockOnCloseModal = jest.fn();
  const mockOnRedirect = jest.fn();
  const mockOnDeleteElevatorRecord = jest.fn();

  beforeEach(() => {
    (useDeleteElevatorRecord as jest.Mock).mockReturnValue({
      onDeleteElevatorRecord: mockOnDeleteElevatorRecord,
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    id: 'test_id',
    onCloseModal: mockOnCloseModal,
    onRedirect: mockOnRedirect,
  };

  const hook = (): RenderHookResult<unknown, UseElevatorRecordDeletion> => {
    return renderHook(() => useElevatorRecordDeletion(defaultProps), {
      wrapper: ({ children }) => <MockProviderHook mocks={[]}>{children}</MockProviderHook>,
    });
  };

  it('should return correct initial data', () => {
    const { result } = hook();

    expect(result.current.isDeleteElevatorRecordLoading).toBe(false);
  });

  it('should trigger onHandleDeleteElevatorRecord and close modal and redirect', async () => {
    const { result } = hook();

    await act(async () => result.current.onHandleDeleteElevatorRecord());

    expect(mockOnDeleteElevatorRecord).toHaveBeenCalled();
    expect(mockOnCloseModal).toHaveBeenCalled();
    expect(mockOnRedirect).toHaveBeenCalled();
  });
});
