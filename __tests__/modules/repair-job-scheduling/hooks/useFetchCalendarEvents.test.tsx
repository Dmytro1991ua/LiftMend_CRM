import { InMemoryCache } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { RenderHookResult, renderHook } from '@testing-library/react-hooks';

import { typePolicies } from '@/graphql/typePolicies';
import { mockCalendarEvent, mockCalendarEventsResponse } from '@/mocks/repairJobScheduling';
import { MockProviderHook } from '@/mocks/testMocks';
import { UseFetchCalendarEvents, useFetchCalendarEvents } from '@/modules/repair-job-scheduling/hooks';

describe('useFetchCalendarEvents', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (mocks: MockedResponse[] = []): RenderHookResult<unknown, UseFetchCalendarEvents> => {
    const cache = new InMemoryCache({
      addTypename: false,
      typePolicies,
    });

    return renderHook(() => useFetchCalendarEvents(), {
      wrapper: ({ children }) => (
        <MockProviderHook cache={cache} mocks={mocks}>
          {children}
        </MockProviderHook>
      ),
    });
  };

  it('should return correct events', async () => {
    const { result, waitForNextUpdate } = hook([mockCalendarEventsResponse]);

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeUndefined();
    expect(result.current.events).toEqual([]);

    await waitForNextUpdate();

    expect(result.current.events).toEqual([mockCalendarEvent]);
  });
});
