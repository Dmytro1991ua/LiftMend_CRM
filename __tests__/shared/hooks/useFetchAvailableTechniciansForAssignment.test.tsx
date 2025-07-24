import * as apollo from '@apollo/client';
import { QueryResult } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { RenderHookResult, renderHook } from '@testing-library/react-hooks';

import {
  mockGetAvailableTechniciansForAssignmentErrorResponse,
  mockGetAvailableTechniciansForAssignmentResponse,
} from '@/mocks/repairJobTrackingMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import { UseFetchAvailableTechniciansForAssignment, useFetchAvailableTechniciansForAssignment } from '@/shared/hooks';

describe('useFetchAvailableTechniciansForAssignment', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (mocks: MockedResponse[] = []): RenderHookResult<unknown, UseFetchAvailableTechniciansForAssignment> => {
    return renderHook(() => useFetchAvailableTechniciansForAssignment(), {
      wrapper: ({ children }) => <MockProviderHook mocks={mocks}>{children}</MockProviderHook>,
    });
  };

  it('should return fetched available technicians for assignment', async () => {
    const { result, waitForNextUpdate } = hook([mockGetAvailableTechniciansForAssignmentResponse]);

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.availableTechnicians).toEqual([
      { id: '3f16eb24-26fd-44e3-939f-2ede19e89534', label: 'Charles Robinson', value: 'Charles Robinson' },
      { id: 'e2e34422-4335-40e2-a5f1-0d04baae3727', label: 'Chloe Carter', value: 'Chloe Carter' },
    ]);
  });

  it('should return error if the available technicians for assignment were failed to fetch', async () => {
    const errorMock = { message: 'Failed to fetch data' } as apollo.ApolloError;

    jest.spyOn(apollo, 'useQuery').mockImplementation(
      () =>
        ({
          data: undefined,
          error: errorMock,
          loading: false,
        } as unknown as QueryResult)
    );

    const { result } = hook([mockGetAvailableTechniciansForAssignmentErrorResponse]);

    expect(result.current.error).toBe('Failed to fetch data');
    expect(result.current.availableTechnicians).toEqual([]);
  });

  it('should return empty availableTechnicians if getAvailableTechniciansForAssignment is undefined', () => {
    jest.spyOn(apollo, 'useQuery').mockReturnValue({
      data: { getAvailableTechniciansForAssignment: undefined },
      loading: false,
      error: undefined,
      refetch: jest.fn(),
    } as unknown as QueryResult);

    const { result } = hook([mockGetAvailableTechniciansForAssignmentErrorResponse]);

    expect(result.current.availableTechnicians).toEqual([]);
  });
});
