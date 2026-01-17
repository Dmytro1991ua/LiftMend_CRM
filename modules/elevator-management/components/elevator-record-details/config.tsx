import { ElevatorRecord } from '@/graphql/types/client/generated_types';
import { DetailsPageSectionsConfig } from '@/shared/base-details-page/types';
import BaseScoreGaugeChart from '@/shared/base-score-cell/base-score-gauge-chart/BaseScoreGaugeChart';
import { getScoreGaugeChartConfig, getScoreGaugeChartData } from '@/shared/base-score-cell/utils';
import DatePicker from '@/shared/date-picker';
import Pill from '@/shared/pill';
import { PillStatus } from '@/shared/pill/config';

import { ELEVATOR_HEALTH_SCORE_THRESHOLDS } from '../../config';
import { ElevatorMaintenanceHistoryTable } from '../elevator-maintenance-history-table';

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
        label: 'Last Inspection Date:',
        value: (
          <DatePicker
            key={`${elevatorRecord.lastInspectionDate}`}
            isDisabled
            isDateRangeMode={false}
            numberOfMonths={1}
            singleDate={elevatorRecord.lastInspectionDate}
          />
        ),
      },
      {
        id: 10,
        label: 'Next Inspection Date:',
        value: (
          <DatePicker
            key={`${elevatorRecord.nextInspectionDate}`}
            isDisabled
            isDateRangeMode={false}
            numberOfMonths={1}
            singleDate={elevatorRecord.nextInspectionDate}
          />
        ),
      },
      {
        id: 11,
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
        value: (
          <BaseScoreGaugeChart
            getChartConfig={(activeColor) => getScoreGaugeChartConfig(ELEVATOR_HEALTH_SCORE_THRESHOLDS, activeColor)}
            getChartData={getScoreGaugeChartData}
            score={elevatorRecord.healthScore}
            thresholds={ELEVATOR_HEALTH_SCORE_THRESHOLDS}
          />
        ),
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
        value: <ElevatorMaintenanceHistoryTable elevatorRecord={elevatorRecord} />,
        valueClassName: 'overflow-x-auto',
      },
    ],
  },
];
