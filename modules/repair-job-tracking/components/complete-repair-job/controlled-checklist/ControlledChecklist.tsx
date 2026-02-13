import { ArrayPath, useFieldArray, useFormContext } from 'react-hook-form';

import { getNestedError } from '@/modules/repair-job-scheduling/utils';

import ControlledChecklistItem from '../controlled-checklist-Item';
import { CompleteRepairJobFormValues } from '../types';

export type ControlledChecklistProps = {
  name: ArrayPath<CompleteRepairJobFormValues>;
  isDisabled?: boolean;
};

const ControlledChecklist = ({ name, isDisabled }: ControlledChecklistProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<CompleteRepairJobFormValues>();

  const { fields } = useFieldArray({
    control,
    name,
  });

  const rootError = getNestedError(errors, `${name}.root`) as { message?: string };
  const hasError = !!rootError;

  return (
    <div className='space-y-4'>
      {fields.map((field, index) => (
        <ControlledChecklistItem
          key={field.id}
          hasError={hasError}
          isDisabled={isDisabled}
          label={field.label}
          name={`${name}.${index}`}
        />
      ))}
      {hasError && <span className='block mt-2 text-sm text-red-500'>{rootError?.message}</span>}
    </div>
  );
};

export default ControlledChecklist;
