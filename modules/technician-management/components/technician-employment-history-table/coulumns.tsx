import { ColumnDef } from '@tanstack/react-table';

import DatePicker from '@/shared/date-picker/DatePicker';
import { PillStatus } from '@/shared/pill/config';
import { TechnicianEmploymentHistory } from '@/shared/types';

import StatusChangePill from './status-change-pill';

export const TECHNICIAN_EMPLOYMENT_HISTORY_COLUMNS: ColumnDef<TechnicianEmploymentHistory>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Date',
    enableResizing: true,
    cell: ({
      row: {
        original: { createdAt },
      },
    }) => (
      <DatePicker key={`${createdAt}`} isDisabled isDateRangeMode={false} numberOfMonths={1} singleDate={createdAt} />
    ),
    enableSorting: false,
    size: 220,
    minSize: 220,
    maxSize: 250,
  },
  {
    accessorKey: 'availabilityStatus',
    header: 'Availability Status',
    enableResizing: true,
    cell: ({
      row: {
        original: { previousAvailabilityStatus, newAvailabilityStatus },
      },
    }) => (
      <StatusChangePill
        currentStatus={newAvailabilityStatus as PillStatus}
        previousStatus={previousAvailabilityStatus as PillStatus}
      />
    ),
    enableSorting: false,
    size: 220,
    minSize: 220,
    maxSize: 250,
  },
  {
    accessorKey: 'employmentStatus',
    header: 'Employment Status',
    enableResizing: true,
    cell: ({
      row: {
        original: { previousEmploymentStatus, newEmploymentStatus },
      },
    }) => (
      <StatusChangePill
        currentStatus={newEmploymentStatus as PillStatus}
        previousStatus={previousEmploymentStatus as PillStatus}
      />
    ),
    enableSorting: false,
    size: 220,
    minSize: 220,
    maxSize: 250,
  },
  {
    accessorKey: 'reason',
    header: 'Reason',
    enableResizing: true,
    enableSorting: false,
    size: 180,
    minSize: 120,
    maxSize: 250,
    cell: ({ getValue }) => getValue() ?? 'N/A',
  },
];
