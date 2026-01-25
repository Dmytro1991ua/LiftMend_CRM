import SeverityStatusBadge from '@/shared/severity-status-badge';
import { ElevatorRepairFrequencyStatus } from '@/shared/types';

import { ELEVATOR_REPAIR_FREQUENCY_SEVERITY_CONFIG } from './config';

export type RepairFrequencyStatusProps = {
  repairFrequencyStatus?: ElevatorRepairFrequencyStatus | null;
};

const RepairFrequencyStatus = ({ repairFrequencyStatus }: RepairFrequencyStatusProps) => {
  return (
    <div className='flex justify-center items-center'>
      <SeverityStatusBadge
        config={ELEVATOR_REPAIR_FREQUENCY_SEVERITY_CONFIG}
        severityStatusItem={repairFrequencyStatus}
      />
    </div>
  );
};

export default RepairFrequencyStatus;
