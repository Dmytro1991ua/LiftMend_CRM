import { ChangeLog } from '@/shared/types';

export type ChangeLogState = {
  changeLogs: ChangeLog[];
  isInitialLoading: boolean;
  isChangeLogEmpty: boolean;
  hasMore: boolean;
  error?: string;
  totalChangeLogsLength: number;
  onNext: () => Promise<void>;
};
