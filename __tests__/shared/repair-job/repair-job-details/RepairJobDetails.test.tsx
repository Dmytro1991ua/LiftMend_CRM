import * as apollo from '@apollo/client';
import { render, screen } from '@testing-library/react';

import { mockRepairJob } from '@/mocks/repairJobTrackingMocks';
import { withRouterAndApolloProvider } from '@/mocks/testMocks';
import { OVERDUE_JOB_WARNING_MESSAGE } from '@/shared/repair-job/constants';
import RepairJobDetails from '@/shared/repair-job/repair-job-details';
import { AppRoutes } from '@/types/enums';

describe('RepairJobDetails', () => {
  beforeEach(() => {
    jest.spyOn(apollo, 'useQuery').mockReturnValue({
      data: {
        getRepairJobById: mockRepairJob,
      },
      loading: false,
      error: undefined,
    } as apollo.QueryResult);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const RepairJobDetailsComponent = () => withRouterAndApolloProvider(<RepairJobDetails />, AppRoutes.RepairJobDetails);

  it('should render component without crashing', () => {
    render(RepairJobDetailsComponent());

    expect(screen.getByText('Routine Repair Job')).toBeInTheDocument();
    expect(screen.getByText('Repair Job for Passenger Elevator at Crystal Ridge Towers - Lobby')).toBeInTheDocument();
    expect(screen.getByTestId('header-actions')).toBeInTheDocument();
  });

  it('should display a warning alert when repair job is overdue', () => {
    jest.spyOn(apollo, 'useQuery').mockReturnValue({
      data: {
        getRepairJobById: { ...mockRepairJob, isOverdue: true },
      },
    } as apollo.QueryResult);

    render(RepairJobDetailsComponent());

    expect(screen.getByTestId('base-alert')).toBeInTheDocument();
    expect(screen.getByText(OVERDUE_JOB_WARNING_MESSAGE)).toBeInTheDocument();
  });

  it('should show loader when data for details page is fetching', () => {
    jest.spyOn(apollo, 'useQuery').mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
    } as apollo.QueryResult);

    render(RepairJobDetailsComponent());

    const loaders = screen.getAllByTestId('audio-svg');
    const detailsPageHeaderLoader = loaders[0];
    const detailsPageContentLoader = loaders[1];

    expect(detailsPageHeaderLoader).toBeInTheDocument();
    expect(detailsPageContentLoader).toBeInTheDocument();
  });

  it('should show error alert message when data fetching for details page is failed', () => {
    jest.spyOn(apollo, 'useQuery').mockReturnValue({
      data: undefined,
      loading: false,
      error: { message: 'Error Occurs' },
    } as apollo.QueryResult);

    render(RepairJobDetailsComponent());

    expect(screen.getByText('Error Occurs')).toBeInTheDocument();
  });

  it('should disable Edit button when form fields are not changed', () => {
    render(RepairJobDetailsComponent());

    const editButton = screen.getByRole('button', { name: /edit/i });

    expect(editButton).toHaveClass('disabled:pointer-events-all');
  });

  it('should render Photo Evidence section when beforePhotoUrl exists', () => {
    jest.spyOn(apollo, 'useQuery').mockReturnValue({
      data: {
        getRepairJobById: {
          ...mockRepairJob,
          beforePhotoUrl: 'https://example.com/before.jpg',
          afterPhotoUrl: 'https://example.com/after.jpg',
        },
      },
    } as apollo.QueryResult);

    render(RepairJobDetailsComponent());

    expect(screen.getByText('Photo Evidence')).toBeInTheDocument();
    expect(screen.getByText('Before')).toBeInTheDocument();
    expect(screen.getByText('After')).toBeInTheDocument();
  });

  it('should render Completion Checklist when job is completed and checklist exists', () => {
    jest.spyOn(apollo, 'useQuery').mockReturnValue({
      data: {
        getRepairJobById: {
          ...mockRepairJob,
          status: 'Completed',
          checklist: [
            { label: 'Check motor', checked: true, comment: 'OK' },
            { label: 'Check cables', checked: false, comment: 'Needs replacement' },
          ],
        },
      },
    } as apollo.QueryResult);

    render(RepairJobDetailsComponent());

    expect(screen.getByText('Completion Checklist')).toBeInTheDocument();
    expect(screen.getByText('Check motor')).toBeInTheDocument();
    expect(screen.getByText('Check cables')).toBeInTheDocument();
  });

  it('should render Inventory Parts Usage section when job is completed and inventory parts usage list exist', () => {
    jest.spyOn(apollo, 'useQuery').mockReturnValue({
      data: {
        getRepairJobById: {
          ...mockRepairJob,
          status: 'Completed',
          inventoryPartsUsage: [
            { name: 'test_name_1', partId: 'test_part_id_1', quantity: '2', id: 'test_id_1' },
            { name: 'test_name_2', partId: 'test_part_id_2', quantity: '3', id: 'test_id_2' },
          ],
        },
      },
    } as apollo.QueryResult);

    render(RepairJobDetailsComponent());

    expect(screen.getByText('Inventory Parts Usage')).toBeInTheDocument();
    expect(screen.getByText('test_name_1')).toBeInTheDocument();
    expect(screen.getByText('test_name_2')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
    expect(screen.getByDisplayValue('3')).toBeInTheDocument();
  });
});
