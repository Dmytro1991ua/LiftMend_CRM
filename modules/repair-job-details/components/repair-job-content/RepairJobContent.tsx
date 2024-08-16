import { cn } from '@/lib/utils';
import BaseCard from '@/shared/base-card';

import { RepairJobSectionConfig } from '../../config';

type RepairJobContentProps = {
  loading: boolean;
  error?: string;
  repairJobSections: RepairJobSectionConfig[];
};

const RepairJobContent = ({ loading, error, repairJobSections }: RepairJobContentProps) => {
  if (loading || error) return null;

  return (
    <>
      {repairJobSections.map(({ id, title, fields }) => (
        <BaseCard key={id} cardClassName='mb-8' title={title}>
          <div className='flex flex-col gap-3'>
            {fields.map(({ id, label, value, fieldClassName }) => (
              <p
                key={id}
                className={cn(
                  'flex items-baseline gap-2 pb-2 border-b-2 border-gray-100 last:border-b-0',
                  fieldClassName
                )}
              >
                <span className='text-lg font-bold'>{label}:</span>
                <span className='text-gray-500'>{value}</span>
              </p>
            ))}
          </div>
        </BaseCard>
      ))}
    </>
  );
};

export default RepairJobContent;
