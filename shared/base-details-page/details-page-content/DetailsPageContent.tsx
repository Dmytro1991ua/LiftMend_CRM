import { cn } from '@/lib/utils';
import BaseCard from '@/shared/base-card';

import { DetailsPageSectionsConfig } from '../types';

export type DetailsPageContentProps = {
  loading: boolean;
  error?: string;
  detailsPageSections: DetailsPageSectionsConfig[];
};

const DetailsPageContent = ({ loading, error, detailsPageSections }: DetailsPageContentProps) => {
  if (loading || error) return null;

  return (
    <>
      {detailsPageSections.map(({ id, title, fields }) => (
        <BaseCard key={id} cardClassName='mb-8 last:mb-0 shadow-xl' title={title}>
          <div className='flex flex-col gap-3'>
            {fields.map(({ id, label, value, fieldClassName, valueClassName }) => (
              <p
                key={id}
                className={cn(
                  'flex items-baseline gap-2 pb-2 border-b-2 border-gray-100 last:border-b-0',
                  fieldClassName
                )}>
                <span className='text-lg font-bold'>{label}</span>
                <span className={cn('text-gray-500', valueClassName)}>{value}</span>
              </p>
            ))}
          </div>
        </BaseCard>
      ))}
    </>
  );
};

export default DetailsPageContent;
