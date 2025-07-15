import { MockedResponse } from '@apollo/client/testing';
import { RenderHookResult, renderHook } from '@testing-library/react-hooks';

import {
  mockRepairJob,
  mockRepairJobById,
  mockRepairJobByIdError,
  mockRepairJobId,
} from '@/mocks/repairJobTrackingMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import { UseFetchRepairJobById, useFetchRepairJobById } from '@/shared/repair-job/repair-job-details/hooks';

describe('useFetchRepairJobById', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (
    repairJobId: string | null = null,
    mocks: MockedResponse[] = []
  ): RenderHookResult<unknown, UseFetchRepairJobById> => {
    return renderHook(() => useFetchRepairJobById(repairJobId), {
      wrapper: ({ children }) => <MockProviderHook mocks={mocks}>{children}</MockProviderHook>,
    });
  };

  it('should not trigger query if repair job id is nor provided', () => {
    const { result } = hook(null);

    expect(result.current.repairJob).toEqual({});
    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toBeUndefined();
  });

  it('should fetch repair job by id', async () => {
    const { result, waitForNextUpdate } = hook(mockRepairJobId, [mockRepairJobById]);

    await waitForNextUpdate();

    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toBeUndefined();
    expect(result.current.repairJob).toEqual({ ...mockRepairJob, actualEndDate: '2025-01-19T11:17:48.591Z' });
  });

  it('should handle error when query fails', async () => {
    const { result, waitForNextUpdate } = hook('test-id-error', [mockRepairJobByIdError]);

    await waitForNextUpdate();

    expect(result.current.loading).toBeFalsy();
    expect(result.current.repairJob).toEqual({});
    expect(result.current.error).toBe('Something went wrong!');
  });
});
