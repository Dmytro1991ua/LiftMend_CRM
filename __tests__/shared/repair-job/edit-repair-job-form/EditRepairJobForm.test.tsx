import { render, screen } from '@testing-library/react';

import { mockRepairJobsDropdownOptions } from '@/mocks/dropdownOptions';
import { mockRepairJobsFormData } from '@/mocks/repairJobTrackingMocks';
import { withApolloAndFormProvider } from '@/mocks/testMocks';
import { useFetchDropdownOptions } from '@/shared/hooks/useFetchDropdownOptions';
import EditRepairJobForm, { EditRepairJobFormProps } from '@/shared/repair-job/edit-repair-job-form/EditRepairJobForm';

jest.mock('@/shared/hooks/useFetchDropdownOptions');

describe('EditRepairJobForm', () => {
  const mockRepairJobFormValues = {
    jobType: 'Consultation',
    jobDescription: 'asdasdasdasdasda23qeqwdead',
    jobPriority: 'Medium',
    scheduledDates: {
      from: new Date('2025-01-18T22:00:00.000Z'),
      to: new Date('2025-01-21T21:59:59.999Z'),
    },
    elevatorType: 'Ship Elevator',
    buildingName: 'Bayview Condominiums',
    elevatorLocation: 'Kitchen',
    technicianName: 'Alice Johnson',
    id: '86ab9c06-d893-4e3b-a177-7ded23f95f70',
    calendarEventId: '0625e6c8-dfd5-45d0-94be-73441f2c7377',
    status: 'In Progress',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  const EditRepairJobFormComponent = (props?: Partial<EditRepairJobFormProps>) =>
    withApolloAndFormProvider(<EditRepairJobForm repairJobFormValues={mockRepairJobFormValues} {...props} />, [
      mockRepairJobsFormData,
    ]);

  it('should render component without crashing', () => {
    (useFetchDropdownOptions as jest.Mock).mockReturnValue({
      dropdownOptions: mockRepairJobsDropdownOptions,
      loading: false,
      error: undefined,
    });

    render(EditRepairJobFormComponent());

    expect(screen.getByTestId('edit-form-entity')).toBeInTheDocument();
  });

  it('should loader when from data is fetching', () => {
    (useFetchDropdownOptions as jest.Mock).mockReturnValue({
      dropdownOptions: mockRepairJobsDropdownOptions,
      loading: true,
      error: undefined,
    });

    render(EditRepairJobFormComponent());

    expect(screen.getByTestId('edit-form-entity')).toBeInTheDocument();
    expect(screen.getByTestId('circles-with-bar-svg')).toBeInTheDocument();
  });

  it('should display error alert when fetch of form data', () => {
    (useFetchDropdownOptions as jest.Mock).mockReturnValue({
      dropdownOptions: mockRepairJobsDropdownOptions,
      loading: false,
      error: 'Fetch form data failed',
    });

    render(EditRepairJobFormComponent());

    expect(screen.getByText('Fetch form data failed')).toBeInTheDocument();
  });
});
