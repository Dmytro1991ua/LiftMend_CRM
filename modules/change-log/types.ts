import { Dispatch, SetStateAction } from 'react';

import { SortingState } from '@tanstack/react-table';

import { PageFilters } from '@/shared/base-table/types';
import { EntityStorageState } from '@/shared/storage/hooks/useStoredEntityState';
import { ChangeLog } from '@/shared/types';

export type ChangeLogState = {
  changeLogs: ChangeLog[];
  isInitialLoading: boolean;
  isChangeLogEmpty: boolean;
  hasMore: boolean;
  error?: string;
  totalChangeLogsLength: number;
  changeLogPageStoredState: EntityStorageState<SortingState, PageFilters, undefined>;
  onSetChangeLogPageStoredState: Dispatch<SetStateAction<EntityStorageState<SortingState, PageFilters, undefined>>>;
  onNext: () => Promise<void>;
};
