import { ColumnDef } from '@tanstack/react-table';

import RepairJobPriority from '@/shared/repair-job/repair-job-priority';
import { Priority } from '@/shared/repair-job/repair-job-priority/config';
import RepairJobStatus from '@/shared/repair-job/repair-job-status';
import { Status } from '@/shared/repair-job/repair-job-status/config';
import TechnicianSkills from '@/shared/repair-job/technician-skills';

import DateCell from '../date-cell';

export type RepairJob = {
  id: string;
  jobType: string | null;
  jobDetails?: string;
  jobPriority: string | null;
  startDate: Date;
  endDate: Date;
  elevatorType: string | null | null;
  buildingName: string | null | null;
  elevatorLocation: string | null | null;
  technicianName: string | null | null;
  technicianSkills: string[];
  contactInformation?: string;
  calendarEventId?: string | null;
  status: string | null;
};
export const REPAIR_JOB_COLUMNS: ColumnDef<RepairJob>[] = [
  {
    accessorKey: 'jobType',
    header: 'Job Type',
    enableResizing: true,
    size: 180,
  },
  {
    accessorKey: 'jobDetails',
    header: 'Job Details',
    enableResizing: true,
    size: 250,
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
    size: 180,
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
    size: 180,
  },
  {
    accessorKey: 'startDate',
    header: () => <div className='text-center'>Start Date</div>,
    enableResizing: true,
    cell: ({
      row: {
        original: { startDate },
      },
    }) => <DateCell isDisabled date={startDate} />,
    size: 300,
  },
  {
    accessorKey: 'endDate',
    header: () => <div className='text-center'>End Date</div>,
    enableResizing: true,
    cell: ({
      row: {
        original: { endDate },
      },
    }) => <DateCell isDisabled date={endDate} />,
    size: 300,
  },
  {
    accessorKey: 'elevatorType',
    header: 'Elevator Type',
    enableResizing: true,
    size: 180,
  },
  {
    accessorKey: 'buildingName',
    header: 'Building Name',
    enableResizing: true,
    size: 180,
  },
  {
    accessorKey: 'elevatorLocation',
    header: 'Elevator Location',
    enableResizing: true,
    size: 180,
  },
  {
    accessorKey: 'technicianName',
    header: 'Technician Name',
    enableResizing: true,
    size: 180,
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
  },
  {
    accessorKey: 'contactInformation',
    header: 'Contact Information',
    enableResizing: true,
    size: 180,
  },
];
