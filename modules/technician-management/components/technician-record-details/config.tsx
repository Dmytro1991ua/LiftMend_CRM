import Badge from '@/shared/badge';
import { DetailsPageSectionsConfig } from '@/shared/base-details-page/types';
import Pill from '@/shared/pill';
import { PillStatus } from '@/shared/pill/config';
import { TechnicianRecord } from '@/shared/types';

export const technicianRecordSectionsConfig = (technicianRecord: TechnicianRecord): DetailsPageSectionsConfig[] => [
  {
    id: 1,
    title: 'Basic Information',
    fields: [
      { id: 3, label: 'Technician Full Name', value: technicianRecord.name },
      { id: 4, label: 'Contact Information', value: technicianRecord.contactInformation },
      {
        id: 5,
        label: 'Availability Status',
        value: <Pill status={technicianRecord.availabilityStatus as PillStatus} />,
        fieldClassName: 'items-center',
      },
      {
        id: 6,
        label: 'Employment Status',
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
        label: 'Technician Skill(s)',
        value: (
          <Badge bgColor='bg-primary' className='flex text-center flex-wrap' items={technicianRecord.skills ?? []} />
        ),
        fieldClassName: 'items-center',
      },
      {
        id: 8,
        label: 'Technician Certificate(s)',
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
];
