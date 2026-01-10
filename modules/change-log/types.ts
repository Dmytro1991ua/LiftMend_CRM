import { Dispatch, SetStateAction } from 'react';

import { SortingState } from '@tanstack/react-table';
import { DateRange } from 'react-day-picker';

import { PageFilters } from '@/shared/base-table/types';
import { EntityStorageState } from '@/shared/storage/hooks/useStoredEntityState';
import { ChangeLog } from '@/shared/types';

import { DashboardDateFilter } from '../dashboard/types';

export type ChangeLogState = {
  changeLogs: ChangeLog[];
  isInitialLoading: boolean;
  isChangeLogEmpty: boolean;
  hasMore: boolean;
  error?: string;
  totalChangeLogsLength: number;
  changeLogPageStoredState: EntityStorageState<SortingState, PageFilters, undefined>;
  isCalendarOpen: boolean;
  sanitizedDateRange: DashboardDateFilter;
  onHandleCalendarPopoverClose: (open: boolean, range?: DateRange | undefined) => void;
  onSetChangeLogPageStoredState: Dispatch<SetStateAction<EntityStorageState<SortingState, PageFilters, undefined>>>;
  onNext: () => Promise<void>;
};
