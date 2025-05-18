import { QueryResult, useQuery } from '@apollo/client';
import { render, screen } from '@testing-library/react';

import { mockRepairJobTypes } from '@/mocks/dropdownOptions';
import { mockSelectedDateRange } from '@/mocks/repairJobScheduling';
import { withApolloAndFormProvider } from '@/mocks/testMocks';
import RepairJobForm from '@/modules/repair-job-scheduling/components/repair-job-tracking-from';
import { useRepairJobForm } from '@/modules/repair-job-scheduling/components/repair-job-tracking-from/hooks';

jest.mock('@/modules/repair-job-scheduling/components/repair-job-tracking-from/hooks');
jest.mock('@apollo/client');

describe('RepairJobForm', () => {
  const defaultProps = {
    selectedDateRange: mockSelectedDateRange,
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
        data: {
          getRepairJobScheduleData: {
            repairJobTypes: [mockRepairJobTypes],
          },
        },
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
