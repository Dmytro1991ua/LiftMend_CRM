import { MockedResponse } from '@apollo/client/testing';
import { RenderHookResult, renderHook } from '@testing-library/react-hooks';

import {
  getDashboardMetricsResponseMock,
  mockElevatorRecordMetrics,
  mockRepairJobMetrics,
  mockTechnicianRecordMetrics,
} from '@/mocks/dashboardMetrics';
import { MockProviderHook } from '@/mocks/testMocks';
import { UseDashboard, useDashBoard, useFetchDashboardMetrics } from '@/modules/dashboard/hooks';
import { useBaseDateRangeFilter } from '@/shared/base-date-range-filter/hooks';
import { useUser } from '@/shared/contexts/UserContext';

jest.mock('@/shared/contexts/UserContext');
jest.mock('@/modules/dashboard/hooks', () => ({
  ...jest.requireActual('@/modules/dashboard/hooks'),
  useFetchDashboardMetrics: jest.fn(),
}));
jest.mock('@/components/ui/use-toast');
jest.mock('@/shared/base-date-range-filter/hooks', () => ({
  useBaseDateRangeFilter: jest.fn(),
}));

describe('useDashboard', () => {
  const mockOnHandleCalendarPopoverClose = jest.fn();
  let mockExpectedDateRanges: { from: Date; to: Date };
  beforeEach(() => {
    mockExpectedDateRanges = {
      from: new Date('2025-03-31T00:00:00.000Z'),
      to: new Date('2025-04-30T23:59:59.999Z'),
    };

    (useUser as jest.Mock).mockReturnValue({
      user: {
        id: '0f042b0f-50b6-4194-9866-e99cd9f0e0f9',
        firstName: 'Alex',
        lastName: 'Smith',
      },
      loading: false,
    });

    (useFetchDashboardMetrics as jest.Mock).mockReturnValue({
      dashboardMetrics: {
        repairJobsMetrics: mockRepairJobMetrics,
        elevatorRecordsMetrics: mockElevatorRecordMetrics,
        technicianRecordsMetrics: mockTechnicianRecordMetrics,
      },
      loading: false,
      error: undefined,
    });

    (useBaseDateRangeFilter as jest.Mock).mockReturnValue({
      isCalendarOpen: false,
      sanitizedDateRange: mockExpectedDateRanges,
      onHandleCalendarPopoverClose: mockOnHandleCalendarPopoverClose,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (mocks: MockedResponse[] = []): RenderHookResult<unknown, UseDashboard> => {
    return renderHook(() => useDashBoard(), {
      wrapper: ({ children }) => <MockProviderHook mocks={mocks}>{children}</MockProviderHook>,
    });
  };

  it('should return correct hook initial data', () => {
    const { result } = hook([getDashboardMetricsResponseMock(mockExpectedDateRanges)]);

    expect(result.current.dashboardMetrics).toEqual([]);
    expect(result.current.error).toBeUndefined();
    expect(result.current.isCalendarOpen).toBe(false);
    expect(result.current.loading).toBe(true);
  });

  it('should return correct sanitizedDateRange from storage', () => {
    const { result } = hook([getDashboardMetricsResponseMock(mockExpectedDateRanges)]);

    expect(result.current.sanitizedDateRange).toEqual({
      from: new Date('2025-03-31T00:00:00.000Z'),
      to: new Date('2025-04-30T23:59:59.999Z'),
    });
  });
});
