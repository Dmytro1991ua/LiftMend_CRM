import {
  mockElevatorRecordById,
  mockElevatorRecordByIdError,
  mockGlassElevatorElevatorRecord,
} from '@/mocks/elevatorManagementMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import useFetchElevatorRecordById, {
  UseFetchFetchElevatorRecordById,
} from '@/modules/elevator-management/components/elevator-record-details/hooks/useFetchElevatorRecordById';
import { MockedResponse } from '@apollo/client/testing';
import { renderHook, RenderHookResult } from '@testing-library/react-hooks';

describe('useFetchElevatorRecordById', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (
    elevatorRecordId: string | null = null,
    mocks: MockedResponse[] = []
  ): RenderHookResult<unknown, UseFetchFetchElevatorRecordById> => {
    return renderHook(() => useFetchElevatorRecordById(elevatorRecordId), {
      wrapper: ({ children }) => <MockProviderHook mocks={mocks}>{children}</MockProviderHook>,
    });
  };

  it('should not trigger query if elevator record id is nor provided', () => {
    const { result } = hook(null);

    expect(result.current.elevatorRecord).toEqual({});
    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toBeUndefined();
  });

  it('should fetch elevator record by id', async () => {
    const { result, waitForNextUpdate } = hook('test-id-1', [mockElevatorRecordById]);

    await waitForNextUpdate();

    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toBeUndefined();
    expect(result.current.elevatorRecord).toEqual(mockGlassElevatorElevatorRecord.node);
  });

  it('should handle error when query fails', async () => {
    const { result, waitForNextUpdate } = hook('test-id-error', [mockElevatorRecordByIdError]);

    await waitForNextUpdate();

    expect(result.current.loading).toBeFalsy();
    expect(result.current.elevatorRecord).toEqual({});
    expect(result.current.error).toBe('Something went wrong!');
  });
});
