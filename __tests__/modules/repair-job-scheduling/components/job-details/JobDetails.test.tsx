import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as form from 'react-hook-form';
import { UseFormReturn } from 'react-hook-form';

import { mockRepairJobPriorities, mockRepairJobTypes } from '@/mocks/dropdownOptions';
import { mockFormState } from '@/mocks/formStateMock';
import { withApolloAndFormProvider } from '@/mocks/testMocks';
import JobDetails from '@/modules/repair-job-scheduling/components/job-details';
import { useFetchDropdownOptions } from '@/shared/hooks/useFetchDropdownOptions';

jest.mock('@/shared/hooks/useFetchDropdownOptions');

describe('JobDetails', () => {
  beforeEach(() => {
    (useFetchDropdownOptions as jest.Mock).mockImplementation(() => {
      return {
        dropdownOptions: {
          repairJobTypes: [mockRepairJobTypes],
          priorities: [mockRepairJobPriorities],
        },
        loading: false,
        error: undefined,
      };
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const JobDetailsComponent = () => withApolloAndFormProvider(<JobDetails />);

  it('should render component without crashing', async () => {
    render(JobDetailsComponent());

    expect(screen.getByText('Job Type')).toBeInTheDocument();
    expect(screen.getByText('Job Description')).toBeInTheDocument();
    expect(screen.getByText('Priority')).toBeInTheDocument();
  });

  it('should show loader when data for details page is fetching', () => {
    (useFetchDropdownOptions as jest.Mock).mockImplementation(() => {
      return {
        dropdownOptions: [],
        loading: true,
        error: undefined,
      };
    });

    render(JobDetailsComponent());

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

    render(JobDetailsComponent());

    expect(screen.getByText('Error Occurs'));
  });

  it('should trigger clearErrors on input change', async () => {
    const mockOnClearErrors = jest.fn();
    const mockDescriptionFieldValue = 'Mock description text';

    jest.spyOn(form, 'useFormContext').mockReturnValue({
      formState: {
        ...mockFormState.formState,
      },
      clearErrors: mockOnClearErrors,
      register: jest.fn().mockReturnValue({ onChange: mockOnClearErrors }),
    } as unknown as UseFormReturn);

    render(JobDetailsComponent());

    const currentPasswordInput = screen.getByPlaceholderText(/Please provide a job description/i) as HTMLInputElement;

    await userEvent.type(currentPasswordInput, mockDescriptionFieldValue);

    expect(currentPasswordInput.value).toBe(mockDescriptionFieldValue);
    expect(mockOnClearErrors).toHaveBeenCalled();
  });
});
