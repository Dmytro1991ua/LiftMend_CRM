import * as apollo from '@apollo/client';
import { render, screen } from '@testing-library/react';

import { mockElevatorRecord } from '@/mocks/elevatorManagementMocks';
import { withRouterAndApolloProvider } from '@/mocks/testMocks';
import ElevatorRecordDetails from '@/modules/elevator-management/components/elevator-record-details/ElevatorRecordDetails';
import { AppRoutes } from '@/types/enums';

jest.mock('short-uuid', () => {
  return {
    generate: jest.fn(() => 'mocked-uuid'),
  };
});

describe('ElevatorRecordDetails', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const ElevatorRecordDetailsComponent = () =>
    withRouterAndApolloProvider(<ElevatorRecordDetails />, AppRoutes.ElevatorManagement);

  it('should render component without crashing', () => {
    jest.spyOn(apollo, 'useQuery').mockImplementation(() => {
      return {
        data: {
          getElevatorRecordById: mockElevatorRecord,
        },
      } as apollo.QueryResult;
    });

    render(ElevatorRecordDetailsComponent());

    expect(screen.getByText('Scenic Elevator Information')).toBeInTheDocument();
    expect(
      screen.getByText('Elevator Record of Scenic Elevator at Skyline Plaza - Observation Deck')
    ).toBeInTheDocument();
    expect(screen.getByTestId('header-actions')).toBeInTheDocument();
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

    render(ElevatorRecordDetailsComponent());

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

    render(ElevatorRecordDetailsComponent());

    expect(screen.getByText('Error Occurs'));
  });

  it('should disable Edit button when form fields are not changed', () => {
    render(ElevatorRecordDetailsComponent());

    const editButton = screen.getByRole('button', { name: /edit/i });

    expect(editButton).toHaveClass('disabled:pointer-events-all');
  });
});
