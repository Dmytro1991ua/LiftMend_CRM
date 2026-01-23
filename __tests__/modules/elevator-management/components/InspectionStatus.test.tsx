import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ElevatorSeverityLevel } from '@/graphql/types/client/generated_types';
import { ElevatorInspectionStatusMessages } from '@/modules/elevator-management/components/inspection-status/config';
import InspectionStatus, {
  InspectionStatusProps,
} from '@/modules/elevator-management/components/inspection-status/InspectionStatus';

describe('InspectionStatus', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    inspectionStatus: { severity: ElevatorSeverityLevel.Error, label: 'Inspection overdue' },
  };

  const InspectionStatusComponent = (props?: Partial<InspectionStatusProps>) => (
    <InspectionStatus {...defaultProps} {...props} />
  );

  it('should display the correct label, icon, and tooltip for ERROR severity', async () => {
    render(InspectionStatusComponent());

    const tooltipTrigger = screen.getByTestId('info-icon');

    await userEvent.hover(tooltipTrigger);

    const tooltipText = await screen.findByText(ElevatorInspectionStatusMessages.ERROR);

    expect(tooltipText).toBeInTheDocument();
    expect(screen.getByText('Inspection overdue')).toBeInTheDocument();
    expect(screen.getByTestId('error-severity')).toBeInTheDocument();
  });

  it('should display the correct label, icon, and tooltip for WARNING severity', async () => {
    render(
      InspectionStatusComponent({
        inspectionStatus: { severity: ElevatorSeverityLevel.Warning, label: 'Inspection due soon' },
      })
    );

    const tooltipTrigger = screen.getByTestId('info-icon');

    await userEvent.hover(tooltipTrigger);

    const tooltipText = await screen.findByText(ElevatorInspectionStatusMessages.WARNING);

    expect(tooltipText).toBeInTheDocument();
    expect(screen.getByText('Inspection due soon')).toBeInTheDocument();
    expect(screen.getByTestId('warning-severity')).toBeInTheDocument();
  });

  it('should display the correct label, icon, and tooltip for INFO severity', async () => {
    render(
      InspectionStatusComponent({
        inspectionStatus: {
          severity: ElevatorSeverityLevel.Info,
          label: 'Inspection scheduled',
        },
      })
    );

    const tooltipTrigger = screen.getByTestId('info-icon');

    await userEvent.hover(tooltipTrigger);

    const tooltipText = await screen.findByText(ElevatorInspectionStatusMessages.INFO);

    expect(tooltipText).toBeInTheDocument();
    expect(screen.getByText('Inspection scheduled')).toBeInTheDocument();
    expect(screen.getByTestId('info-severity')).toBeInTheDocument();
  });

  it('should display the correct label, icon, and tooltip for SUCCESS severity', async () => {
    render(
      InspectionStatusComponent({
        inspectionStatus: {
          severity: ElevatorSeverityLevel.Success,
          label: 'Inspection up to date',
        },
      })
    );

    const tooltipTrigger = screen.getByTestId('info-icon');

    await userEvent.hover(tooltipTrigger);

    const tooltipText = await screen.findByText(ElevatorInspectionStatusMessages.SUCCESS);

    expect(tooltipText).toBeInTheDocument();
    expect(screen.getByText('Inspection up to date')).toBeInTheDocument();
    expect(screen.getByTestId('success-severity')).toBeInTheDocument();
  });
});
