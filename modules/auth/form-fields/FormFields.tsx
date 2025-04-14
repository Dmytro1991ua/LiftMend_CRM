import { memo } from 'react';

import FormInput from '@/shared/base-input/form-input';
import PhoneNumberInput from '@/shared/base-input/phone-number-input';

import FormRedirectLink from '../form-redirect-link';
import { FormField } from '../types';

export type FormFieldsProps = {
  formFields: FormField[];
  selectedCountry?: string;
  onSelectCountry?: (country: string) => void;
};
const FormFields = ({ formFields, selectedCountry, onSelectCountry }: FormFieldsProps) => {
  return (
    <>
      {formFields.map(({ id, name, placeholder, label, type, route, className, isLastElement }) => {
        if (type === 'link') {
          return (
            <div key={route} className={className}>
              <FormRedirectLink route={route ?? ''} title={label} />
            </div>
          );
        }

        if (type === 'phone') {
          return (
            <div key={id} className={className}>
              <PhoneNumberInput
                label={label}
                name={name}
                selectedCountry={selectedCountry}
                onSelectCountry={onSelectCountry}
              />
            </div>
          );
        }

        return (
          <div key={id} className={className}>
            <FormInput
              key={id}
              errorClassName='text-sm'
              isLastElement={isLastElement}
              label={label}
              name={name}
              placeholder={placeholder}
              type={type}
            />
          </div>
        );
      })}
    </>
  );
};

export default memo(FormFields);
