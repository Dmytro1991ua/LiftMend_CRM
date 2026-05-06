import React, { useCallback } from 'react';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { HiPlus } from 'react-icons/hi';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DropdownOption } from '@/shared/base-select/types';
import { getCommonFormLabelErrorStyles, getFormErrorState } from '@/shared/utils';

import ControlledInventoryPartItem from '../controlled-inventory-part-item';
import { CompleteRepairJobFormValues } from '../types';

export type ControlledInventoryPartsListProps = {
  name: 'partsUsed';
  label?: string;
  isDisabled?: boolean;
  options?: DropdownOption[];
  isLoading?: boolean;
};

const ADD_INVENTORY_PART_BUTTON_LABEL = 'Add Part';
const MAX_VISIBLE_PARTS_BEFORE_SCROLL = 3;

const ControlledInventoryPartsList = ({ name, label, options = [], isDisabled }: ControlledInventoryPartsListProps) => {
  const {
    control,
    formState: { errors, isSubmitted },
    trigger,
  } = useFormContext<CompleteRepairJobFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const { errorMessage, hasRootError, hasFieldError } = getFormErrorState(errors, name);

  const showRootError = hasRootError && fields.length === 0;
  const showFieldError = hasFieldError && !hasRootError && fields.length > 0;
  const isPartsListOverflowing = fields.length >= MAX_VISIBLE_PARTS_BEFORE_SCROLL;
  const isLastPartRemaining = fields.length === 1;

  const labelErrorStyles = getCommonFormLabelErrorStyles(showRootError || showFieldError);

  const onAddPart = useCallback(() => append({ partId: '', quantity: '' }), [append]);
  const onRemovePart = useCallback(
    async (index: number) => {
      remove(index);

      // Only revalidate when removing the last part to show root error,
      // avoiding premature field validation on remaining parts
      if (isSubmitted && isLastPartRemaining) {
        await trigger(name);
      }
    },
    [remove, trigger, isSubmitted, isLastPartRemaining, name]
  );

  return (
    <div className='mt-3 space-y-2'>
      <div className='flex justify-between items-center'>
        <label className={labelErrorStyles}>{label}</label>
        <Button disabled={isDisabled} type='button' onClick={onAddPart}>
          <HiPlus />
          <span className='ml-1'>{ADD_INVENTORY_PART_BUTTON_LABEL}</span>
        </Button>
      </div>
      <div
        className={(cn('space-y-3'), isPartsListOverflowing ? 'h-[30rem] overflow-y-auto' : 'h-auto')}
        data-testid='parts-scroll-container'
      >
        {fields.map((field, index) => (
          <ControlledInventoryPartItem
            key={field.id}
            isDisabled={isDisabled}
            name={`${name}.${index}`}
            options={options}
            onRemove={() => onRemovePart(index)}
          />
        ))}
        {showRootError && <span className='flex justify-center text-sm text-red-500'>{errorMessage}</span>}
      </div>
    </div>
  );
};

export default ControlledInventoryPartsList;
