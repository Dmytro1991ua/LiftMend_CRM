import { ColumnDef } from '@tanstack/react-table';

import DatePicker from '@/shared/date-picker';
import { ElevatorDowntime } from '@/shared/types';

import { formatElevatorDowntimeDuration } from './utils';

export const ElEVATOR_DOWNTIME_HISTORY_COLUMNS: ColumnDef<ElevatorDowntime>[] = [
  {
    accessorKey: 'startedAt',
    header: 'Start Date',
    enableResizing: true,
    cell: ({
      row: {
        original: { startedAt },
      },
    }) => (
      <DatePicker key={`${startedAt}`} isDisabled isDateRangeMode={false} numberOfMonths={1} singleDate={startedAt} />
    ),
    enableSorting: false,
    size: 220,
    minSize: 220,
    maxSize: 250,
  },
  {
    accessorKey: 'duration',
    header: 'Duration',
    enableResizing: true,
    enableSorting: false,
    cell: ({
      row: {
        original: { startedAt, endedAt },
      },
    }) => formatElevatorDowntimeDuration(startedAt, endedAt),
    size: 170,
    minSize: 170,
    maxSize: 190,
  },
  {
    accessorKey: 'reason',
    header: 'Reason',
    enableResizing: true,
    enableSorting: false,
    size: 180,
    minSize: 120,
    maxSize: 250,
  },
];
