import SeverityStatusBadge from '@/shared/severity-status-badge';
import { ElevatorInspectionStatus } from '@/shared/types';

import { ELEVATOR_INSPECTION_STATUS_CONFIG } from './config';

export type InspectionStatusProps = {
  inspectionStatus?: ElevatorInspectionStatus | null;
};

const InspectionStatus = ({ inspectionStatus }: InspectionStatusProps) => {
  return <SeverityStatusBadge config={ELEVATOR_INSPECTION_STATUS_CONFIG} severityStatusItem={inspectionStatus} />;
};

export default InspectionStatus;
