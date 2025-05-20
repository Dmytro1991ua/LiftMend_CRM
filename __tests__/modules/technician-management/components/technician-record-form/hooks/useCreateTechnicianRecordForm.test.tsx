import { act, renderHook } from '@testing-library/react-hooks';
import * as form from 'react-hook-form';

import { mockFormState } from '@/mocks/formStateMock';
import { MockProviderHook } from '@/mocks/testMocks';
import { useCreateTechnicianRecordForm } from '@/modules/technician-management/components/technician-record-form/hooks';
import { useCreateTechnicianRecord } from '@/modules/technician-management/hooks';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';

jest.mock('@/shared/hooks/useMutationResultToasts', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    onSuccess: jest.fn(),
    onError: jest.fn(),
  })),
}));

jest.mock('@/modules/technician-management/hooks');

describe('useCreateTechnicianRecordForm', () => {
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();
  const mockHandleSubmit = jest.fn();
  const mockFormTrigger = jest.fn();
  const mockOnCreateTechnicianRecord = jest.fn();
  const mockOnReset = jest.fn();
  const mockFormValues = {
    basicInformation: {
      fullName: 'Mark Smith J.',
      contactInformation: 'test@gmail.com',
      availabilityStatus: 'Available' as const,
      employmentStatus: 'Active' as const,
    },
    skillsAndCertifications: {
      skills: ['Blueprint Reading'],
      certifications: ['Certified Elevator Technician'],
    },
  };

  const defaultProps = {
    onReset: mockOnReset,
  };

  beforeEach(() => {
    (useMutationResultToasts as jest.Mock).mockReturnValue({ onSuccess: mockOnSuccess, onError: mockOnError });

    (useCreateTechnicianRecord as jest.Mock).mockReturnValue({
      onCreateTechnicianRecord: mockOnCreateTechnicianRecord,
      isLoading: false,
    });

    jest.spyOn(form, 'useFormContext').mockReturnValue({
      formState: {
        ...mockFormState.formState,
      },
      handleSubmit: mockHandleSubmit,
      trigger: mockFormTrigger,
    } as unknown as form.UseFormReturn);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = () =>
    renderHook(() => useCreateTechnicianRecordForm({ ...defaultProps }), {
      wrapper: ({ children }) => <MockProviderHook mocks={[]}>{children}</MockProviderHook>,
    });

  it('should trigger onHandleNext and validate stepper step', async () => {
    const { result } = hook();

    await act(async () => {
      await result.current.onHandleNext(0);
    });

    expect(mockFormTrigger).toHaveBeenCalledWith('basicInformation');

    await act(async () => {
      await result.current.onHandleNext(1);
    });

    expect(mockFormTrigger).toHaveBeenCalledWith('basicInformation');
    expect(mockFormTrigger).toHaveBeenCalledWith('skillsAndCertifications');
  });

  it('should trigger onSubmit and reset form', async () => {
    const { result } = hook();

    await act(async () => {
      await result.current.onSubmit(mockFormValues);
    });

    expect(mockOnCreateTechnicianRecord).toHaveBeenCalled();
    expect(mockOnReset).toHaveBeenCalled();
  });
});
