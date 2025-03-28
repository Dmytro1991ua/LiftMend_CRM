import { useFormContext } from 'react-hook-form';

import FormInput from '@/shared/base-input/form-input';

import { FromInputConfig } from '../types';
import { ProfileContentFormFields } from '../validation';

type ProfileFormFieldsProps = {
  config: FromInputConfig[];
};

const ProfileFormFields = ({ config }: ProfileFormFieldsProps) => {
  const { clearErrors } = useFormContext<ProfileContentFormFields>();

  return (
    <div className='flex-1 w-full'>
      {config.map(({ id, name, type, placeholder, disabled, label, isLastElement }) => {
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

export default ProfileFormFields;
