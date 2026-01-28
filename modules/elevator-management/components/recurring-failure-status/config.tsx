import { FaExclamationTriangle } from 'react-icons/fa';

import { ElevatorSeverityLevel } from '@/graphql/types/client/generated_types';
import { SeverityStatusBadgeConfig } from '@/shared/severity-status-badge/types';

export const ELEVATOR_RECURRING_FAILURE_SEVERITY_CONFIG: Partial<SeverityStatusBadgeConfig> = {
  [ElevatorSeverityLevel.Warning]: {
    icon: <FaExclamationTriangle className='w-4 h-4' color='orange' data-testid='warning-severity' />,
    textColor: 'text-orange-600',
  },
};
