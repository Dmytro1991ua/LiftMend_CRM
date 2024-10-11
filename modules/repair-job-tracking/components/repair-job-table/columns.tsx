import { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '@/components/ui/checkbox';
import BaseTableCheckbox from '@/shared/base-table/base-table-checkbox';
import DatePicker from '@/shared/date-picker';
import Pill from '@/shared/pill';
import { PillStatus } from '@/shared/pill/config';
import TechnicianSkills from '@/shared/repair-job/technician-skills';
import { RepairJob } from '@/shared/types';

import DeleteActionCell from '../delete-action-cell';
import EditActionCell from '../edit-action-cell/EditActionCell';

export const REPAIR_JOB_COLUMNS: ColumnDef<RepairJob>[] = [
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
    accessorKey: 'jobType',
    header: 'Job Type',
    enableResizing: true,
    enableSorting: true,
    size: 180,
    minSize: 120,
    maxSize: 350,
  },
  {
    accessorKey: 'id',
    header: 'Job Id',
    enableResizing: true,
    enableSorting: false,
    size: 320,
    maxSize: 320,
  },
  {
    accessorKey: 'jobDetails',
    header: 'Job Details',
    enableResizing: true,
    enableSorting: false,
    size: 250,
    minSize: 120,
    maxSize: 350,
  },
  {
    accessorKey: 'jobPriority',
    header: 'Priority',
    cell: ({
      row: {
        original: { jobPriority },
      },
    }) => <Pill status={jobPriority as PillStatus} />,
    enableResizing: true,
    enableSorting: true,
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
    enableSorting: true,
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
      <DatePicker key={`${startDate}`} isDisabled isDateRangeMode={false} numberOfMonths={1} singleDate={startDate} />
    ),
    enableSorting: true,
    size: 300,
    minSize: 300,
    maxSize: 500,
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
    enableResizing: true,
    enableSorting: true,
    cell: ({
      row: {
        original: { endDate },
      },
    }) => <DatePicker key={`${endDate}`} isDisabled isDateRangeMode={false} numberOfMonths={1} singleDate={endDate} />,
    size: 300,
    minSize: 300,
    maxSize: 500,
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
    accessorKey: 'buildingName',
    header: 'Building Name',
    enableResizing: true,
    enableSorting: true,
    size: 180,
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
    accessorKey: 'technicianName',
    header: 'Technician Name',
    enableResizing: true,
    enableSorting: true,
    size: 180,
    minSize: 120,
    maxSize: 350,
  },
  {
    accessorKey: 'technicianSkills',
    header: 'Technician Skills',
    cell: ({
      row: {
        original: { technicianSkills },
      },
    }) => <TechnicianSkills className='flex flex-col text-center' skills={technicianSkills ?? []} />,
    size: 250,
    enableResizing: true,
    enableSorting: false,
    minSize: 120,
    maxSize: 400,
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
  {
    accessorKey: 'edit',
    header: 'Edit',
    cell: ({ row: { original } }) => <EditActionCell repairJob={original} />,
    enableSorting: false,
    size: 80,
    enableResizing: false,
    minSize: 80,
    maxSize: 100,
  },
  {
    accessorKey: 'delete',
    header: 'Delete',
    cell: ({ row: { original } }) => <DeleteActionCell repairJob={original} />,
    size: 80,
    enableResizing: false,
    minSize: 80,
    maxSize: 100,
    enableSorting: false,
  },
];
