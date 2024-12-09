import { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '@/components/ui/checkbox';
import BaseTableCheckbox from '@/shared/base-table/base-table-checkbox';
import DatePicker from '@/shared/date-picker';
import { PillStatus } from '@/shared/pill/config';
import { ElevatorRecord } from '@/shared/types';

import Pill from '../../../../shared/pill/Pill';
import DeleteActionCell from '../delete-action-cell';
import EditActionCell from '../edit-action-cell';

export const ELEVATOR_MANAGEMENT_COLUMNS: ColumnDef<ElevatorRecord>[] = [
  {
    id: 'select',
    header: ({ table }) => <BaseTableCheckbox table={table} />,
    cell: ({ row }) => (
      <Checkbox
        aria-label='Select row'
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableResizing: false,
    size: 60,
  },
  {
    accessorKey: 'elevatorType',
    header: 'Elevator Type',
    enableResizing: true,
    enableSorting: true,
    size: 180,
    minSize: 120,
    maxSize: 350,
  },
  {
    accessorKey: 'id',
    header: 'Record Id',
    enableResizing: false,
    enableSorting: false,
    size: 320,
    maxSize: 320,
  },
  {
    accessorKey: 'elevatorLocation',
    header: 'Elevator Location',
    enableResizing: true,
    enableSorting: true,
    size: 180,
    minSize: 120,
    maxSize: 350,
  },
  {
    accessorKey: 'capacity',
    header: 'Capacity',
    enableResizing: false,
    enableSorting: false,
    size: 100,
    minSize: 100,
    maxSize: 120,
  },
  {
    accessorKey: 'buildingName',
    header: 'Building Name',
    enableResizing: true,
    enableSorting: true,
    size: 220,
    maxSize: 180,
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
    enableSorting: true,
    size: 180,
    minSize: 120,
    maxSize: 350,
  },
  {
    accessorKey: 'lastMaintenanceDate',
    header: 'Last Maintenance Date',
    enableResizing: true,
    cell: ({
      row: {
        original: { lastMaintenanceDate },
      },
    }) => (
      <DatePicker
        key={`${lastMaintenanceDate}`}
        isDisabled
        isDateRangeMode={false}
        numberOfMonths={1}
        singleDate={lastMaintenanceDate}
      />
    ),
    enableSorting: true,
    size: 300,
    minSize: 300,
    maxSize: 500,
  },
  {
    accessorKey: 'nextMaintenanceDate',
    header: 'Next Maintenance Date',
    enableResizing: true,
    enableSorting: true,
    cell: ({
      row: {
        original: { nextMaintenanceDate },
      },
    }) => (
      <DatePicker
        key={`${nextMaintenanceDate}`}
        isDisabled
        isDateRangeMode={false}
        numberOfMonths={1}
        singleDate={nextMaintenanceDate}
      />
    ),
    size: 300,
    minSize: 300,
    maxSize: 500,
  },
  {
    accessorKey: 'edit',
    header: 'Edit',
    cell: ({ row: { original } }) => <EditActionCell elevatorRecord={original} />,
    enableSorting: false,
    size: 80,
    enableResizing: false,
    minSize: 80,
    maxSize: 100,
  },
  {
    accessorKey: 'delete',
    header: 'Delete',
    cell: ({ row: { original } }) => <DeleteActionCell elevatorRecord={original} />,
    size: 80,
    enableResizing: false,
    minSize: 80,
    maxSize: 100,
    enableSorting: false,
  },
];
