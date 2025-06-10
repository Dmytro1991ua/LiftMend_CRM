import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';
import PhoneInput, { CountryData } from 'react-phone-input-2';

import 'react-phone-input-2/lib/style.css';
import { InputProps } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { getNestedError } from '@/modules/repair-job-scheduling/utils';
import { getCommonFormLabelErrorStyles } from '@/shared/utils';

export interface PhoneNumberInputProps<T extends FieldValues> extends InputProps {
  name: Path<T>;
  disabled?: boolean;
  inputClassName?: string;
  selectedCountry?: string;
  label?: string;
  onSelectCountry?: (country: string) => void;
}

const SEARCH_INPUT_PLACEHOLDER = 'Search for country';

const PhoneNumberInput = <T extends FieldValues>({
  name,
  inputClassName,
  disabled,
  selectedCountry,
  label,
  onSelectCountry,
}: PhoneNumberInputProps<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const errorKey = getNestedError(errors, name);
  const hasError = !!errorKey;

  const labelErrorStyles = getCommonFormLabelErrorStyles(hasError);

  return (
    <div className='flex flex-col gap-2'>
      <label className={labelErrorStyles} htmlFor={name}>
        {label}
      </label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <div className='w-full'>
            <PhoneInput
              {...field}
              disableSearchIcon
              autoFormat={true}
              buttonClass={cn('default-country-button-styles', { '!border-red-500': hasError })}
              containerClass='w-full'
              country={selectedCountry}
              data-testid='phone-number-input'
              disabled={disabled}
              dropdownClass='!mt-0'
              enableSearch={true}
              inputClass={cn('!w-full border !py-[2rem] rounded focus:ring-2 focus:ring-blue-500', inputClassName, {
                '!border-red-500 !bg-red-100': hasError,
              })}
              searchClass='!w-full !border !rounded-md !px-3 !ml-0 !py-2 focus:!ring-2 focus:!ring-blue-500'
              searchPlaceholder={SEARCH_INPUT_PLACEHOLDER}
              onChange={(value, countryData) => {
                field.onChange(value);
                onSelectCountry && onSelectCountry((countryData as CountryData).countryCode);
              }}
            />
            {hasError && <span className='text-red-500 text-sm'>{errorKey?.message}</span>}
          </div>
        )}
      />
    </div>
  );
};

export default PhoneNumberInput;
