import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as form from 'react-hook-form';
import { UseFormReturn } from 'react-hook-form';

import { mockAvailableTechnicianStatuses, mockTechnicianEmploymentStatus } from '@/mocks/dropdownOptions';
import { mockFormState } from '@/mocks/formStateMock';
import { withApolloAndFormProvider } from '@/mocks/testMocks';
import BasicInformation from '@/modules/technician-management/components/technician-record-form/steps/basic-information';
import { useFetchDropdownOptions } from '@/shared/hooks/useFetchDropdownOptions';

jest.mock('@/shared/hooks/useFetchDropdownOptions');

describe('BasicInformation', () => {
  beforeEach(() => {
    (useFetchDropdownOptions as jest.Mock).mockImplementation(() => {
      return {
        dropdownOptions: {
          availabilityStatuses: [...mockAvailableTechnicianStatuses.availabilityStatuses],
          employmentStatuses: [...mockTechnicianEmploymentStatus.employmentStatuses],
        },
        loading: false,
        error: undefined,
      };
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const BasicInformationComponent = () => withApolloAndFormProvider(<BasicInformation />);

  it('should render component without crashing', async () => {
    render(BasicInformationComponent());

    expect(screen.getByText('Technician Full Name')).toBeInTheDocument();
    expect(screen.getByText('Contact Information')).toBeInTheDocument();
    expect(screen.getByText('Availability Status')).toBeInTheDocument();
    expect(screen.getByText('Employment Status')).toBeInTheDocument();
  });

  it('should show loader when data for details page is fetching', () => {
    (useFetchDropdownOptions as jest.Mock).mockImplementation(() => {
      return {
        dropdownOptions: [],
        loading: true,
        error: undefined,
      };
    });

    render(BasicInformationComponent());

    const loader = screen.getByTestId('bars-loading');

    expect(loader).toBeInTheDocument();
  });

  it('should show error alert message when data fetching for details page is failed', () => {
    (useFetchDropdownOptions as jest.Mock).mockImplementation(() => {
      return {
        dropdownOptions: [],
        loading: false,
        error: 'Error Occurs',
      };
    });

    render(BasicInformationComponent());

    expect(screen.getByText('Error Occurs'));
  });

  it('should trigger clearErrors on technician name input change', async () => {
    const mockOnClearErrors = jest.fn();
    const mockTechnicianNameFieldValue = 'Joe Doe';

    jest.spyOn(form, 'useFormContext').mockReturnValue({
      formState: {
        ...mockFormState.formState,
      },
      clearErrors: mockOnClearErrors,
      register: jest.fn().mockReturnValue({ onChange: mockOnClearErrors }),
    } as unknown as UseFormReturn);

    render(BasicInformationComponent());

    const technicianNameInput = screen.getByPlaceholderText(/Please provide a full name/i) as HTMLInputElement;

    await userEvent.type(technicianNameInput, mockTechnicianNameFieldValue);

    expect(technicianNameInput.value).toBe(mockTechnicianNameFieldValue);
    expect(mockOnClearErrors).toHaveBeenCalled();
  });

  it('should trigger clearErrors on contact info input change', async () => {
    const mockOnClearErrors = jest.fn();
    const mockContactInfoFieldValue = 'test@gmail.com';

    jest.spyOn(form, 'useFormContext').mockReturnValue({
      formState: {
        ...mockFormState.formState,
      },
      clearErrors: mockOnClearErrors,
      register: jest.fn().mockReturnValue({ onChange: mockOnClearErrors }),
    } as unknown as UseFormReturn);

    render(BasicInformationComponent());

    const contactInfoInput = screen.getByPlaceholderText(/Please provide a contact information/i) as HTMLInputElement;

    await userEvent.type(contactInfoInput, mockContactInfoFieldValue);

    expect(contactInfoInput.value).toBe(mockContactInfoFieldValue);
    expect(mockOnClearErrors).toHaveBeenCalled();
  });
});
