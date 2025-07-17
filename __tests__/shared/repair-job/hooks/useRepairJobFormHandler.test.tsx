import { RenderHookResult, act, renderHook } from '@testing-library/react-hooks';

import { mockRepairJob, mockUpdateRepairJob } from '@/mocks/repairJobTrackingMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import { UseRepairJobFormHandler, useRepairJobFormHandler, useUpdateRepairJob } from '@/shared/repair-job/hooks';
import { convertFormFieldsToRepairJob } from '@/shared/repair-job/repair-job-details/utils';
import { getFieldsToUpdateForMutation } from '@/shared/utils';

jest.mock('@/shared/repair-job/hooks', () => ({
  ...jest.requireActual('@/shared/repair-job/hooks'),
  useUpdateRepairJob: jest.fn(),
}));

jest.mock('@/shared/utils', () => ({
  ...jest.requireActual('@/shared/utils'),
  getFieldsToUpdateForMutation: jest.fn(),
}));

jest.mock('@/shared/repair-job/repair-job-details/utils', () => ({
  ...jest.requireActual('@/shared/repair-job/repair-job-details/utils'),
  convertFormFieldsToRepairJob: jest.fn(),
}));

describe('useRepairJobFormHandler', () => {
  const mockOnReset = jest.fn();
  const mockOnUpdateRepairJob = jest.fn();
  const mockFormFields = {
    ...mockRepairJob,
    jobDetails: 'Test description',
  };

  beforeEach(() => {
    (useUpdateRepairJob as jest.Mock).mockReturnValue({
      onUpdateRepairJob: mockOnUpdateRepairJob,
      isLoading: false,
    });

    (convertFormFieldsToRepairJob as jest.Mock).mockReturnValue({
      ...mockRepairJob,
      jobDetails: 'Test description',
    });

    (getFieldsToUpdateForMutation as jest.Mock).mockReturnValue({
      jobDetails: 'Test description',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    repairJob: mockRepairJob,
    onReset: mockOnReset,
  };

  const hook = (): RenderHookResult<unknown, UseRepairJobFormHandler> => {
    return renderHook(() => useRepairJobFormHandler(defaultProps), {
      wrapper: ({ children }) => <MockProviderHook mocks={[mockUpdateRepairJob]}>{children}</MockProviderHook>,
    });
  };

  it('should return correct initial data', () => {
    const { result } = hook();

    expect(result.current.isEditRepairJobLoading).toBeFalsy();
  });

  it('should trigger onEditRepairJob and reset form', async () => {
    const { result } = hook();

    await act(() => result.current.onEditRepairJob(mockFormFields) as Promise<void>);

    expect(getFieldsToUpdateForMutation).toHaveBeenCalledWith(mockFormFields, mockRepairJob);
    expect(mockOnReset).toHaveBeenCalled();
  });
});
