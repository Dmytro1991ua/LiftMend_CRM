import { MockedResponse } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { mockElevatorRecord, mockUpdateElevatorRecord } from '@/mocks/elevatorManagementMocks';
import { withApolloProvider } from '@/mocks/testMocks';
import ElevatorStatusToggleCell, {
  ElevatorStatusToggleCellProps,
} from '@/modules/elevator-management/components/elevator-status-toggle-cell/ElevatorStatusToggleCell';
import * as useUpdateElevatorRecordStatus from '@/modules/elevator-management/components/elevator-status-toggle-cell/hooks/useUpdateElevatorRecordStatus';

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
    elevatorRecord: mockElevatorRecord,
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
    render(ElevatorStatusToggleCellComponent({ elevatorRecord: { ...mockElevatorRecord, status: 'Out of Service' } }));

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

    const select = screen.getByRole('combobox');

    await userEvent.click(select);

    const option = await screen.findByText('Technical Issue');

    await userEvent.click(option);

    const modalYesBtn = screen.getByText('Yes');

    await userEvent.click(modalYesBtn);

    await waitFor(() => {
      expect(screen.queryByText('Yes')).not.toBeInTheDocument();
    });

    rerender(
      ElevatorStatusToggleCellComponent(
        {
          elevatorRecord: {
            ...mockElevatorRecord,
            status: 'Out of Service',
          },
        },
        [mockUpdateElevatorRecord]
      )
    );

    expect(screen.getByTestId('elevator-status-icon-hidden')).toBeInTheDocument();
  });

  it('should render deactivation reason dropdown when elevator is operational', async () => {
    render(ElevatorStatusToggleCellComponent());

    await userEvent.click(screen.getByTestId('status-toggle-btn'));

    expect(screen.getByText('Reason for Deactivation')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should NOT render deactivation reason dropdown when elevator is already out of service', async () => {
    render(
      ElevatorStatusToggleCellComponent({
        elevatorRecord: {
          ...mockElevatorRecord,
          status: 'Out of Service',
        },
      })
    );

    await userEvent.click(screen.getByTestId('status-toggle-btn'));

    expect(screen.queryByText('Reason for Deactivation (optional)')).not.toBeInTheDocument();
    expect(screen.queryByText('Select Deactivation Reason')).not.toBeInTheDocument();
  });

  it('should allow selecting a deactivation reason', async () => {
    render(ElevatorStatusToggleCellComponent());

    await userEvent.click(screen.getByTestId('status-toggle-btn'));

    const combobox = screen.getByRole('combobox');

    await userEvent.click(combobox);

    const option = await screen.findByRole('option', { name: 'Technical Issue' });

    await userEvent.click(option);

    const selectedValue = await screen.findByText('Technical Issue', {
      selector: 'div[aria-disabled="true"], div.css-1gx2hr5-singleValue',
    });

    expect(selectedValue).toBeInTheDocument();
  });

  it('should display label next to button when variant is "button"', () => {
    render(ElevatorStatusToggleCellComponent({ variant: 'button' }));

    const button = screen.getByTestId('status-toggle-btn');

    expect(button).toBeInTheDocument();

    const labelSpan = screen.getByText('Deactivate', { selector: 'span' });

    expect(labelSpan).toBeInTheDocument();
  });

  it('should NOT display label span when variant is "icon"', () => {
    render(ElevatorStatusToggleCellComponent({ variant: 'icon' }));

    expect(screen.queryByText('Technical Issue', { selector: 'span' })).not.toBeInTheDocument();
  });
});
