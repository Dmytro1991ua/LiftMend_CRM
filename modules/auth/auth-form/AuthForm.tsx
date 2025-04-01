import { Form } from 'react-hook-form';
import { Hourglass } from 'react-loader-spinner';

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
  oAuthButtons?: JSX.Element;
  authFormSeparator?: JSX.Element;
  selectedCountry?: string;
  onSelectCountry?: (country: string) => void;
};

const AuthForm = ({
  formType,
  buttonLabel,
  isLoading,
  authFormSeparator,
  oAuthButtons,
  selectedCountry,
  onSelectCountry,
  onSubmit,
}: AuthFormProps) => {
  return (
    <Form className='w-[95%] sm:!w-[65rem] md:!w-[75rem] p-8 my-5 mx-5 rounded-2xl bg-white shadow-xl'>
      <Logo wrapperClassName='border-b-0 mb-1' />
      <FormHeader formHeaders={FORM_TITLES_CONFIG[formType]} />
      {isLoading ? (
        <div className={isLoading ? 'flex justify-center h-35' : ''}>
          <Hourglass
            ariaLabel='hourglass-loading'
            colors={['#306cce', '#72a1ed']}
            height='80'
            visible={true}
            width='80'
          />
        </div>
      ) : (
        <div className='grid grid-cols-6 gap-2'>
          <FormFields
            formFields={FORM_FIELDS_CONFIG[formType]}
            selectedCountry={selectedCountry}
            onSelectCountry={onSelectCountry}
          />
        </div>
      )}
      <BaseButton
        className='w-full shadow-md shadow-blue-800'
        isDisabled={isLoading}
        isLoading={isLoading}
        label={buttonLabel}
        type='submit'
        onClick={onSubmit}
      />
      {authFormSeparator}
      {oAuthButtons}
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
