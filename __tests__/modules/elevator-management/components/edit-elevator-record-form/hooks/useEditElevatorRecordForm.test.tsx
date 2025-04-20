import { mockElevatorRecord } from '@/mocks/elevatorManagementMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import { UseEditElevatorRecordForm } from '@/modules/elevator-management/components/edit-elevator-record-form/hooks';
import useEditElevatorRecordForm from '@/modules/elevator-management/components/edit-elevator-record-form/hooks/useEditElevatorRecordForm';
import { useUpdateElevatorRecord } from '@/modules/elevator-management/hooks';

import { act, renderHook, RenderHookResult } from '@testing-library/react-hooks';

jest.mock('@/modules/elevator-management/hooks/', () => ({
  ...jest.requireActual('@/modules/elevator-management/hooks'),
  useUpdateElevatorRecord: jest.fn(),
}));

describe('useEditElevatorRecordForm', () => {
  const mockOnReset = jest.fn();
  const mockOnUpdateElevatorRecord = jest.fn();
  const mockFormValues = {
    ...mockElevatorRecord,
    nextMaintenanceDate: new Date('2024-09-10T16:00:00.000Z'),
  };

  beforeEach(() => {
    (useUpdateElevatorRecord as jest.Mock).mockReturnValue({
      onUpdateElevatorRecord: mockOnUpdateElevatorRecord,
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    elevatorRecord: mockElevatorRecord,
    onReset: mockOnReset,
  };

  const hook = (): RenderHookResult<unknown, UseEditElevatorRecordForm> => {
    return renderHook(() => useEditElevatorRecordForm(defaultProps), {
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
      () => result.current.onEditElevatorRecord({ ...mockFormValues, id: mockElevatorRecord.id }) as Promise<void>
    );

    expect(mockOnReset).toHaveBeenCalled();
    expect(mockOnUpdateElevatorRecord).toHaveBeenCalledWith(
      {
        ...mockFormValues,
        id: mockElevatorRecord.id,
      },
      mockElevatorRecord
    );
  });
});
