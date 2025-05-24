import { render, screen } from '@testing-library/react';

import { mockTechnicalManagementDropdownOptions } from '@/mocks/dropdownOptions';
import { withApolloAndFormProvider } from '@/mocks/testMocks';
import TechnicianRecordForm from '@/modules/technician-management/components/technician-record-form';
import { useFetchDropdownOptions } from '@/shared/hooks/useFetchDropdownOptions';

jest.mock('@/shared/hooks/useFetchDropdownOptions');

describe('TechnicianRecordForm', () => {
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

  const TechnicianRecordFormComponent = () => withApolloAndFormProvider(<TechnicianRecordForm onReset={jest.fn()} />);

  it('should render component without crashing', () => {
    render(TechnicianRecordFormComponent());

    expect(screen.getByText('Basic Information')).toBeInTheDocument();
    expect(screen.getByText('Skills and Certifications')).toBeInTheDocument();
  });
});
