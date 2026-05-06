import { useFieldArray, useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { getCommonFormLabelErrorStyles, getFormErrorState } from '@/shared/utils';

import ControlledChecklistItem from '../controlled-checklist-Item';
import { CompleteRepairJobFormValues } from '../types';

export type ControlledChecklistProps = {
  name: 'checklist';
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

  const { errorMessage, hasRootError, hasFieldError } = getFormErrorState(errors, name);
  const labelErrorStyles = getCommonFormLabelErrorStyles(hasRootError);

  return (
    <>
      {label && <label className={cn(labelErrorStyles)}>{label}</label>}
      <div className={wrapperClassname}>
        <div className='space-y-4'>
          {fields.map((field, index) => (
            <ControlledChecklistItem
              key={field.id}
              hasError={hasFieldError}
              isDisabled={isDisabled}
              label={field.label}
              name={`${name}.${index}`}
            />
          ))}
          {hasRootError && <span className='block mt-2 text-sm text-red-500'>{errorMessage}</span>}
        </div>
      </div>
    </>
  );
};

export default ControlledChecklist;
