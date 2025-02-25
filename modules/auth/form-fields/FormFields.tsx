import FormInput from '@/shared/base-input/form-input';
import { FormField } from '../types';
import FormRedirectLink from '../form-redirect-link';
import { memo } from 'react';

type FormFieldsProps = {
  formFields: FormField[];
};
const FormFields = ({ formFields }: FormFieldsProps) => {
  return (
    <>
      {formFields.map(({ id, name, placeholder, label, type, route, className, isLastElement }) => {
        if (type === 'link') {
          return (
            <div className={className}>
              <FormRedirectLink route={route ?? ''} title={label} />
            </div>
          );
        }

        return (
          <div className={className}>
            <FormInput
              key={id}
              name={name}
              placeholder={placeholder}
              label={label}
              type={type}
              errorClassName='text-sm'
              isLastElement={isLastElement}
            />
          </div>
        );
      })}
    </>
  );
};

export default memo(FormFields);
