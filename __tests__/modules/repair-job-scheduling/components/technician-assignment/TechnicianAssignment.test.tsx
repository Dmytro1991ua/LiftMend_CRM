import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { mockAvailableTechnician, mockAvailableTechniciansResponse } from '@/mocks/repairJobScheduling';
import { withApolloAndFormProvider } from '@/mocks/testMocks';
import TechnicianAssignment from '@/modules/repair-job-scheduling/components/technician-assignment';
import { TECHNICIAN_NAME_TOOLTIP_MESSAGE } from '@/modules/repair-job-scheduling/constants';
import { useFetchAvailableTechniciansForAssignment } from '@/shared/hooks';

jest.mock('@/shared/hooks', () => ({
  ...jest.requireActual('@/shared/hooks'),
  useFetchAvailableTechniciansForAssignment: jest.fn(),
}));

describe('TechnicianAssignment', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    (useFetchAvailableTechniciansForAssignment as jest.Mock).mockReturnValue({
      availableTechnicians: [mockAvailableTechnician],
      loading: false,
      error: undefined,
    });
  });

  const TechnicianAssignmentComponent = () =>
    withApolloAndFormProvider(<TechnicianAssignment />, [mockAvailableTechniciansResponse]);

  it('should render component without crashing', () => {
    render(TechnicianAssignmentComponent());

    expect(screen.getByText('Technician Name')).toBeInTheDocument();
  });

  it('should show tooltip on info icon hover', async () => {
    render(TechnicianAssignmentComponent());

    const tooltipTrigger = screen.getByTestId('info-icon');

    await userEvent.hover(tooltipTrigger);

    const tooltipText = await screen.findByText(TECHNICIAN_NAME_TOOLTIP_MESSAGE);

    expect(tooltipText).toBeInTheDocument();
  });

  it('should show loader when data for details page is fetching', () => {
    (useFetchAvailableTechniciansForAssignment as jest.Mock).mockReturnValue({
      availableTechnicians: [mockAvailableTechnician],
      loading: true,
      error: undefined,
    });

    render(TechnicianAssignmentComponent());

    const loader = screen.getByTestId('bars-loading');

    expect(loader).toBeInTheDocument();
  });

  it('should show error alert message when data fetching for details page is failed', () => {
    (useFetchAvailableTechniciansForAssignment as jest.Mock).mockReturnValue({
      availableTechnicians: [mockAvailableTechnician],
      loading: false,
      error: 'Error Occurs',
    });

    render(TechnicianAssignmentComponent());

    expect(screen.getByText('Error Occurs'));
  });
});
