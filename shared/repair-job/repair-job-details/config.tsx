import { Checkbox } from '@/components/ui/checkbox';
import { RepairJob } from '@/graphql/types/client/generated_types';
import { DetailsPageSectionsConfig } from '@/shared/base-details-page/types';
import BaseInput from '@/shared/base-input';
import DatePicker from '@/shared/date-picker';
import Pill from '@/shared/pill';
import { PillStatus } from '@/shared/pill/config';

import BaseChecklistItem from '../base-checklist-item';
import OverdueRepairJob from '../overdue-repair-job';

export const repairJobSectionsConfig = (repairJob: RepairJob): DetailsPageSectionsConfig[] => [
  {
    id: 1,
    title: 'Repair Job Details',
    fields: [
      {
        id: 3,
        label: 'Status:',
        value: <Pill status={repairJob.status as PillStatus} />,
        fieldClassName: 'items-center',
      },
      {
        id: 4,
        label: 'Is Overdue?:',
        value: <OverdueRepairJob isOverdue={repairJob.isOverdue} />,
        fieldClassName: 'items-center',
      },
      { id: 5, label: 'Type:', value: repairJob.jobType },
      { id: 6, label: 'Details:', value: repairJob.jobDetails },
      {
        id: 7,
        label: 'Priority:',
        value: <Pill status={repairJob.jobPriority as PillStatus} />,
        fieldClassName: 'items-center',
      },
      {
        id: 8,
        label: 'Scheduled Dates:',
        value: (
          <DatePicker
            key={`${repairJob.startDate}-${repairJob.endDate}`}
            dateRange={{ from: repairJob.startDate, to: repairJob.endDate }}
            isDisabled={true}
          />
        ),
      },
      ...(repairJob?.actualEndDate
        ? [
            {
              id: 9,
              label: 'Actual End Date:',
              value: (
                <DatePicker
                  key={repairJob?.actualEndDate}
                  isDisabled
                  isDateRangeMode={false}
                  numberOfMonths={1}
                  singleDate={repairJob?.actualEndDate}
                />
              ),
            },
          ]
        : []),
    ],
  },
  {
    id: 2,
    title: 'Elevator Information',
    fields: [
      { id: 7, label: 'Type:', value: repairJob.elevatorType },
      { id: 8, label: 'Building Name:', value: repairJob.buildingName },
      { id: 9, label: 'Location:', value: repairJob.elevatorLocation },
    ],
  },
  {
    id: 3,
    title: 'Technician Information',
    fields: [{ id: 10, label: 'Name:', value: repairJob.technicianName }],
  },
  ...(repairJob.checklist?.length && repairJob.status === 'Completed'
    ? [
        {
          id: 4,
          title: 'Completion Checklist',
          fields: [
            {
              id: 11,
              label: '',
              value: (
                <>
                  {repairJob.checklist.map(({ label, checked, comment }, index) => (
                    <BaseChecklistItem
                      key={index}
                      label={label}
                      renderCheckbox={<Checkbox disabled checked={checked} />}
                      renderInput={<BaseInput disabled name='checklist' value={comment as string} />}
                    />
                  ))}
                </>
              ),
              fieldClassName: 'block w-full',
            },
          ],
        },
      ]
    : []),
];
