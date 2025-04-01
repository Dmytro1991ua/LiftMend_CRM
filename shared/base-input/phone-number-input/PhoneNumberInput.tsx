import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';
import PhoneInput, { CountryData } from 'react-phone-input-2';

import 'react-phone-input-2/lib/style.css';
import { InputProps } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { getNestedError } from '@/modules/repair-job-scheduling/utils';

interface PhoneNumberInputProps<T extends FieldValues> extends InputProps {
  name: Path<T>;
  disabled?: boolean;
  inputClassName?: string;
  selectedCountry?: string;
  onSelectCountry?: (country: string) => void;
}

const SEARCH_INPUT_PLACEHOLDER = 'Search for country';

const PhoneNumberInput = <T extends FieldValues>({
  name,
  inputClassName,
  disabled,
  selectedCountry,
  onSelectCountry,
}: PhoneNumberInputProps<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const errorKey = getNestedError(errors, name);
  const hasError = !!errorKey;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className='w-full'>
          <PhoneInput
            {...field}
            buttonClass={cn('default-country-button-styles', { '!border-red-500': hasError })}
            containerClass='w-full'
            country={selectedCountry}
            disabled={disabled}
            autoFormat={true}
            searchPlaceholder={SEARCH_INPUT_PLACEHOLDER}
            enableSearch={true}
            inputClass={cn('!w-full border !py-[2rem] rounded focus:ring-2 focus:ring-blue-500', inputClassName, {
              '!border-red-500 !bg-red-100': hasError,
            })}
            disableSearchIcon
            searchClass='!w-full !border !rounded-md !px-3 !ml-0 !py-2 focus:!ring-2 focus:!ring-blue-500'
            dropdownClass='!mt-0'
            onChange={(value, countryData) => {
              field.onChange(value);
              onSelectCountry && onSelectCountry((countryData as CountryData).countryCode);
            }}
          />
          {hasError && <span className='text-red-500 text-sm'>{errorKey?.message as string}</span>}
        </div>
      )}
    />
  );
};

export default PhoneNumberInput;
