import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as form from 'react-hook-form';
import { UseFormReturn } from 'react-hook-form';

import { mockTechnicalManagementDropdownOptions } from '@/mocks/dropdownOptions';
import { mockFormState } from '@/mocks/formStateMock';
import { mockTechnicianRecordsFormData } from '@/mocks/technicianManagementMocks';
import { withApolloAndFormProvider } from '@/mocks/testMocks';
import EditTechnicianRecordForm, {
  EditTechnicianRecordFormProps,
} from '@/modules/technician-management/components/edit-technician-record-form/EditTechnicianRecordForm';
import { useFetchDropdownOptions } from '@/shared/hooks/useFetchDropdownOptions';

jest.mock('@/shared/hooks/useFetchDropdownOptions');

describe('EditTechnicianRecordForm', () => {
  const mockTechnicianRecordFormValues = {
    contactInformation: 'jane.smith@example.com',
    id: '6c7f439a-36d5-4fab-8272-d038cf045e4a',
    name: 'Jane Smith',
    skills: ['Hydraulic', 'Repair', 'Safety Inspection'],
    certifications: ['Electrical Work License', 'Safety Management Certification'],
  };

  beforeEach(() => {
    (useFetchDropdownOptions as jest.Mock).mockReturnValue({
      dropdownOptions: mockTechnicalManagementDropdownOptions,
      loading: false,
      error: undefined,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const EditTechnicianRecordFormComponent = (props?: Partial<EditTechnicianRecordFormProps>) =>
    withApolloAndFormProvider(
      <EditTechnicianRecordForm technicianRecordFormValues={mockTechnicianRecordFormValues} {...props} />,
      [mockTechnicianRecordsFormData]
    );

  it('should render component without crashing', () => {
    render(EditTechnicianRecordFormComponent());

    expect(screen.getByTestId('edit-form-entity')).toBeInTheDocument();
  });

  it('should loader when from data is fetching', () => {
    (useFetchDropdownOptions as jest.Mock).mockReturnValue({
      dropdownOptions: mockTechnicalManagementDropdownOptions,
      loading: true,
      error: undefined,
    });

    render(EditTechnicianRecordFormComponent());

    expect(screen.getByTestId('edit-form-entity')).toBeInTheDocument();
    expect(screen.getByTestId('circles-with-bar-svg')).toBeInTheDocument();
  });

  it('should display error alert when fetch of form data', () => {
    (useFetchDropdownOptions as jest.Mock).mockReturnValue({
      dropdownOptions: mockTechnicalManagementDropdownOptions,
      loading: false,
      error: 'Fetch form data failed',
    });

    render(EditTechnicianRecordFormComponent());

    expect(screen.getByText('Fetch form data failed')).toBeInTheDocument();
  });

  it('should trigger clearErrors on input change', async () => {
    const mockOnClearErrors = jest.fn();
    const mockTechnicianNameFieldValue = 'Joe Doe';

    jest.spyOn(form, 'useFormContext').mockReturnValue({
      formState: {
        ...mockFormState.formState,
      },
      clearErrors: mockOnClearErrors,
      setValue: jest.fn(),
      reset: jest.fn(),
      register: jest.fn().mockReturnValue({ onChange: mockOnClearErrors }),
    } as unknown as UseFormReturn);

    render(EditTechnicianRecordFormComponent());

    const technicianNameInput = screen.getByPlaceholderText(/Please provide a full name/i) as HTMLInputElement;

    await userEvent.clear(technicianNameInput);
    await userEvent.type(technicianNameInput, mockTechnicianNameFieldValue);

    expect(technicianNameInput.value).toBe(mockTechnicianNameFieldValue);
    expect(mockOnClearErrors).toHaveBeenCalled();
  });
});
