import * as apollo from '@apollo/client';
import { render, screen } from '@testing-library/react';

import { mockBenjaminHallRecord } from '@/mocks/technicianManagementMocks';
import { withRouterAndApolloProvider } from '@/mocks/testMocks';
import TechnicianRecordDetails from '@/modules/technician-management/components/technician-record-details';
import { AppRoutes } from '@/types/enums';

jest.mock('short-uuid', () => {
  return {
    generate: jest.fn(() => 'mocked-uuid'),
  };
});

describe('TechnicianRecordDetails', () => {
  beforeEach(() => {
    jest.spyOn(apollo, 'useQuery').mockImplementation(() => {
      return {
        data: {
          getTechnicianRecordById: mockBenjaminHallRecord,
        },
      } as apollo.QueryResult;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const TechnicianRecordDetailsComponent = () =>
    withRouterAndApolloProvider(<TechnicianRecordDetails />, AppRoutes.TechnicianManagement);

  it('should render component without crashing', () => {
    render(TechnicianRecordDetailsComponent());

    expect(screen.getByText("Benjamin Hall's Record Details")).toBeInTheDocument();
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

    render(TechnicianRecordDetailsComponent());

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

    render(TechnicianRecordDetailsComponent());

    expect(screen.getByText('Error Occurs'));
  });

  it('should disable Edit button when form fields are not changed or form is updating', () => {
    render(TechnicianRecordDetailsComponent());

    const editButton = screen.getByRole('button', { name: /edit/i });

    expect(editButton).toHaveClass('disabled:pointer-events-all');
  });
});
