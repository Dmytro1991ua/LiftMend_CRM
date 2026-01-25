import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ElevatorSeverityLevel } from '@/graphql/types/client/generated_types';
import { ELEVATOR_INSPECTION_STATUS_CONFIG } from '@/modules/elevator-management/components/inspection-status/config';
import { ELEVATOR_REPAIR_FREQUENCY_SEVERITY_CONFIG } from '@/modules/elevator-management/components/repair-frequency-status/config';
import SeverityStatusBadge from '@/shared/severity-status-badge';
import { SeverityStatusBadgeProps } from '@/shared/severity-status-badge/SeverityStatusBadge';

describe('SeverityStatusBadge', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const SeverityStatusBadgeComponent = (props?: Partial<SeverityStatusBadgeProps>) => {
    const defaultProps: SeverityStatusBadgeProps = {
      config: ELEVATOR_INSPECTION_STATUS_CONFIG,
      severityStatusItem: null,
      ...props,
    };

    return <SeverityStatusBadge {...defaultProps} />;
  };

  describe('Elevator Inspection Status case', () => {
    const mockScenarios = [
      {
        name: 'ERROR severity config',
        severityStatusItem: {
          severity: ElevatorSeverityLevel.Error,
          label: 'Inspection overdue',
        },
        expectedTooltip: 'The next inspection date has already passed.',
        expectedIconTestId: 'error-severity',
      },
      {
        name: 'WARNING severity config',
        severityStatusItem: {
          severity: ElevatorSeverityLevel.Warning,
          label: 'Inspection due soon',
        },
        expectedTooltip: 'The next inspection is today or within the next 7 days.',
        expectedIconTestId: 'warning-severity',
      },
      {
        name: 'INFO severity config',
        severityStatusItem: {
          severity: ElevatorSeverityLevel.Info,
          label: 'Inspection scheduled',
        },
        expectedTooltip: 'The next inspection is scheduled within the next 30 days.',
        expectedIconTestId: 'info-severity',
      },
      {
        name: 'SUCCESS severity config',
        severityStatusItem: {
          severity: ElevatorSeverityLevel.Success,
          label: 'Inspection up to date',
        },
        expectedTooltip: 'The next inspection is more than 30 days away.',
        expectedIconTestId: 'success-severity',
      },
    ];

    mockScenarios.forEach(({ name, severityStatusItem, expectedTooltip, expectedIconTestId }) => {
      it(`should render ${name} correctly`, async () => {
        render(
          SeverityStatusBadgeComponent({
            severityStatusItem,
          })
        );

        expect(screen.getByText(severityStatusItem.label)).toBeInTheDocument();
        expect(screen.getByTestId(expectedIconTestId)).toBeInTheDocument();

        const tooltipTrigger = screen.getByTestId('info-icon');

        await userEvent.hover(tooltipTrigger);

        expect(await screen.findByText(expectedTooltip)).toBeInTheDocument();
      });
    });
  });

  describe('Elevator Repair Frequency Status case', () => {
    const mockScenarios = [
      {
        name: 'SUCCESS severity config',
        severityStatusItem: {
          severity: ElevatorSeverityLevel.Success,
          label: 'Stable',
          description: 'No significant repairs in the last 30 days — elevator is stable.',
        },
        expectedTooltip: 'No significant repairs in the last 30 days — elevator is stable.',
        expectedIconTestId: 'success-severity',
      },
      {
        name: 'INFO severity config',
        severityStatusItem: {
          severity: ElevatorSeverityLevel.Info,
          label: 'Minor',
          description: 'Repaired once in the last 30 days',
        },
        expectedTooltip: 'Repaired once in the last 30 days',
        expectedIconTestId: 'info-severity',
      },
      {
        name: 'WARNING severity config',
        severityStatusItem: {
          severity: ElevatorSeverityLevel.Warning,
          label: 'Occasional',
          description: 'Multiple repairs detected — monitor closely',
        },
        expectedTooltip: 'Multiple repairs detected — monitor closely',
        expectedIconTestId: 'warning-severity',
      },
      {
        name: 'ERROR severity config',
        severityStatusItem: {
          severity: ElevatorSeverityLevel.Error,
          label: 'Frequent',
          description: 'Repeated failures detected — immediate action required',
        },
        expectedTooltip: 'Repeated failures detected — immediate action required',
        expectedIconTestId: 'error-severity',
      },
    ];

    mockScenarios.forEach(({ name, severityStatusItem, expectedTooltip, expectedIconTestId }) => {
      it(`should render ${name} correctly`, async () => {
        render(
          SeverityStatusBadgeComponent({
            config: ELEVATOR_REPAIR_FREQUENCY_SEVERITY_CONFIG,
            severityStatusItem,
          })
        );

        expect(screen.getByText(severityStatusItem.label)).toBeInTheDocument();
        expect(screen.getByTestId(expectedIconTestId)).toBeInTheDocument();

        const tooltipTrigger = screen.getByTestId('info-icon');
        await userEvent.hover(tooltipTrigger);

        expect(await screen.findByText(expectedTooltip)).toBeInTheDocument();
      });
    });
  });
});
