import { MockedResponse } from '@apollo/client/testing';
import { RenderHookResult, renderHook } from '@testing-library/react-hooks';

import {
  mockBenjaminHallRecord,
  mockBenjaminHallRecordId,
  mockTechnicianRecordById,
  mockTechnicianRecordByIdError,
} from '@/mocks/technicianManagementMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import {
  UseFetchFetchTechnicianRecordById,
  useFetchTechnicianRecordById,
} from '@/modules/technician-management/components/technician-record-details/hooks';

describe('useFetchTechnicianRecordById', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (
    technicianRecordId: string | null = null,
    mocks: MockedResponse[] = []
  ): RenderHookResult<unknown, UseFetchFetchTechnicianRecordById> => {
    return renderHook(() => useFetchTechnicianRecordById(technicianRecordId), {
      wrapper: ({ children }) => <MockProviderHook mocks={mocks}>{children}</MockProviderHook>,
    });
  };

  it('should not trigger query if technician record id is nor provided', () => {
    const { result } = hook();

    expect(result.current.technicianRecord).toEqual({});
    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toBeUndefined();
  });

  it('should fetch technician record by id', async () => {
    const { result, waitForNextUpdate } = hook(mockBenjaminHallRecordId, [mockTechnicianRecordById]);

    await waitForNextUpdate();

    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toBeUndefined();
    expect(result.current.technicianRecord).toEqual(mockBenjaminHallRecord);
  });

  it('should handle error when query fails', async () => {
    const { result, waitForNextUpdate } = hook('test-id-error', [mockTechnicianRecordByIdError]);

    await waitForNextUpdate();

    expect(result.current.loading).toBeFalsy();
    expect(result.current.technicianRecord).toEqual({});
    expect(result.current.error).toBe('Something went wrong!');
  });
});
