import { InMemoryCache } from '@apollo/client';
import * as apollo from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { RenderHookResult, act, renderHook } from '@testing-library/react-hooks';

import { typePolicies } from '@/graphql/typePolicies';
import {
  mockDoorSensorInventoryPart,
  mockInventoryParts,
  mockInventoryPartsResponse,
  mockPaginatedInventoryParts,
  mockedReturnedInventoryPartsPaginatedResponse,
} from '@/mocks/inventoryPartMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import { UseGetInventoryParts, useGetInventoryParts } from '@/modules/inventory-management/hooks';
import { InventoryPart } from '@/shared/types';

describe('useGetInventoryParts', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (mocks: MockedResponse[] = []): RenderHookResult<unknown, UseGetInventoryParts<InventoryPart>> => {
    const cache = new InMemoryCache({
      addTypename: false,
      typePolicies,
    });

    return renderHook(() => useGetInventoryParts(), {
      wrapper: ({ children }) => (
        <MockProviderHook cache={cache} mocks={mocks}>
          {children}
        </MockProviderHook>
      ),
    });
  };

  it('should return inventory parts data', async () => {
    const { result, waitForNextUpdate } = hook([mockInventoryParts]);

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeUndefined();
    expect(result.current.inventoryParts).toEqual([]);

    await waitForNextUpdate();

    expect(result.current.inventoryParts).toEqual([
      { ...mockDoorSensorInventoryPart, createdAt: '2026-04-21T16:59:33.716Z' },
    ]);
    expect(result.current.loading).toBe(false);
  });

  it('should fetch next page when onNext is triggered', async () => {
    const fetchMoreMock = jest.fn(() => mockedReturnedInventoryPartsPaginatedResponse);

    jest.spyOn(apollo, 'useQuery').mockImplementation(
      () =>
        ({
          data: mockInventoryPartsResponse.data,
          loading: false,
          error: undefined,
          fetchMore: fetchMoreMock,
        } as unknown as apollo.QueryResult)
    );

    const { result } = hook(mockPaginatedInventoryParts);

    await act(async () => await result.current.onNext());

    expect(fetchMoreMock).toHaveBeenCalledWith({
      variables: {
        paginationOptions: { limit: 20, offset: 1 },
        filterOptions: {
          searchTerm: '',
        },
      },
    });
  });

  it('should log an error if fetchMore throws', async () => {
    const error = new Error('fetch failed');

    const fetchMoreMock = jest.fn().mockRejectedValue(error);

    const consoleErrorSpy = jest.spyOn(console, 'error');

    jest.spyOn(apollo, 'useQuery').mockImplementation(
      () =>
        ({
          data: mockInventoryPartsResponse.data,
          loading: false,
          error: undefined,
          fetchMore: fetchMoreMock,
        } as unknown as apollo.QueryResult)
    );

    const { result } = hook(mockPaginatedInventoryParts);

    await act(async () => {
      await result.current.onNext();
    });

    expect(fetchMoreMock).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
  });
});
