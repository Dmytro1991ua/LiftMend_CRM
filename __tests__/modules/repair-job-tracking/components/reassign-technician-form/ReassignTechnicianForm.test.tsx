import { QueryResult, useQuery } from '@apollo/client';
import { render, screen } from '@testing-library/react';

import { mockAvailableTechnicians, mockRepairJob, mockWarningAlertMessage } from '@/mocks/repairJobTrackingMocks';
import { withApolloAndFormProvider } from '@/mocks/testMocks';
import ReassignTechnicianForm, {
  ReassignTechnicianFormProps,
} from '@/modules/repair-job-tracking/components/reassign-technician-action-cell/reassign-technician-form/ReassignTechnicianForm';

jest.mock('@apollo/client');

describe('ReassignTechnicianForm', () => {
  beforeEach(() => {
    (useQuery as jest.Mock).mockImplementation(() => {
      return {
        data: {
          getAvailableTechniciansForAssignment: mockAvailableTechnicians,
        },
        loading: false,
      } as unknown as QueryResult;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const ReassignTechnicianFormComponent = (props?: Partial<ReassignTechnicianFormProps>) =>
    withApolloAndFormProvider(<ReassignTechnicianForm repairJob={mockRepairJob} {...props} />);

  it('should render component without crashing', () => {
    render(ReassignTechnicianFormComponent());

    expect(screen.getByTestId('base-alert')).toBeInTheDocument();
    expect(screen.getByText(mockWarningAlertMessage)).toBeInTheDocument();
    expect(screen.getByText('Technician Name')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});
