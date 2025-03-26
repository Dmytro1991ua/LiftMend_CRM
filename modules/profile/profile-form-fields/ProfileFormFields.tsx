import FormInput from '@/shared/base-input/form-input';

import { FromInputConfig } from '../types';

type ProfileFormFieldsProps = {
  config: FromInputConfig[];
};

const ProfileFormFields = ({ config }: ProfileFormFieldsProps) => {
  return (
    <div className='flex-1 w-full'>
      {config.map(({ id, name, type, placeholder, label, isLastElement }) => (
        <FormInput
          key={id}
          errorClassName='text-sm'
          isLastElement={isLastElement}
          label={label}
          name={name}
          placeholder={placeholder}
          type={type}
        />
      ))}
    </div>
  );
};

export default ProfileFormFields;
