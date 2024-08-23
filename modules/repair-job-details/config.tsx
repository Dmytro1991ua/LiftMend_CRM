import { RepairJob } from '@prisma/client';

import DatePicker from '@/shared/date-picker';

import RepairJobPriority from './components/repair-job-priority';
import { Priority } from './components/repair-job-priority/config';
import TechnicianSkills from './components/technician-skills/TechnicianSkills';

type SectionField = { id: number; label: string; value: React.ReactNode | string; fieldClassName?: string };

export type RepairJobSectionConfig = {
  id: number;
  title: string;
  fields: SectionField[];
};

export const repairJobSectionsConfig = (repairJob: RepairJob): RepairJobSectionConfig[] => [
  {
    id: 1,
    title: 'Repair Job Details',
    fields: [
      { id: 3, label: 'Type', value: repairJob.jobType },
      { id: 4, label: 'Details', value: repairJob.jobDetails },
      {
        id: 5,
        label: 'Priority',
        value: <RepairJobPriority priority={repairJob.jobPriority as Priority} />,
        fieldClassName: 'items-center',
      },
      {
        id: 6,
        label: 'Scheduled Dates',
        value: (
          <DatePicker
            key={`${repairJob.startDate}-${repairJob.endDate}`}
            dateRange={{ from: repairJob.startDate, to: repairJob.endDate }}
            isDisabled={true}
          />
        ),
      },
    ],
  },
  {
    id: 2,
    title: 'Elevator Information',
    fields: [
      { id: 7, label: 'Type', value: repairJob.elevatorType },
      { id: 8, label: 'Building Name', value: repairJob.buildingName },
      { id: 9, label: 'Location', value: repairJob.elevatorLocation },
    ],
  },
  {
    id: 3,
    title: 'Technician Information',
    fields: [
      { id: 10, label: 'Name', value: repairJob.technicianName },
      { id: 11, label: 'Skills', value: <TechnicianSkills skills={repairJob.technicianSkills ?? []} /> },
      { id: 12, label: 'Contact Info', value: repairJob.contactInformation },
    ],
  },
];
