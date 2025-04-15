import { MockedResponse } from '@apollo/client/testing';
import { act } from '@testing-library/react';
import { RenderHookResult, renderHook } from '@testing-library/react-hooks';

import { useToast } from '@/components/ui/use-toast';
import {
  getDashboardMetricsResponseMock,
  mockElevatorRecordMetrics,
  mockRepairJobMetrics,
  mockTechnicianRecordMetrics,
} from '@/mocks/dashboardMetrics';
import { MockProviderHook } from '@/mocks/testMocks';
import { UseDashboard, useDashBoard, useFetchDashboardMetrics } from '@/modules/dashboard/hooks';
import { useUser } from '@/shared/contexts/UserContext';
import useStoredTableState from '@/shared/storage/hooks';

jest.mock('@/shared/contexts/UserContext');
jest.mock('@/modules/dashboard/hooks', () => ({
  ...jest.requireActual('@/modules/dashboard/hooks'),
  useFetchDashboardMetrics: jest.fn(),
}));
jest.mock('@/components/ui/use-toast');
jest.mock('@/shared/storage/hooks', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('useDashboard', () => {
  const mockToast = jest.fn();
  const mockSetStoredState = jest.fn();

  let mockExpectedDateRanges: { from: Date; to: Date };

  beforeEach(() => {
    mockExpectedDateRanges = {
      from: new Date('2025-03-31T00:00:00.000Z'),
      to: new Date('2025-04-30T23:59:59.999Z'),
    };

    (useUser as jest.Mock).mockReturnValue({
      user: {
        id: '0f042b0f-50b6-4194-9866-e99cd9f0e0f9',
        email: 'test@gmail.com',
        firstName: 'Alex',
        lastName: 'Smith',
        phone: '+380667877878',
        createdAt: '2025-04-06T07:40:51.255Z',
        updatedAt: '2025-04-06T08:14:16.380Z',
        lastSignInAt: null,
        avatarUrl: '',
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

    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });

    (useStoredTableState as jest.Mock).mockReturnValue({
      storedState: {
        dateFilter: mockExpectedDateRanges,
      },
      setStoredState: mockSetStoredState,
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

  it('should show toast when date range is invalid', () => {
    const mockRange = { from: new Date('2025-01-01'), to: new Date('2024-01-01') };

    const { result } = hook([getDashboardMetricsResponseMock(mockExpectedDateRanges)]);

    act(() => {
      result.current.onHandleCalendarPopoverClose(false, mockRange);
    });

    expect.objectContaining({
      title: 'Invalid range',
      description: expect.anything(),
      variant: 'destructive',
    });
    expect(mockSetStoredState).not.toHaveBeenCalled();
  });

  it('should only set isCalendarOpen to true if open is true and range is valid', () => {
    const { result } = hook([getDashboardMetricsResponseMock(mockExpectedDateRanges)]);

    act(() => {
      result.current.onHandleCalendarPopoverClose(true, mockExpectedDateRanges);
    });

    expect(result.current.isCalendarOpen).toBe(true);
    expect(mockSetStoredState).not.toHaveBeenCalled();
  });

  it('should update storedState when closing calendar with valid date range', () => {
    const { result } = hook([getDashboardMetricsResponseMock(mockExpectedDateRanges)]);

    act(() => {
      result.current.onHandleCalendarPopoverClose(false, mockExpectedDateRanges);
    });

    expect(mockSetStoredState).toHaveBeenCalled();
    expect(result.current.isCalendarOpen).toBe(false);
  });
});
