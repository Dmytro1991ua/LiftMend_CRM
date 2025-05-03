import { memo } from 'react';

import { useFormContext } from 'react-hook-form';

import FormInput from '@/shared/base-input/form-input';
import PhoneNumberInput from '@/shared/base-input/phone-number-input';

import { FromInputConfig } from '../types';
import { ProfileContentFormFields } from '../validation';

export type ProfileFormFieldsProps = {
  config: FromInputConfig[];
  selectedCountry?: string;
  onSelectCountry?: (country: string) => void;
};

const ProfileFormFields = ({ config, selectedCountry, onSelectCountry }: ProfileFormFieldsProps) => {
  const { clearErrors } = useFormContext<ProfileContentFormFields>();

  return (
    <div className='flex-1 w-full' data-testid='profile-form-fields'>
      {config.map(({ id, name, type, placeholder, disabled, label, isLastElement }) => {
        if (type === 'phone') {
          return (
            <div key={id}>
              <PhoneNumberInput name={name} selectedCountry={selectedCountry} onSelectCountry={onSelectCountry} />
            </div>
          );
        }

        return (
          <FormInput
            key={id}
            disabled={disabled}
            errorClassName='text-sm'
            isLastElement={isLastElement}
            label={label}
            name={name}
            placeholder={placeholder}
            type={type}
            onChange={() => clearErrors(name)}
          />
        );
      })}
    </div>
  );
};

export default memo(ProfileFormFields);
