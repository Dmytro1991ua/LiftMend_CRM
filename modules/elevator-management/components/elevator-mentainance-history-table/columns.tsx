import { ColumnDef } from '@tanstack/react-table';

import DatePicker from '@/shared/date-picker';
import Pill from '@/shared/pill';
import { PillStatus } from '@/shared/pill/config';
import { RepairJob } from '@/shared/types';

export const ElEVATOR_MENTAINANCE_HISTORY_COLUMNS: ColumnDef<RepairJob>[] = [
  {
    accessorKey: 'jobType',
    header: 'Job Type',
    enableResizing: true,
    enableSorting: false,
    size: 180,
    minSize: 120,
    maxSize: 350,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({
      row: {
        original: { status },
      },
    }) => <Pill status={status as PillStatus} />,
    enableResizing: true,
    enableSorting: false,
    size: 180,
    minSize: 120,
    maxSize: 350,
  },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
    enableResizing: true,
    cell: ({
      row: {
        original: { startDate },
      },
    }) => (
      <DatePicker
        key={`${startDate}`}
        isDisabled
        isDateRangeMode={false}
        numberOfMonths={1}
        singleDate={startDate as Date}
      />
    ),
    enableSorting: false,
    size: 300,
    minSize: 300,
    maxSize: 500,
  },
  {
    accessorKey: 'endDate',
    header: 'Planned End Date',
    enableResizing: true,
    enableSorting: false,
    cell: ({
      row: {
        original: { endDate },
      },
    }) => (
      <DatePicker
        key={`${endDate}`}
        isDisabled
        isDateRangeMode={false}
        numberOfMonths={1}
        singleDate={endDate as Date}
      />
    ),
    size: 300,
    minSize: 300,
    maxSize: 500,
  },
  {
    accessorKey: 'actualEndDate',
    header: 'Actual End Date',
    enableResizing: true,
    enableSorting: false,
    cell: ({
      row: {
        original: { actualEndDate },
      },
    }) => (
      <>
        {actualEndDate && (
          <DatePicker
            key={`${actualEndDate}`}
            isDisabled
            isDateRangeMode={false}
            numberOfMonths={1}
            singleDate={actualEndDate}
          />
        )}
      </>
    ),
    size: 300,
    minSize: 300,
    maxSize: 500,
  },
  {
    accessorKey: 'technicianName',
    header: 'Technician Name',
    enableResizing: true,
    enableSorting: false,
    size: 180,
    minSize: 120,
    maxSize: 350,
  },
];
