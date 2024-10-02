import { fireEvent, render, screen } from '@testing-library/react';

import ElevatorManagement from '@/modules/elevator-management';
import { ADD_ELEVATOR_RECORD_BUTTON_LABEL } from '@/modules/elevator-management/constants';
import { SectionHeaderTitle } from '@/types/enums';

describe('ElevatorManagement', () => {
  it('should render component without crashing', () => {
    render(<ElevatorManagement />);

    expect(screen.getByText(SectionHeaderTitle.ElevatorManagement)).toBeInTheDocument();
    expect(screen.getByTestId('base-table')).toBeInTheDocument();
  });

  it('should open modal on button click', () => {
    render(<ElevatorManagement />);

    const modalButton = screen.getByText(ADD_ELEVATOR_RECORD_BUTTON_LABEL);

    fireEvent.click(modalButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Create Elevator Record')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('should close modal on button click', () => {
    render(<ElevatorManagement />);

    const modalButton = screen.getByText(ADD_ELEVATOR_RECORD_BUTTON_LABEL);

    fireEvent.click(modalButton);

    const cancelButton = screen.getByText('Cancel');

    fireEvent.click(cancelButton);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
