import { Controller, ControllerRenderProps, FieldValues, Path, useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { getNestedError } from '@/modules/repair-job-scheduling/utils';
import { getCommonFormLabelErrorStyles } from '@/shared/utils';

import { ControlledSingleSelectProps, SingleSelectValue } from '../../types';
import CustomSingleSelect from '../custom-single-select/CustomSingleSelect';

const ControlledSingleSelect = <T extends FieldValues>({
  name,
  options,
  placeholder,
  label,
  disabled,
  className,
  defaultValue,
  infoTooltip,
  clearErrors,
  isStoringValueAsObject = false,
  ...props
}: ControlledSingleSelectProps<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const errorKey = getNestedError(errors, name);
  const hasError = !!errorKey;

  const labelErrorStyles = getCommonFormLabelErrorStyles(hasError);

  const getSelectValue = <T extends FieldValues>(
    field: ControllerRenderProps<T, Path<T>>,
    options: SingleSelectValue<string>[],
    isStoringValueAsObject: boolean
  ): SingleSelectValue<string> | null => {
    if (isStoringValueAsObject) {
      const selectedValue = field.value;

      if (!selectedValue || !selectedValue.value) return null;

      return selectedValue;
    }

    return options.find((option) => option?.value === field.value) || null;
  };

  const handleSelectChange = <T extends FieldValues>(
    field: ControllerRenderProps<T, Path<T>>,
    selectedOption: SingleSelectValue<string> | null,
    isStoringValueAsObject: boolean,
    clearErrors?: (name?: Path<T>) => void,
    name?: Path<T>
  ) => {
    const valueToStore = isStoringValueAsObject ? selectedOption ?? null : selectedOption?.value ?? null;

    field.onChange(valueToStore);

    if (clearErrors && name) clearErrors(name);
  };

  return (
    <div className={cn('relative grid w-full items-center gap-1.5', className)}>
      <div className='flex items-center gap-2'>
        {label && <label className={labelErrorStyles}>{label}</label>}
        {(disabled || infoTooltip) && infoTooltip}
      </div>
      <Controller
        control={control}
        defaultValue={defaultValue}
        name={name}
        render={({ field }) => (
          <CustomSingleSelect
            defaultValue={defaultValue}
            hasError={hasError}
            isDisabled={disabled}
            options={options}
            placeholder={placeholder}
            value={getSelectValue(field, options, isStoringValueAsObject)}
            onChange={(selectedOption) =>
              handleSelectChange(field, selectedOption, isStoringValueAsObject, clearErrors, name)
            }
            {...props}
          />
        )}
      />
      {hasError && <span className='field-error'>{errorKey?.message}</span>}
    </div>
  );
};

export default ControlledSingleSelect;
