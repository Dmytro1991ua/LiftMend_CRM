import { ArrayPath, useFieldArray, useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { getNestedError } from '@/modules/repair-job-scheduling/utils';
import { getCommonFormLabelErrorStyles } from '@/shared/utils';

import ControlledChecklistItem from '../controlled-checklist-Item';
import { CompleteRepairJobFormValues } from '../types';

export type ControlledChecklistProps = {
  name: ArrayPath<CompleteRepairJobFormValues>;
  isDisabled?: boolean;
  wrapperClassname?: string;
  label?: string;
};

const ControlledChecklist = ({ name, isDisabled, wrapperClassname, label }: ControlledChecklistProps) => {
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

  const labelErrorStyles = getCommonFormLabelErrorStyles(hasError);

  return (
    <>
      {label && <label className={cn(labelErrorStyles)}>{label}</label>}
      <div className={wrapperClassname}>
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
      </div>
    </>
  );
};

export default ControlledChecklist;
