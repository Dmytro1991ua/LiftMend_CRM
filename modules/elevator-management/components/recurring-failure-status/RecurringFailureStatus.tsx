import SeverityStatusBadge from '@/shared/severity-status-badge';
import { ElevatorRecurringFailureStatus } from '@/shared/types';

import { ELEVATOR_RECURRING_FAILURE_SEVERITY_CONFIG } from './config';

export type RecurringFailureStatusProps = {
  recurringFailureStatus?: ElevatorRecurringFailureStatus | null;
};

const DEFAULT_RECURRING_FAILURE_STATUS = 'N/A';

const RecurringFailureStatus = ({ recurringFailureStatus }: RecurringFailureStatusProps) => {
  if (!recurringFailureStatus) return <span className='block text-center'>{DEFAULT_RECURRING_FAILURE_STATUS}</span>;

  return (
    <SeverityStatusBadge
      config={ELEVATOR_RECURRING_FAILURE_SEVERITY_CONFIG}
      severityStatusItem={recurringFailureStatus}
    />
  );
};

export default RecurringFailureStatus;
