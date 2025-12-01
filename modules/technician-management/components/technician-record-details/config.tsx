import Badge from '@/shared/badge';
import { DetailsPageSectionsConfig } from '@/shared/base-details-page/types';
import BaseScoreGaugeChart from '@/shared/base-score-cell/base-score-gauge-chart/BaseScoreGaugeChart';
import { getScoreGaugeChartConfig, getScoreGaugeChartData } from '@/shared/base-score-cell/utils';
import Pill from '@/shared/pill';
import { PillStatus } from '@/shared/pill/config';
import { TechnicianRecord } from '@/shared/types';

import { TECHNICIAN_PERFORMANCE_SCORE_THRESHOLDS } from '../../config';
import { TechnicianPerformanceMetrics } from '../technician-performance-metrics';

export const technicianRecordSectionsConfig = (technicianRecord: TechnicianRecord): DetailsPageSectionsConfig[] => [
  {
    id: 1,
    title: 'Basic Information',
    fields: [
      { id: 3, label: 'Full Name:', value: technicianRecord.name },
      { id: 4, label: 'Contact Information:', value: technicianRecord.contactInformation },
      {
        id: 5,
        label: 'Availability Status:',
        value: <Pill status={technicianRecord.availabilityStatus as PillStatus} />,
        fieldClassName: 'items-center',
      },
      {
        id: 6,
        label: 'Employment Status:',
        value: <Pill status={technicianRecord.employmentStatus as PillStatus} />,
        fieldClassName: 'items-center',
      },
    ],
  },
  {
    id: 2,
    title: 'Skills and Certifications',
    fields: [
      {
        id: 7,
        label: 'Technician Skill(s):',
        value: (
          <Badge bgColor='bg-primary' className='flex text-center flex-wrap' items={technicianRecord.skills ?? []} />
        ),
        fieldClassName: 'items-center',
      },
      {
        id: 8,
        label: 'Technician Certificate(s):',
        value: (
          <Badge
            bgColor='bg-cyan-600'
            className='flex text-center flex-wrap'
            items={technicianRecord.certifications ?? []}
          />
        ),
        fieldClassName: 'items-center',
      },
    ],
  },
  {
    id: 3,
    title: 'Performance Metrics',
    fields: [
      {
        id: 9,
        label: '',
        value: <TechnicianPerformanceMetrics technicianRecord={technicianRecord} />,
        fieldClassName: 'items-center',
        valueClassName: 'overflow-x-auto',
      },
    ],
  },
  {
    id: 4,
    title: 'Performance Score',
    fields: [
      {
        id: 10,
        label: '',
        value: (
          <BaseScoreGaugeChart
            getChartConfig={(activeColor) =>
              getScoreGaugeChartConfig(TECHNICIAN_PERFORMANCE_SCORE_THRESHOLDS, activeColor)
            }
            getChartData={getScoreGaugeChartData}
            score={technicianRecord.performanceMetrics?.performanceScore}
            thresholds={TECHNICIAN_PERFORMANCE_SCORE_THRESHOLDS}
          />
        ),
        fieldClassName: 'justify-center',
      },
    ],
  },
];
