import { render, screen } from '@testing-library/react';

import { useToast } from '@/components/ui/use-toast';
import { mockCalendarEvent, mockCreateRepairJobAndCalendarEventResponse } from '@/mocks/repairJobScheduling';
import { withApolloProvider } from '@/mocks/testMocks';
import BaseCalendar from '@/shared/base-calendar';
import { DEFAULT_CALENDAR_HEADER_TOOLBAR_CONFIG, DEFAULT_CALENDAR_VIEW } from '@/shared/base-calendar/constants';
import { useBaseCalendar, useFetchCalendarEvents } from '@/shared/base-calendar/hooks';

jest.mock('@/shared/base-calendar/hooks');
jest.mock('@/components/ui/use-toast');

describe('BaseCalendar', () => {
  const mockToast = jest.fn();

  beforeEach(() => {
    (useFetchCalendarEvents as jest.Mock).mockReturnValue({
      events: [mockCalendarEvent],
      loading: false,
      error: undefined,
    });

    (useBaseCalendar as jest.Mock).mockReturnValue({
      onDeleteCalendarEventAndRepairJob: jest.fn(),
      onSetCalendarEvent: jest.fn(),
    });

    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    headerToolbar: DEFAULT_CALENDAR_HEADER_TOOLBAR_CONFIG,
    calendarView: DEFAULT_CALENDAR_VIEW,
    calendarActions: {
      isDeleteEventModalOpen: false,
      isLoading: false,
      onOpenDeleteEventModal: jest.fn(),
      onDeleteCalendarEvent: jest.fn(),
      onCloseDeleteEventModal: jest.fn(),
      onHandleDateClick: jest.fn(),
    },
  };

  const BaseCalendarComponent = () =>
    withApolloProvider(<BaseCalendar {...defaultProps} />, [mockCreateRepairJobAndCalendarEventResponse]);

  it('should render component without crashing', () => {
    render(BaseCalendarComponent());

    expect(screen.getByTestId('calendar')).toBeInTheDocument();
  });

  it('should show loading spinner when calendar events are loading', () => {
    (useFetchCalendarEvents as jest.Mock).mockReturnValue({
      events: [],
      loading: true,
      error: undefined,
    });

    render(BaseCalendarComponent());

    expect(screen.getByTestId('circles-svg')).toBeInTheDocument();
  });

  it('should show error alert when calendar events are failed to fetch', () => {
    (useFetchCalendarEvents as jest.Mock).mockReturnValue({
      events: [],
      loading: false,
      error: 'Error occurs',
    });

    render(BaseCalendarComponent());

    expect(mockToast).toHaveBeenCalled();
  });
});
