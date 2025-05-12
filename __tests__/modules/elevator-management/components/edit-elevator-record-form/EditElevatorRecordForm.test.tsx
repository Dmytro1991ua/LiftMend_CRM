import { render, screen } from '@testing-library/react';

import { mockElevatorManagementDropdownOptions } from '@/mocks/dropdownOptions';
import { mockElevatorRecordsFormData } from '@/mocks/elevatorManagementMocks';
import { withApolloAndFormProvider } from '@/mocks/testMocks';
import EditElevatorRecordForm from '@/modules/elevator-management/components/edit-elevator-record-form';
import { EditElevatorRecordFormProps } from '@/modules/elevator-management/components/edit-elevator-record-form/EditElevatorRecordForm';
import { useFetchDropdownOptions } from '@/shared/hooks/useFetchDropdownOptions';

jest.mock('@/shared/hooks/useFetchDropdownOptions');

describe('EditElevatorRecordForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockElevatorRecordFormValues = {
    elevatorType: 'Glass Elevator',
    capacity: 2000,
    buildingName: 'Silverhill Apartments',
    elevatorLocation: 'Penthouse',
    id: '0b05a6f3-5e6a-44ce-978e-4d62a1bb41f4',
    status: 'Operational',
    lastMaintenanceDate: new Date('2024-01-20T10:00:00.000Z'),
    nextMaintenanceDate: new Date('2024-03-10T13:00:00.000Z'),
  };

  const EditElevatorRecordFormComponent = (props?: Partial<EditElevatorRecordFormProps>) =>
    withApolloAndFormProvider(
      <EditElevatorRecordForm elevatorRecordFormValues={mockElevatorRecordFormValues} {...props} />,
      [mockElevatorRecordsFormData]
    );

  it('should render component without crashing', () => {
    (useFetchDropdownOptions as jest.Mock).mockReturnValue({
      dropdownOptions: mockElevatorManagementDropdownOptions,
      loading: false,
      error: undefined,
    });

    render(EditElevatorRecordFormComponent());

    expect(screen.getByTestId('edit-elevator-record-form')).toBeInTheDocument();
  });

  it('should loader when from data is fetching', () => {
    (useFetchDropdownOptions as jest.Mock).mockReturnValue({
      dropdownOptions: mockElevatorManagementDropdownOptions,
      loading: true,
      error: undefined,
    });

    render(EditElevatorRecordFormComponent());

    expect(screen.getByTestId('edit-elevator-record-form')).toBeInTheDocument();
    expect(screen.getByTestId('circles-with-bar-svg')).toBeInTheDocument();
  });

  it('should display error alert when fetch of form data', () => {
    (useFetchDropdownOptions as jest.Mock).mockReturnValue({
      dropdownOptions: mockElevatorManagementDropdownOptions,
      loading: false,
      error: 'Fetch form data failed',
    });

    render(EditElevatorRecordFormComponent());

    expect(screen.getByText('Fetch form data failed')).toBeInTheDocument();
  });
});
