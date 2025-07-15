import * as apollo from '@apollo/client';
import { render, screen } from '@testing-library/react';

import { mockRepairJob } from '@/mocks/repairJobTrackingMocks';
import { withRouterAndApolloProvider } from '@/mocks/testMocks';
import { OVERDUE_JOB_WARNING_MESSAGE } from '@/shared/repair-job/constants';
import RepairJobDetails from '@/shared/repair-job/repair-job-details';
import { AppRoutes } from '@/types/enums';

describe('RepairJobDetails', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const RepairJobDetailsComponent = () => withRouterAndApolloProvider(<RepairJobDetails />, AppRoutes.RepairJobDetails);

  it('should render component without crashing', () => {
    jest.spyOn(apollo, 'useQuery').mockImplementation(() => {
      return {
        data: {
          getRepairJobById: mockRepairJob,
        },
      } as apollo.QueryResult;
    });

    render(RepairJobDetailsComponent());

    expect(screen.getByText('Routine Repair Job')).toBeInTheDocument();
    expect(screen.getByText('Repair Job for Passenger Elevator at Crystal Ridge Towers - Lobby')).toBeInTheDocument();
    expect(screen.getByTestId('header-actions')).toBeInTheDocument();
  });

  it('should display a warning alert when repair job is overdue', () => {
    jest.spyOn(apollo, 'useQuery').mockImplementation(() => {
      return {
        data: {
          getRepairJobById: { ...mockRepairJob, isOverdue: true },
        },
      } as apollo.QueryResult;
    });

    render(RepairJobDetailsComponent());

    expect(screen.getByTestId('base-alert')).toBeInTheDocument();
    expect(screen.getByText(OVERDUE_JOB_WARNING_MESSAGE)).toBeInTheDocument();
  });

  it('should show loader when data for details page is fetching', () => {
    jest.spyOn(apollo, 'useQuery').mockImplementation(() => {
      return {
        data: {
          undefined,
        },
        loading: true,
        error: undefined,
      } as apollo.QueryResult;
    });

    render(RepairJobDetailsComponent());

    const loaders = screen.getAllByTestId('audio-svg');
    const detailsPageHeaderLoader = loaders[0];
    const detailsPageContentLoader = loaders[1];

    expect(detailsPageHeaderLoader).toBeInTheDocument();
    expect(detailsPageContentLoader).toBeInTheDocument();
  });

  it('should show error alert message when data fetching for details page is failed', () => {
    jest.spyOn(apollo, 'useQuery').mockImplementation(() => {
      return {
        data: undefined,
        loading: false,
        error: { message: 'Error Occurs' },
      } as apollo.QueryResult;
    });

    render(RepairJobDetailsComponent());

    expect(screen.getByText('Error Occurs'));
  });

  it('should disable Edit button when form fields are not changed', () => {
    render(RepairJobDetailsComponent());

    const editButton = screen.getByRole('button', { name: /edit/i });

    expect(editButton).toHaveClass('disabled:pointer-events-all');
  });
});
