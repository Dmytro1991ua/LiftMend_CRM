import { RenderHookResult, act, renderHook } from '@testing-library/react-hooks';

import { mockRepairJob } from '@/mocks/repairJobScheduling';
import { mockReassignTechnician } from '@/mocks/repairJobTrackingMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import { useReassignTechnician } from '@/shared/repair-job/hooks/useReassignTechnician';
import {
  UseUseReassignTechnicianFormHandler,
  useReassignTechnicianFormHandler,
} from '@/shared/repair-job/hooks/useReassignTechnicianFormHandler';

jest.mock('@/shared/repair-job/hooks/useReassignTechnician', () => ({
  ...jest.requireActual('@/shared/repair-job/hooks/useReassignTechnician'),
  useReassignTechnician: jest.fn(),
}));

describe('useReassignTechnicianFormHandler', () => {
  const mockOnReset = jest.fn();
  const mockOnReassignTechnician = jest.fn();
  const mockUpdatedTechnicianName = 'Mike Smith';
  const mockCurrentRepairJob = { ...mockRepairJob, status: 'In Progress' };
  const mockFormFields = {
    ...mockCurrentRepairJob,
    selectedTechnician: {
      id: 'test-technician-id-1',
      label: mockUpdatedTechnicianName,
      value: 'test-technician-id-1',
    },
    technicianName: mockUpdatedTechnicianName,
    status: 'In Progress',
  };

  beforeEach(() => {
    (useReassignTechnician as jest.Mock).mockReturnValue({
      onReassignTechnician: mockOnReassignTechnician,
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    repairJob: mockCurrentRepairJob,
    onReset: mockOnReset,
  };

  const hook = (): RenderHookResult<unknown, UseUseReassignTechnicianFormHandler> => {
    return renderHook(() => useReassignTechnicianFormHandler(defaultProps), {
      wrapper: ({ children }) => <MockProviderHook mocks={[mockReassignTechnician]}>{children}</MockProviderHook>,
    });
  };

  it('should return correct initial data', () => {
    const { result } = hook();

    expect(result.current.isReassignTechnicianLoading).toBeFalsy();
  });

  it('should trigger onHandleTechnicianReassignment and reset form', async () => {
    const { result } = hook();

    await act(() => result.current.onHandleTechnicianReassignment(mockFormFields) as Promise<void>);

    expect(mockOnReset).toHaveBeenCalled();
    expect(mockOnReassignTechnician).toHaveBeenCalledWith(mockFormFields, mockCurrentRepairJob);
  });
});
