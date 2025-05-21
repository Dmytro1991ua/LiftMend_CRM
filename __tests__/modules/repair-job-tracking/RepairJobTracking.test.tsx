import * as apollo from '@apollo/client';
import { render, screen } from '@testing-library/react';

import { mockMastLiftRepairJob, mockPassengerElevatorRepairJob } from '@/mocks/repairJobTrackingMocks';
import { withApolloAndFormProvider } from '@/mocks/testMocks';
import RepairJobTracking from '@/modules/repair-job-tracking';
import { SectionHeaderDescription, SectionHeaderTitle } from '@/types/enums';

describe('RepairJobTracking', () => {
  beforeEach(() => {
    jest.spyOn(apollo, 'useQuery').mockImplementation(() => {
      return {
        data: {
          getRepairJobs: {
            edges: [mockPassengerElevatorRepairJob, mockMastLiftRepairJob],
          },
        },
      } as apollo.QueryResult;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const RepairJobTrackingComponent = () => withApolloAndFormProvider(<RepairJobTracking />);

  it('should render component without crashing', () => {
    render(RepairJobTrackingComponent());

    expect(screen.getByText(SectionHeaderTitle.RepairJobTracking)).toBeInTheDocument();
    expect(screen.getByText(SectionHeaderDescription.RepairJobTracking)).toBeInTheDocument();
    expect(screen.getByTestId('header-actions')).toBeInTheDocument();
    expect(screen.getByTestId('base-table')).toBeInTheDocument();
  });
});
