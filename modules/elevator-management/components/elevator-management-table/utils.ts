import { ElevatorRecord } from '@/shared/types';

export const isElevatorRecordRowDisabled = (rowOriginal: ElevatorRecord) => rowOriginal.status === 'Out of Service';
