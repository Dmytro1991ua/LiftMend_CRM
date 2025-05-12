import { DateSelectArg } from '@fullcalendar/core';
import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import * as form from 'react-hook-form';
import { UseFormReturn } from 'react-hook-form';

import { mockFormState } from '@/mocks/formStateMock';
import { MockProviderHook } from '@/mocks/testMocks';
import { useRepairJobForm } from '@/modules/repair-job-scheduling/components/repair-job-tracking-from/hooks';
import { useCreateRepairJobAndCalendarEvent } from '@/modules/repair-job-scheduling/hooks/useCreateRepairJobAndCalendarEvent';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';

jest.mock('@/shared/hooks/useMutationResultToasts', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    onSuccess: jest.fn(),
    onError: jest.fn(),
  })),
}));

jest.mock('@/modules/repair-job-scheduling/hooks/useCreateRepairJobAndCalendarEvent');

describe('useRepairJobForm', () => {
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();
  const mockHandleSubmit = jest.fn();
  const mockFormTrigger = jest.fn();
  const mockOnCreateRepairJobAndEvent = jest.fn();
  const mockOnReset = jest.fn();
  const mockFromValues = {
    jobDetails: {
      jobType: 'Emergency',
      jobDescription: 'test description here',
      priority: 'Low',
    },
    elevatorInformation: {
      elevatorType: 'Stadium Lift',
      buildingName: 'Beacon Heights Office Complex',
      elevatorLocation: 'Loading Bay',
    },
    technicianAssignment: {
      technicianName: 'Benjamin Hall',
    },
  };

  const defaultProps = {
    selectedDateRange: {
      start: '2025-05-09T21:00:00.000Z',
      end: '2025-05-10T21:00:00.000Z',
      startStr: '2025-05-10',
      endStr: '2025-05-11',
      allDay: true,
      jsEvent: {
        isTrusted: true,
      },
      view: {
        type: 'dayGridMonth',
        dateEnv: {
          timeZone: 'local',
          canComputeOffset: true,
          calendarSystem: {},
          locale: {
            codeArg: 'en',
            codes: ['en'],
            week: {
              dow: 0,
              doy: 4,
            },
            simpleNumberFormat: {},
            options: {
              direction: 'ltr',
              buttonText: {
                prev: 'prev',
                next: 'next',
                prevYear: 'prev year',
                nextYear: 'next year',
                year: 'year',
                today: 'today',
                month: 'month',
                week: 'week',
                day: 'day',
                list: 'list',
              },
              weekText: 'W',
              weekTextLong: 'Week',
              closeHint: 'Close',
              timeHint: 'Time',
              eventHint: 'Event',
              allDayText: 'all-day',
              moreLinkText: 'more',
              noEventsText: 'No events to display',
              buttonHints: {
                prev: 'Previous $0',
                next: 'Next $0',
              },
              viewHint: '$0 view',
              navLinkHint: 'Go to $0',
            },
          },
          weekDow: 0,
          weekDoy: 4,
          weekText: 'W',
          weekTextLong: 'Week',
          cmdFormatter: null,
          defaultSeparator: ' - ',
        },
      },
    } as unknown as DateSelectArg,
    onReset: mockOnReset,
  };

  beforeEach(() => {
    (useMutationResultToasts as jest.Mock).mockReturnValue({ onSuccess: mockOnSuccess, onError: mockOnError });

    (useCreateRepairJobAndCalendarEvent as jest.Mock).mockReturnValue({
      onCreateRepairJobAndEvent: mockOnCreateRepairJobAndEvent,
      isLoading: false,
    });

    jest.spyOn(form, 'useFormContext').mockReturnValue({
      formState: {
        ...mockFormState.formState,
      },
      handleSubmit: mockHandleSubmit,
      trigger: mockFormTrigger,
    } as unknown as UseFormReturn);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = () =>
    renderHook(() => useRepairJobForm({ ...defaultProps }), {
      wrapper: ({ children }) => <MockProviderHook mocks={[]}>{children}</MockProviderHook>,
    });

  it('should trigger onHandleNext and validate stepper step', async () => {
    const { result } = hook();

    await act(async () => {
      await result.current.onHandleNext(0);
    });

    expect(mockFormTrigger).toHaveBeenCalledWith('jobDetails');

    await act(async () => {
      await result.current.onHandleNext(1);
    });

    expect(mockFormTrigger).toHaveBeenCalledWith('jobDetails');
    expect(mockFormTrigger).toHaveBeenCalledWith('elevatorInformation');

    await act(async () => {
      await result.current.onHandleNext(2);
    });

    expect(mockFormTrigger).toHaveBeenCalledWith('jobDetails');
    expect(mockFormTrigger).toHaveBeenCalledWith('elevatorInformation');
    expect(mockFormTrigger).toHaveBeenCalledWith('technicianAssignment');
  });

  it('should trigger onSubmit and reset form', async () => {
    const { result } = hook();

    await act(async () => {
      await result.current.onSubmit(mockFromValues);
    });

    // Debugging logs to check if the functions were called
    console.log(mockOnCreateRepairJobAndEvent.mock.calls);
    console.log(mockOnReset.mock.calls);

    expect(mockOnCreateRepairJobAndEvent).toHaveBeenCalled();
    expect(mockOnReset).toHaveBeenCalled();
  });
});
