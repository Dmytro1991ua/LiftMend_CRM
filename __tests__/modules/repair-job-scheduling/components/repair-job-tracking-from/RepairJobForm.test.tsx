import { QueryResult, useQuery } from '@apollo/client';
import { DateSelectArg } from '@fullcalendar/core';
import { render, screen } from '@testing-library/react';

import { mockRepairJobTypes } from '@/mocks/dropdownOptions';
import { withApolloAndFormProvider } from '@/mocks/testMocks';
import RepairJobForm from '@/modules/repair-job-scheduling/components/repair-job-tracking-from';
import { useRepairJobForm } from '@/modules/repair-job-scheduling/components/repair-job-tracking-from/hooks';

jest.mock('@/modules/repair-job-scheduling/components/repair-job-tracking-from/hooks');
jest.mock('@apollo/client');

describe('RepairJobForm', () => {
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
    onReset: jest.fn(),
  };

  const RepairJobFormComponent = () => withApolloAndFormProvider(<RepairJobForm {...defaultProps} />);

  beforeEach(() => {
    (useRepairJobForm as jest.Mock).mockReturnValue({
      isLoading: false,
      onHandleNext: jest.fn(),
      onSubmit: jest.fn(),
      handleSubmit: jest.fn(),
    });

    (useQuery as jest.Mock).mockImplementation(() => {
      return {
        refetch: jest.fn().mockResolvedValue({
          data: {
            getRepairJobScheduleData: {
              repairJobTypes: [mockRepairJobTypes],
            },
          },
        }),
        loading: false,
      } as unknown as QueryResult;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render component without crashing', () => {
    render(RepairJobFormComponent());

    expect(screen.getByText('Job Details')).toBeInTheDocument();
    expect(screen.getByText('Elevator Information')).toBeInTheDocument();
    expect(screen.getByText('Technician Assignment')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });
});
