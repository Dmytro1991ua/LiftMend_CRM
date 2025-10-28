import { ColumnDef } from '@tanstack/react-table';

import Pill from '@/shared/pill';
import { PillStatus } from '@/shared/pill/config';
import { RepairJob } from '@/shared/types';

export const RECENT_REPAIR_JOB_COLUMNS: ColumnDef<RepairJob>[] = [
  {
    accessorKey: 'jobType',
    header: 'Job Type',
    enableResizing: false,
    enableSorting: false,
    size: 180,
    minSize: 120,
    maxSize: 350,
  },
  {
    accessorKey: 'id',
    header: 'Job Id',
    enableResizing: false,
    enableSorting: false,
    size: 320,
    maxSize: 320,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({
      row: {
        original: { status },
      },
    }) => <Pill status={status as PillStatus} />,
    enableResizing: false,
    enableSorting: false,
    size: 180,
    minSize: 120,
    maxSize: 350,
  },
  {
    accessorKey: 'elevatorType',
    header: 'Elevator Type',
    enableResizing: false,
    enableSorting: false,
    size: 180,
    minSize: 120,
    maxSize: 350,
  },
  {
    accessorKey: 'buildingName',
    header: 'Building Name',
    enableResizing: false,
    enableSorting: false,
    size: 180,
    maxSize: 350,
  },
  {
    accessorKey: 'elevatorLocation',
    header: 'Elevator Location',
    enableResizing: false,
    size: 180,
    minSize: 120,
    maxSize: 350,
  },
  {
    accessorKey: 'technicianName',
    header: 'Technician Name',
    enableResizing: false,
    enableSorting: false,
    size: 180,
    minSize: 120,
    maxSize: 350,
  },
];
