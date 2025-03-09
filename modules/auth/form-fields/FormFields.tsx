import { memo } from 'react';

import FormInput from '@/shared/base-input/form-input';

import FormRedirectLink from '../form-redirect-link';
import { FormField } from '../types';

type FormFieldsProps = {
  formFields: FormField[];
};
const FormFields = ({ formFields }: FormFieldsProps) => {
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
