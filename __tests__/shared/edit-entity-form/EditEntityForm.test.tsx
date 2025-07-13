import { render, screen } from '@testing-library/react';

import { withFormProvider } from '@/mocks/testMocks';
import EditEntityForm, { EditEntityFormProps } from '@/shared/edit-entity-form/EditEntityForm';
import { FormFieldLabel, TechnicianRecord } from '@/shared/types';

describe('EditEntityForm', () => {
  const mockFormValues = {
    contactInformation: 'test@example.com',
    id: 'test-id-1',
    name: 'William Thomas',
  };
  const mockFieldsConfig = [
    {
      id: 1,
      label: FormFieldLabel.ContactInformation,
      content: <p>Test Contact Info content </p>,
    },
    {
      id: 2,
      label: FormFieldLabel.TechnicianName,
      content: <p>Test Technician name content </p>,
    },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    formValues: mockFormValues,
    fieldConfigs: mockFieldsConfig,
    loading: false,
    error: undefined,
  };

  const EditEntityFormComponent = (props?: Partial<EditEntityFormProps<TechnicianRecord>>) =>
    withFormProvider(<EditEntityForm {...defaultProps} {...props} />);

  it('should render component without crashing', () => {
    render(EditEntityFormComponent());

    expect(screen.getByTestId('edit-form-entity')).toBeInTheDocument();
    expect(screen.getByText('Contact Information')).toBeInTheDocument();
    expect(screen.getByText('Test Contact Info content')).toBeInTheDocument();
    expect(screen.getByText('Technician Name')).toBeInTheDocument();
    expect(screen.getByText('Test Technician name content')).toBeInTheDocument();
  });

  it('should render loading spinner when loading prop is true', () => {
    render(EditEntityFormComponent({ loading: true }));

    expect(screen.getByTestId('circles-with-bar-svg')).toBeInTheDocument();
  });

  it('should render error alert when error prop is provided', () => {
    const mockError = 'Test Error';

    render(EditEntityFormComponent({ error: mockError }));

    expect(screen.getByTestId('base-alert')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch form data')).toBeInTheDocument();
    expect(screen.getByText(mockError)).toBeInTheDocument();
  });
});
