import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';

import { mockCalendarEventInfo } from '@/mocks/repairJobScheduling';
import { withRouterProvider } from '@/mocks/testMocks';
import CalendarEventContent from '@/shared/base-calendar/components/calendar-event-content';
import { CalendarEventContentProps } from '@/shared/base-calendar/components/calendar-event-content/CalendarEventContent';
import { CalendarActions } from '@/shared/base-calendar/types';
import { AppRoutes } from '@/types/enums';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('CalendarEventContent', () => {
  const mockOnSetCalendarEvent = jest.fn();
  const mockOnOpenDeleteEventModal = jest.fn();
  const mockPush = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    eventInfo: mockCalendarEventInfo,
    calendarActions: {
      onOpenDeleteEventModal: mockOnOpenDeleteEventModal,
    } as unknown as CalendarActions,
    onSetCalendarEvent: mockOnSetCalendarEvent,
  };

  const CalendarEventContentComponent = (props?: Partial<CalendarEventContentProps>) =>
    withRouterProvider(<CalendarEventContent {...defaultProps} {...props} />, AppRoutes.RepairJobScheduling);

  it('should render component without crashing', () => {
    render(CalendarEventContentComponent());

    expect(screen.getByText('Inspection Repair Job')).toBeInTheDocument();
    expect(screen.getByText('Repair Job for Panoramic Lift at Cityscape Residences - Event Stage')).toBeInTheDocument();
    expect(screen.getByTestId('delete-event-icon')).toBeInTheDocument();
  });

  it('should redirect to repair job scheduling details page on event calendar click', async () => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    render(CalendarEventContentComponent());

    const calendarEventContent = screen.getByTestId('calendar-event-content');

    await userEvent.click(calendarEventContent);

    expect(mockPush).toHaveBeenCalledWith(
      `${AppRoutes.RepairJobScheduling}/${defaultProps.eventInfo.event.extendedProps.repairJobId}`
    );
  });

  it('should open delete calendar event warning modal on trash icon click and set event info', async () => {
    render(CalendarEventContentComponent());

    const trashIcon = screen.getByTestId('delete-event-icon');

    await userEvent.click(trashIcon);

    expect(mockOnOpenDeleteEventModal).toHaveBeenCalled();
    expect(mockOnSetCalendarEvent).toHaveBeenCalledWith(mockCalendarEventInfo);
  });
});
