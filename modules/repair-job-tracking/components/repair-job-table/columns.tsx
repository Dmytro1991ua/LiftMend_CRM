import { ColumnDef } from '@tanstack/react-table';

import { Maybe } from '@/graphql/types/client/generated_types';
import DatePicker from '@/shared/date-picker';
import RepairJobPriority from '@/shared/repair-job/repair-job-priority';
import { Priority } from '@/shared/repair-job/repair-job-priority/config';
import RepairJobStatus from '@/shared/repair-job/repair-job-status';
import { Status } from '@/shared/repair-job/repair-job-status/config';
import TechnicianSkills from '@/shared/repair-job/technician-skills';

import DeleteActionCell from '../delete-action-cell';
import EditActionCell from '../edit-action-cell/EditActionCell';

export type RepairJob = {
  id: string;
  jobType: string;
  jobDetails: string;
  jobPriority: string;
  startDate: Date;
  endDate: Date;
  elevatorType: string;
  buildingName: string;
  elevatorLocation: string;
  technicianName: string;
  technicianSkills: string[];
  contactInformation: string;
  calendarEventId: Maybe<string>;
  status: string;
};
export const REPAIR_JOB_COLUMNS: ColumnDef<RepairJob>[] = [
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
    }) => <RepairJobPriority priority={jobPriority as Priority} />,
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
    }) => <RepairJobStatus status={status as Status} />,
    enableResizing: true,
    enableSorting: true,
    size: 180,
    minSize: 120,
    maxSize: 350,
  },
  {
    accessorKey: 'startDate',
    header: () => <div className='text-center'>Start Date</div>,
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
    header: () => <div className='text-center'>End Date</div>,
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
    header: () => <div className='text-center'>Technician Skills</div>,
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
    accessorKey: 'editAction',
    header: () => <div className='text-center'>Edit</div>,
    cell: ({ row: { original } }) => <EditActionCell repairJob={original} />,
    enableSorting: false,
    size: 40,
    size: 80,
    enableResizing: false,
    minSize: 80,
    maxSize: 100,
  },
  {
    accessorKey: 'deleteAction',
    header: () => <div className='text-center'>Delete</div>,
    cell: ({ row: { original } }) => <DeleteActionCell repairJob={original} />,
    size: 80,
    enableResizing: false,
    minSize: 80,
    maxSize: 100,
    enableSorting: false,
  },
];
