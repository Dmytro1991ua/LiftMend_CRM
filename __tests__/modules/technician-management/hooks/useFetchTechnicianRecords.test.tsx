import { InMemoryCache } from '@apollo/client';
import * as apollo from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { act } from '@testing-library/react';
import { RenderHookResult, renderHook } from '@testing-library/react-hooks';

import { typePolicies } from '@/graphql/typePolicies';
import {
  mockBenjaminHallRecord,
  mockOliviaLewisRecord,
  mockPaginatedTechnicianRecords,
  mockTechnicianRecords,
  mockTechnicianRecordsPaginatedResponse,
  mockTechnicianRecordsResponse,
} from '@/mocks/technicianManagementMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import { UseFetchTechnicianRecords, useFetchTechnicianRecords } from '@/modules/technician-management/hooks';
import { TechnicianRecord } from '@/shared/types';

describe('useFetchTechnicianRecords', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (
    mocks: MockedResponse[] = []
  ): RenderHookResult<unknown, UseFetchTechnicianRecords<TechnicianRecord>> => {
    const cache = new InMemoryCache({
      addTypename: false,
      typePolicies,
    });

    return renderHook(() => useFetchTechnicianRecords(), {
      wrapper: ({ children }) => (
        <MockProviderHook cache={cache} mocks={mocks}>
          {children}
        </MockProviderHook>
      ),
    });
  };

  it('should return correct technician records', async () => {
    const { result, waitForNextUpdate } = hook([mockTechnicianRecords]);

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeUndefined();
    expect(result.current.technicianRecords).toEqual([]);

    await waitForNextUpdate();

    expect(result.current.technicianRecords).toEqual([mockBenjaminHallRecord, mockOliviaLewisRecord]);
  });

  it('should fetch next page when onNext is triggered', async () => {
    const fetchMoreMock = jest.fn(() => mockTechnicianRecordsPaginatedResponse);

    jest.spyOn(apollo, 'useQuery').mockImplementation(
      () =>
        ({
          data: mockTechnicianRecordsResponse.data,
          loading: false,
          error: undefined,
          fetchMore: fetchMoreMock,
        } as unknown as apollo.QueryResult)
    );

    const { result } = hook(mockPaginatedTechnicianRecords);

    await act(async () => await result.current.onNext());

    expect(fetchMoreMock).toHaveBeenCalledWith({
      variables: { filterOptions: { searchTerm: '' }, paginationOptions: { limit: 20, offset: 2 } },
    });
  });

  it('should log an error if fetchMore throws', async () => {
    const error = new Error('fetch failed');

    const fetchMoreMock = jest.fn().mockRejectedValue(error);

    const consoleErrorSpy = jest.spyOn(console, 'error');

    jest.spyOn(apollo, 'useQuery').mockImplementation(
      () =>
        ({
          data: mockTechnicianRecordsResponse.data,
          loading: false,
          error: undefined,
          fetchMore: fetchMoreMock,
        } as unknown as apollo.QueryResult)
    );

    const { result } = hook(mockPaginatedTechnicianRecords);

    await act(async () => {
      await result.current.onNext();
    });

    expect(fetchMoreMock).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
  });
});
