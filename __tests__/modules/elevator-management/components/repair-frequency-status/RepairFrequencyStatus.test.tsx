import { render, screen } from '@testing-library/react';

import { ElevatorSeverityLevel } from '@/graphql/types/client/generated_types';
import RepairFrequencyStatus from '@/modules/elevator-management/components/repair-frequency-status';
import { RepairFrequencyStatusProps } from '@/modules/elevator-management/components/repair-frequency-status/RepairFrequencyStatus';

describe('RepairFrequencyStatus', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    repairFrequencyStatus: {
      severity: ElevatorSeverityLevel.Warning,
      label: 'Occasional',
      description:
        'This elevator has been repaired 2 times in the last 30 days days — occasional failures observed, monitor closely.',
    },
  };

  const RepairFrequencyStatusComponent = (props?: Partial<RepairFrequencyStatusProps>) => (
    <RepairFrequencyStatus {...defaultProps} {...props} />
  );

  it('should render component without crashing', async () => {
    render(RepairFrequencyStatusComponent());

    expect(screen.getByText('Occasional')).toBeInTheDocument();
    expect(screen.getByTestId('warning-severity')).toBeInTheDocument();
    expect(screen.getByTestId('info-icon')).toBeInTheDocument();
  });
});
