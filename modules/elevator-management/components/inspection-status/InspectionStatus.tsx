import { cn } from '@/lib/utils';
import InfoTooltip from '@/shared/base-tooltip/info-tooltip/InfoTooltip';
import { ElevatorInspectionStatus } from '@/shared/types';

import { ELEVATOR_INSPECTION_STATUS_CONFIG } from './config';

export type InspectionStatusProps = {
  inspectionStatus?: ElevatorInspectionStatus | null;
};

const InspectionStatus = ({ inspectionStatus }: InspectionStatusProps) => {
  const elevatorInspectionStatusConfig = inspectionStatus?.severity
    ? ELEVATOR_INSPECTION_STATUS_CONFIG[inspectionStatus?.severity]
    : null;

  return (
    <section className={'relative flex items-center gap-2 p-1 rounded'}>
      <div>{elevatorInspectionStatusConfig?.icon}</div>
      <h3 className={cn(elevatorInspectionStatusConfig?.textColor, 'font-medium')}> {inspectionStatus?.label}</h3>
      <InfoTooltip
        className='w-[33rem] !shadow-none'
        iconClassName='relative -top-2'
        iconColor='#2563eb'
        iconSize='14'
        id='elevator-inspection-status-id'
        message={elevatorInspectionStatusConfig?.tooltipMessage ?? ''}
        place='bottom'
      />
    </section>
  );
};

export default InspectionStatus;
