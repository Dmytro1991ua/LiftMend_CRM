import { RepairJob } from '@/graphql/types/client/generated_types';
import { DetailsPageSectionsConfig } from '@/shared/base-details-page/types';
import DatePicker from '@/shared/date-picker';
import Pill from '@/shared/pill';
import { PillStatus } from '@/shared/pill/config';
import TechnicianSkills from '@/shared/repair-job/technician-skills';

export const repairJobSectionsConfig = (repairJob: RepairJob): DetailsPageSectionsConfig[] => [
  {
    id: 1,
    title: 'Repair Job Details',
    fields: [
      {
        id: 3,
        label: 'Status',
        value: <Pill status={repairJob.status as PillStatus} />,
        fieldClassName: 'items-center',
      },
      { id: 4, label: 'Type', value: repairJob.jobType },
      { id: 5, label: 'Details', value: repairJob.jobDetails },
      {
        id: 6,
        label: 'Priority',
        value: <Pill status={repairJob.jobPriority as PillStatus} />,
        fieldClassName: 'items-center',
      },

      {
        id: 7,
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
