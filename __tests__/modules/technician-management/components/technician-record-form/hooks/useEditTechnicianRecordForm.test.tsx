import { RenderHookResult, act, renderHook } from '@testing-library/react-hooks';

import { mockBenjaminHallRecord } from '@/mocks/technicianManagementMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import {
  UseEditTechnicianRecordForm,
  useEditTechnicianRecordForm,
} from '@/modules/technician-management/components/technician-record-form/hooks';
import { useUpdateTechnicianRecord } from '@/modules/technician-management/hooks';

jest.mock('@/modules/technician-management/hooks', () => ({
  ...jest.requireActual('@/modules/technician-management/hooks'),
  useUpdateTechnicianRecord: jest.fn(),
}));

describe('useEditTechnicianRecordForm', () => {
  const mockOnReset = jest.fn();
  const mockOnUpdateTechnicianRecord = jest.fn();
  const mockFormValues = {
    ...mockBenjaminHallRecord,
    contactInformation: 'benjamin2.hall@example.com',
  };

  beforeEach(() => {
    (useUpdateTechnicianRecord as jest.Mock).mockReturnValue({
      onUpdateTechnicianRecord: mockOnUpdateTechnicianRecord,
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    technicianRecord: mockBenjaminHallRecord,
    onReset: mockOnReset,
  };

  const hook = (): RenderHookResult<unknown, UseEditTechnicianRecordForm> => {
    return renderHook(() => useEditTechnicianRecordForm(defaultProps), {
      wrapper: ({ children }) => <MockProviderHook mocks={[]}>{children}</MockProviderHook>,
    });
  };

  it('should return correct initial data', () => {
    const { result } = hook();

    expect(result.current.isUpdateRecordLoading).toBeFalsy();
  });

  it('should trigger onEditElevatorRecord and reset form', async () => {
    const { result } = hook();

    await act(
      () => result.current.onEditTechnicianRecord({ ...mockFormValues, id: mockBenjaminHallRecord.id }) as Promise<void>
    );

    expect(mockOnReset).toHaveBeenCalled();
    expect(mockOnUpdateTechnicianRecord).toHaveBeenCalledWith(
      {
        ...mockFormValues,
        id: mockBenjaminHallRecord.id,
      },
      mockBenjaminHallRecord
    );
  });
});
