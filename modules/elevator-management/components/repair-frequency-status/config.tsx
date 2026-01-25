import { FaCheckCircle, FaExclamationCircle, FaExclamationTriangle } from 'react-icons/fa';
import { GrInfo } from 'react-icons/gr';

import { ElevatorSeverityLevel } from '@/graphql/types/client/generated_types';
import { SeverityStatusBadgeConfig } from '@/shared/severity-status-badge/types';

export const ELEVATOR_REPAIR_FREQUENCY_SEVERITY_CONFIG: SeverityStatusBadgeConfig = {
  [ElevatorSeverityLevel.Success]: {
    icon: <FaCheckCircle className='w-4 h-4' color='green' data-testid='success-severity' />,
    textColor: 'text-green-600',
  },
  [ElevatorSeverityLevel.Info]: {
    icon: <GrInfo className='w-4 h-4' color='dodgerblue' data-testid='info-severity' />,
    textColor: 'text-blue-600',
  },
  [ElevatorSeverityLevel.Warning]: {
    icon: <FaExclamationTriangle className='w-4 h-4' color='orange' data-testid='warning-severity' />,
    textColor: 'text-orange-600',
  },
  [ElevatorSeverityLevel.Error]: {
    icon: <FaExclamationCircle className='w-4 h-4' color='red' data-testid='error-severity' />,
    textColor: 'text-red-600',
  },
};
