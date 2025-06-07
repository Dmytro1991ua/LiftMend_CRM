import { render, screen } from '@testing-library/react';

import { mockCalendarEvent, mockCalendarEventsResponse } from '@/mocks/repairJobScheduling';
import { withApolloAndFormProvider } from '@/mocks/testMocks';
import RepairJobScheduling from '@/modules/repair-job-scheduling';
import { useFetchCalendarEvents } from '@/shared/base-calendar/hooks';

jest.mock('@/shared/base-calendar/hooks', () => ({
  ...jest.requireActual('@/shared/base-calendar/hooks'),
  useFetchCalendarEvents: jest.fn(),
}));

describe('RepairJobScheduling', () => {
  beforeEach(() => {
    (useFetchCalendarEvents as jest.Mock).mockReturnValue({
      loading: false,
      error: undefined,
      events: [mockCalendarEvent],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const RepairJobSchedulingComponent = () =>
    withApolloAndFormProvider(<RepairJobScheduling />, [mockCalendarEventsResponse]);

  it('should render component without crashing', () => {
    render(RepairJobSchedulingComponent());

    expect(screen.getByText('Repair Job Scheduling')).toBeInTheDocument();
    expect(screen.getByText('Schedule and manage repair jobs associated with specific elevators')).toBeInTheDocument();
    expect(screen.getByTestId('header-actions')).toBeInTheDocument();
    expect(screen.getByTestId('calendar')).toBeInTheDocument();
  });
});
