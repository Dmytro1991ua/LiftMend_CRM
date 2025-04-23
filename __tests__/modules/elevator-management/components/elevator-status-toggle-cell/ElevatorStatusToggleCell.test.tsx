import { MockedResponse } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { mockUpdateElevatorRecord } from '@/mocks/elevatorManagementMocks';
import { withApolloProvider } from '@/mocks/testMocks';
import ElevatorStatusToggleCell, {
  ElevatorStatusToggleCellProps,
} from '@/modules/elevator-management/components/elevator-status-toggle-cell/ElevatorStatusToggleCell';
import * as useUpdateElevatorRecordStatus from '@/modules/elevator-management/components/elevator-status-toggle-cell/hooks/useUpdateElevatorRecordStatus';
import { ElevatorStatus } from '@/modules/elevator-management/types';

describe('ElevatorStatusToggleCell', () => {
  const useUpdateElevatorRecordStatusModule = { ...useUpdateElevatorRecordStatus };

  const originalDefaultExport = useUpdateElevatorRecordStatus.default;

  beforeEach(() => {
    jest
      .spyOn(useUpdateElevatorRecordStatusModule, 'default')
      .mockImplementation(({ elevatorRecordId, lastKnownStatus, status }) => {
        return {
          ...originalDefaultExport({ elevatorRecordId, lastKnownStatus, status }),
        };
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    status: 'Operational' as ElevatorStatus,
    lastKnownStatus: null,
    elevatorRecordId: 'test-id-1',
  };

  const ElevatorStatusToggleCellComponent = (
    props?: Partial<ElevatorStatusToggleCellProps>,
    mocks: MockedResponse[] = []
  ) => withApolloProvider(<ElevatorStatusToggleCell {...defaultProps} {...props} />, mocks);

  it('should render component without crashing', () => {
    render(ElevatorStatusToggleCellComponent());

    expect(screen.getByTestId('status-toggle-btn')).toBeInTheDocument();
    expect(screen.getByTestId('elevator-status-icon-visible')).toBeInTheDocument();
  });

  it('should render Out of Service icon', () => {
    render(ElevatorStatusToggleCellComponent({ status: 'Out of Service' as ElevatorStatus }));

    expect(screen.getByTestId('elevator-status-icon-hidden')).toBeInTheDocument();
  });

  it('should open modal when button is clicked', async () => {
    render(ElevatorStatusToggleCellComponent());

    const button = screen.getByTestId('status-toggle-btn');

    await userEvent.click(button);

    expect(screen.getByText('Confirm Deactivation of Elevator Record')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Deactivating this elevator record will mark it as out of service, making it unavailable for use. Are you sure you want to proceed?'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('should close modal when No button is clicked', async () => {
    render(ElevatorStatusToggleCellComponent());

    const button = screen.getByTestId('status-toggle-btn');

    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('No')).toBeInTheDocument();
    });

    const modalNoBtn = screen.getByText('No');

    await userEvent.click(modalNoBtn);

    expect(screen.queryByText('No')).not.toBeInTheDocument();
  });

  it('should call status change handler on Yes button click and change icon accordingly', async () => {
    const mockOnHandleElevatorRecordStatusChange = jest.fn();

    jest
      .spyOn(useUpdateElevatorRecordStatusModule, 'default')
      .mockImplementation(({ elevatorRecordId, lastKnownStatus, status }) => {
        return {
          ...originalDefaultExport({ elevatorRecordId, lastKnownStatus, status }),
          onHandleElevatorRecordStatusChange: mockOnHandleElevatorRecordStatusChange,
        };
      });

    const { rerender } = render(ElevatorStatusToggleCellComponent({}, [mockUpdateElevatorRecord]));

    const button = screen.getByTestId('status-toggle-btn');

    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Yes')).toBeInTheDocument();
    });

    const modalYesBtn = screen.getByText('Yes');

    await userEvent.click(modalYesBtn);

    await waitFor(() => {
      expect(screen.queryByText('Yes')).not.toBeInTheDocument();
    });

    rerender(
      ElevatorStatusToggleCellComponent(
        {
          status: 'Out of Service',
        },
        [mockUpdateElevatorRecord]
      )
    );

    expect(screen.getByTestId('elevator-status-icon-hidden')).toBeInTheDocument();
  });
});
