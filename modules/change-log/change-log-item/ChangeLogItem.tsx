import { useMemo } from 'react';

import { startCase as _startCase } from 'lodash';

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { formattedChangeLogDate } from '../utils';

export type ChangeLogItemProps = {
  id: string;
  createdAt: string | null;
  modifiedBy: string | null;
  entityType: string;
  children?: React.ReactNode;
};

const ChangeLogItem = ({ id, createdAt, modifiedBy, entityType, children }: ChangeLogItemProps) => {
  const formattedDate = useMemo(() => formattedChangeLogDate(createdAt), [createdAt]);

  return (
    <AccordionItem key={id} className='bg-blue' data-testid='change-log-item' value={id}>
      <AccordionTrigger className='hover:no-underline'>
        <div className='flex flex-col text-left'>
          <span className='font-medium'>{_startCase(entityType)}</span>
          <span className='text-xs text-muted-foreground'>
            {modifiedBy} · {formattedDate}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
    </AccordionItem>
  );
};

export default ChangeLogItem;
