import { ElevatorRecord } from '@/graphql/types/client/generated_types';
import { DetailsPageSectionsConfig } from '@/shared/base-details-page/types';
import DatePicker from '@/shared/date-picker';
import Pill from '@/shared/pill';
import { PillStatus } from '@/shared/pill/config';

import { ElevatorHealthScoreGaugeChart } from '../elevator-health-score-gauge-chart';
import { ElevatorMentainanceHistoryTable } from '../elevator-mentainance-history-table';

export const elevatorRecordSectionsConfig = (elevatorRecord: ElevatorRecord): DetailsPageSectionsConfig[] => [
  {
    id: 1,
    title: 'Elevator Details',
    fields: [
      { id: 3, label: 'Building Name:', value: elevatorRecord.buildingName },
      { id: 4, label: 'Type:', value: elevatorRecord.elevatorType },
      { id: 5, label: 'Location:', value: elevatorRecord.elevatorLocation },
      {
        id: 6,
        label: 'Capacity:',
        value: elevatorRecord.capacity,
      },
    ],
  },
  {
    id: 2,
    title: 'Maintenance Information',
    fields: [
      {
        id: 7,
        label: 'Last Maintenance Date:',
        value: (
          <DatePicker
            key={`${elevatorRecord.lastMaintenanceDate}`}
            isDisabled
            isDateRangeMode={false}
            numberOfMonths={1}
            singleDate={elevatorRecord.lastMaintenanceDate}
          />
        ),
      },
      {
        id: 8,
        label: 'Next Maintenance Date:',
        value: (
          <DatePicker
            key={`${elevatorRecord.nextMaintenanceDate}`}
            isDisabled
            isDateRangeMode={false}
            numberOfMonths={1}
            singleDate={elevatorRecord.nextMaintenanceDate}
          />
        ),
      },
      {
        id: 9,
        label: 'Status:',
        value: <Pill status={elevatorRecord.status as PillStatus} />,
        fieldClassName: 'items-center',
      },
    ],
  },
  {
    id: 3,
    title: 'Health Score',
    fields: [
      {
        id: 10,
        label: '',
        value: <ElevatorHealthScoreGaugeChart healthScore={elevatorRecord.healthScore} />,
        fieldClassName: 'justify-center',
      },
    ],
  },
  {
    id: 4,
    title: 'Maintenance History',
    fields: [
      {
        id: 1,
        label: '',
        value: <ElevatorMentainanceHistoryTable elevatorRecord={elevatorRecord} />,
        valueClassName: 'overflow-x-auto',
      },
    ],
  },
];
