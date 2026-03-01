import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { withApolloAndFormProvider } from '@/mocks/testMocks';
import EmploymentStatusToggleCell, {
  EmploymentStatusToggleCellProps,
} from '@/modules/technician-management/components/employment-status-toggle-cell/EmploymentStatusToggleCell';
import {
  DEFAULT_ACTIVATION_MODAL_MESSAGE,
  DEFAULT_ACTIVATION_MODAL_TITLE,
  DEFAULT_DEACTIVATION_MODAL_MESSAGE,
  DEFAULT_DEACTIVATION_MODAL_TITLE,
} from '@/modules/technician-management/components/technician-management-table/constants';

describe('EmploymentStatusToggleCell', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps: EmploymentStatusToggleCellProps = {
    employmentStatus: 'Active',
    lastKnownAvailabilityStatus: null,
    technicianId: 'test-technician-id-1',
    availabilityStatus: 'Available',
  };

  const EmploymentStatusToggleCellComponent = (props?: Partial<EmploymentStatusToggleCellProps>) =>
    withApolloAndFormProvider(<EmploymentStatusToggleCell {...defaultProps} {...props} />);

  it('should render active technician icon and open modal with specific message when employment status is Active', async () => {
    render(EmploymentStatusToggleCellComponent());

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTestId('active-technician-icon')).toBeInTheDocument();

    const activeTechnicianIcon = screen.getByTestId('active-technician-icon');

    await userEvent.click(activeTechnicianIcon);

    expect(screen.getByText(DEFAULT_DEACTIVATION_MODAL_TITLE)).toBeInTheDocument();
    expect(screen.getByText(DEFAULT_DEACTIVATION_MODAL_MESSAGE)).toBeInTheDocument();
  });

  it('should render inactive technician icon, show tooltip on hover and open modal with specific warning message when employment status is Inactive', async () => {
    render(
      EmploymentStatusToggleCellComponent({
        employmentStatus: 'Inactive',
      })
    );

    const inactiveTechnicianIcon = screen.getByTestId('inactive-technician-icon');

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(inactiveTechnicianIcon).toBeInTheDocument();

    await userEvent.hover(inactiveTechnicianIcon);

    await waitFor(() => {
      expect(
        screen.getByText((text) => text.includes('Click on the icon to reactivate technician visibility'))
      ).toBeInTheDocument();
    });

    await userEvent.click(inactiveTechnicianIcon);

    expect(screen.getByText(DEFAULT_ACTIVATION_MODAL_TITLE)).toBeInTheDocument();
    expect(screen.getByText(DEFAULT_ACTIVATION_MODAL_MESSAGE)).toBeInTheDocument();
  });

  it('should render deactivation reason dropdown when technician is active', async () => {
    render(EmploymentStatusToggleCellComponent());

    await userEvent.click(screen.getByTestId('status-toggle-btn'));

    expect(screen.getByText('Reason for Deactivation')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should NOT render deactivation reason dropdown when technician is inactive', async () => {
    render(
      EmploymentStatusToggleCellComponent({
        employmentStatus: 'Inactive',
      })
    );

    await userEvent.click(screen.getByTestId('status-toggle-btn'));

    expect(screen.queryByText('Reason for Deactivation (optional)')).not.toBeInTheDocument();
    expect(screen.queryByText('Select Technician Deactivation Reason')).not.toBeInTheDocument();
  });

  it('should allow selecting a deactivation reason', async () => {
    render(EmploymentStatusToggleCellComponent());

    await userEvent.click(screen.getByTestId('status-toggle-btn'));

    const combobox = screen.getByRole('combobox');

    await userEvent.click(combobox);

    const option = await screen.findByRole('option', { name: 'Contract or Engagement Completed' });

    await userEvent.click(option);

    const selectedValue = await screen.findByText('Contract or Engagement Completed', {
      selector: 'div[aria-disabled="true"], div.css-1gx2hr5-singleValue',
    });

    expect(selectedValue).toBeInTheDocument();
  });

  it('should display label next to button when variant is "button"', () => {
    render(EmploymentStatusToggleCellComponent({ variant: 'button' }));

    const button = screen.getByTestId('status-toggle-btn');

    expect(button).toBeInTheDocument();

    const labelSpan = screen.getByText('Deactivate', { selector: 'span' });

    expect(labelSpan).toBeInTheDocument();
  });

  it('should NOT display label span when variant is "icon"', () => {
    render(EmploymentStatusToggleCellComponent({ variant: 'icon' }));

    expect(screen.queryByText('Contract or Engagement Completed', { selector: 'span' })).not.toBeInTheDocument();
  });
});
