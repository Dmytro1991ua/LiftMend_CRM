import { render, screen } from '@testing-library/react';

import { ElevatorSeverityLevel } from '@/graphql/types/client/generated_types';
import RecurringFailureStatus from '@/modules/elevator-management/components/recurring-failure-status';
import { RecurringFailureStatusProps } from '@/modules/elevator-management/components/recurring-failure-status/RecurringFailureStatus';

describe('RecurringFailureStatus', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    recurringFailureStatus: {
      description:
        'The elevator had another repair on the same day as the previous repair, indicating a recurring issue.',
      label: 'Potential recurring issue',
      severity: ElevatorSeverityLevel.Warning,
    },
  };

  const RecurringFailureStatusComponent = (props?: Partial<RecurringFailureStatusProps>) => (
    <RecurringFailureStatus {...defaultProps} {...props} />
  );

  it('should render component without crashing', async () => {
    render(RecurringFailureStatusComponent());

    expect(screen.getByText('Potential recurring issue')).toBeInTheDocument();
    expect(screen.getByTestId('warning-severity')).toBeInTheDocument();
    expect(screen.getByTestId('info-icon')).toBeInTheDocument();
  });
  it('should display a default text when recurringFailureStatus is null', () => {
    render(RecurringFailureStatusComponent({ recurringFailureStatus: null }));

    expect(screen.getByText('N/A')).toBeInTheDocument();
  });
});
