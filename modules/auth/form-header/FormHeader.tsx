import { memo } from 'react';

import { AuthFormHeadersConfig } from '../types';

type FormHeaderProps = {
  formHeaders: AuthFormHeadersConfig;
};

const FormHeader = ({ formHeaders }: FormHeaderProps) => {
  return (
    <div className='flex flex-col items-center mb-8 md:mb-10'>
      <h2 className='text-xl md:text-2xl font-bold mb-2'>{formHeaders.title}</h2>
      <p className='text-sm md:text-lg text-gray-400'>{formHeaders.description}</p>
    </div>
  );
};

export default memo(FormHeader);
