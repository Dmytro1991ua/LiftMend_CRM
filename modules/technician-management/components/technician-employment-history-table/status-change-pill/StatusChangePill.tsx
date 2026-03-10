import Pill from '@/shared/pill';
import { PillStatus } from '@/shared/pill/config';

export type StatusChangePillProps = {
  previousStatus: PillStatus;
  currentStatus: PillStatus;
};

const StatusChangePill = ({ previousStatus, currentStatus }: StatusChangePillProps) => {
  return (
    <div className='flex items-center gap-2'>
      <Pill status={previousStatus} />
      <span>→</span>
      <Pill status={currentStatus} />
    </div>
  );
};

export default StatusChangePill;
