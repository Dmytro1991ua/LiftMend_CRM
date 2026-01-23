import { FaCheckCircle, FaExclamationCircle, FaExclamationTriangle } from 'react-icons/fa';
import { GrInfo } from 'react-icons/gr';

import { ElevatorSeverityLevel } from '@/graphql/types/client/generated_types';

export enum ElevatorInspectionStatusMessages {
  ERROR = 'The next inspection date has already passed.',
  WARNING = 'The next inspection is today or within the next 7 days.',
  INFO = 'The next inspection is scheduled within the next 30 days.',
  SUCCESS = 'The next inspection is more than 30 days away.',
}

export type ElevatorInspectionStatusConfig = {
  icon: JSX.Element;
  tooltipMessage: ElevatorInspectionStatusMessages;
  textColor: string;
};

const COMMON_ELEVATOR_INSPECTION_STATUS_ICON_STYLES = 'w-4 h-4';

export const ELEVATOR_INSPECTION_STATUS_CONFIG: Record<ElevatorSeverityLevel, ElevatorInspectionStatusConfig> = {
  [ElevatorSeverityLevel.Error]: {
    icon: (
      <FaExclamationCircle
        className={COMMON_ELEVATOR_INSPECTION_STATUS_ICON_STYLES}
        color='red'
        data-testid='error-severity'
      />
    ),
    tooltipMessage: ElevatorInspectionStatusMessages.ERROR,
    textColor: 'text-red-600',
  },
  [ElevatorSeverityLevel.Warning]: {
    icon: (
      <FaExclamationTriangle
        className={COMMON_ELEVATOR_INSPECTION_STATUS_ICON_STYLES}
        color='orange'
        data-testid='warning-severity'
      />
    ),
    tooltipMessage: ElevatorInspectionStatusMessages.WARNING,
    textColor: 'text-orange-600',
  },
  [ElevatorSeverityLevel.Info]: {
    icon: (
      <GrInfo
        className={COMMON_ELEVATOR_INSPECTION_STATUS_ICON_STYLES}
        color='dodgerblue'
        data-testid='info-severity'
      />
    ),
    tooltipMessage: ElevatorInspectionStatusMessages.INFO,
    textColor: 'text-blue-600',
  },
  [ElevatorSeverityLevel.Success]: {
    icon: (
      <FaCheckCircle
        className={COMMON_ELEVATOR_INSPECTION_STATUS_ICON_STYLES}
        color='green'
        data-testid='success-severity'
      />
    ),
    tooltipMessage: ElevatorInspectionStatusMessages.SUCCESS,
    textColor: 'text-green-600',
  },
};
