import { Accept } from 'react-dropzone/.';
import { Controller, FieldValues, Path, UseFormClearErrors, useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { getNestedError } from '@/modules/repair-job-scheduling/utils';
import FileDropzone from '@/shared/file-dropzone';
import { getCommonFormLabelErrorStyles } from '@/shared/utils';

export type ControlledSingleFileDropzoneProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  disabled?: boolean;
  className?: string;
  defaultValue?: File | null;
  infoTooltip?: React.ReactNode;
  clearErrors?: UseFormClearErrors<T>;
  acceptTypes?: Accept;
  testId?: string;
  tooltip?: string;
  children: React.ReactNode;
};

const ControlledSingleFileUpload = <T extends FieldValues>({
  name,
  label,
  disabled,
  className,
  defaultValue = null,
  infoTooltip,
  clearErrors,
  acceptTypes,
  testId,
  tooltip,
  children,
}: ControlledSingleFileDropzoneProps<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const errorKey = getNestedError(errors, name);
  const hasError = !!errorKey;

  const labelErrorStyles = getCommonFormLabelErrorStyles(hasError);

  const onHandleSingleFileUpload = async (files: File[], onChange: (value: File | null) => void) => {
    const file = files[0] ?? null;

    onChange(file);

    if (clearErrors) clearErrors(name);
  };

  return (
    <div className={cn('relative grid w-full items-center gap-1.5', className)}>
      <div className='flex items-center gap-2'>
        {label && <label className={labelErrorStyles}>{label}</label>}
        {(disabled || infoTooltip) && infoTooltip}
      </div>
      <Controller
        control={control}
        defaultValue={defaultValue as never}
        name={name}
        render={({ field }) => (
          <FileDropzone
            acceptTypes={acceptTypes}
            className={cn(hasError && 'border-destructive')}
            isUploadDisabled={disabled}
            testId={testId}
            tooltip={tooltip}
            onFileUpload={(files) => onHandleSingleFileUpload(files, field.onChange)}
          >
            {children}
          </FileDropzone>
        )}
      />
      {hasError && <span className='field-error'>{errorKey?.message}</span>}
    </div>
  );
};

export default ControlledSingleFileUpload;
