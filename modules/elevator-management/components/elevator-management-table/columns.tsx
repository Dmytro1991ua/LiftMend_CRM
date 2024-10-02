import { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '@/components/ui/checkbox';
import BaseTableCheckbox from '@/shared/base-table/base-table-checkbox';
import DatePicker from '@/shared/date-picker';
import { ElevatorRecord } from '@/shared/types';

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
    accessorKey: 'elevatorLocation',
    header: 'Elevator Location',
    enableResizing: true,
    size: 180,
    minSize: 120,
    maxSize: 350,
  },
  {
    accessorKey: 'buildingName',
    header: 'Building Name',
    enableResizing: true,
    enableSorting: true,
    size: 180,
    maxSize: 350,
  },
  {
    accessorKey: 'status',
    header: 'Status',
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
    accessorKey: 'technicianName',
    header: 'Technician Name',
    enableResizing: true,
    enableSorting: true,
    size: 180,
    minSize: 120,
    maxSize: 350,
  },
  {
    accessorKey: 'contactInformation',
    header: 'Contact Information',
    enableResizing: true,
    enableSorting: false,
    size: 180,
    minSize: 120,
    maxSize: 300,
  },
];
