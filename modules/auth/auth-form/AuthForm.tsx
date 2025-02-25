import { Form } from 'react-hook-form';

import BaseButton from '@/shared/base-button';
import Logo from '@/shared/logo';

import FormFields from '../form-fields';
import FormHeader from '../form-header';
import FormRedirectLink from '../form-redirect-link';
import { AuthButtonLabel, AuthFormType } from '../types';

import { FORM_FIELDS_CONFIG, FORM_REDIRECTION_LINKS_CONFIG, FORM_TITLES_CONFIG } from './config';

type AuthFormProps = {
  formType: AuthFormType;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  buttonLabel: AuthButtonLabel;
  isLoading?: boolean;
};

const AuthForm = ({ formType, buttonLabel, isLoading, onSubmit }: AuthFormProps) => {
  return (
    <Form className='w-[95%] sm:!w-[65rem] md:!w-[75rem] p-8 my-5 mx-5 rounded-2xl bg-white shadow-xl'>
      <Logo wrapperClassName='border-b-0 mb-2 md:mb-4' />
      <FormHeader formHeaders={FORM_TITLES_CONFIG[formType]} />
      <div className='grid grid-cols-6 gap-2'>
        <FormFields formFields={FORM_FIELDS_CONFIG[formType]} />
      </div>
      <BaseButton
        className='w-full shadow-md shadow-blue-800'
        isDisabled={isLoading}
        isLoading={isLoading}
        label={buttonLabel}
        type='submit'
        onClick={onSubmit}
      />
      <div className='text-center mt-4'>
        <FormRedirectLink
          route={FORM_REDIRECTION_LINKS_CONFIG[formType].route}
          title={FORM_REDIRECTION_LINKS_CONFIG[formType].title}
        />
      </div>
    </Form>
  );
};

export default AuthForm;
