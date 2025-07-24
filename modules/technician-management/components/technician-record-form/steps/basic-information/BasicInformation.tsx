import { Fragment } from 'react';

import { useFormContext } from 'react-hook-form';
import { Bars } from 'react-loader-spinner';

import { GetTechnicianRecordFormDataQuery } from '@/graphql/types/client/generated_types';
import {
  AVAILABILITY_STATUS_TOOLTIP_MESSAGE,
  EMPLOYMENT_STATUS_TOOLTIP_MESSAGE,
} from '@/modules/technician-management/constants';
import BaseAlert from '@/shared/base-alert/BaseAlert';
import FormInput from '@/shared/base-input/form-input';
import ControlledSingleSelect from '@/shared/base-select/components/controlled-single-select';
import InfoTooltip from '@/shared/base-tooltip/info-tooltip/InfoTooltip';
import { useFetchDropdownOptions } from '@/shared/hooks/useFetchDropdownOptions';
import { DropdownOptions } from '@/shared/hooks/useFetchDropdownOptions/config';
import QueryResponse from '@/shared/query-response';
import { ItemConfig } from '@/shared/types';

import { TechnicianRecordFormFields } from '../../validation';

const BasicInformation = () => {
  const { clearErrors } = useFormContext<TechnicianRecordFormFields>();

  const {
    dropdownOptions: { availabilityStatuses, employmentStatuses },
    loading,
    error,
  } = useFetchDropdownOptions<GetTechnicianRecordFormDataQuery>({ configKey: DropdownOptions.TechnicianManagement });

  const BASIC_INFORMATION_FORM_FIELDS_CONFIG: ItemConfig[] = [
    {
      id: 1,
      content: (
        <FormInput<TechnicianRecordFormFields>
          id='fullName'
          label='Technician Full Name'
          name='basicInformation.fullName'
          placeholder='Please provide a full name'
          onChange={() => clearErrors('basicInformation.fullName')}
        />
      ),
    },
    {
      id: 2,
      content: (
        <FormInput<TechnicianRecordFormFields>
          id='contactInformation'
          label='Contact Information'
          name='basicInformation.contactInformation'
          placeholder='Please provide a contact information'
          onChange={() => clearErrors('basicInformation.contactInformation')}
        />
      ),
    },
    {
      id: 3,
      content: (
        <ControlledSingleSelect<TechnicianRecordFormFields>
          disabled
          captureMenuScroll={false}
          className='mb-8'
          clearErrors={clearErrors}
          infoTooltip={
            <InfoTooltip
              className='w-[33rem]'
              iconColor='#2563eb'
              iconSize='14'
              id={'availabilityStatus-field-id'}
              message={AVAILABILITY_STATUS_TOOLTIP_MESSAGE}
              place='right'
            />
          }
          isMultiSelect={false}
          label='Availability Status'
          name='basicInformation.availabilityStatus'
          options={availabilityStatuses}
        />
      ),
    },
    {
      id: 4,
      content: (
        <ControlledSingleSelect<TechnicianRecordFormFields>
          disabled
          captureMenuScroll={false}
          className='mb-8'
          clearErrors={clearErrors}
          infoTooltip={
            <InfoTooltip
              className='w-[32rem]'
              iconColor='#2563eb'
              iconSize='14'
              id={'employmentStatus-field-id'}
              message={EMPLOYMENT_STATUS_TOOLTIP_MESSAGE}
              place='right'
            />
          }
          isMultiSelect={false}
          label='Employment Status'
          name='basicInformation.employmentStatus'
          options={employmentStatuses}
        />
      ),
    },
  ];

  return (
    <div>
      <QueryResponse
        errorComponent={
          <BaseAlert description={error} title='Failed to fetch technician form details data' variant='destructive' />
        }
        isErrorOccurred={!!error}
        loading={loading}
        loadingComponent={
          <Bars
            ariaLabel='bars-loading'
            color='#2563eb'
            height='80'
            visible={true}
            width='80'
            wrapperClass='justify-center'
          />
        }
      />
      {!loading && !error && (
        <section>
          {BASIC_INFORMATION_FORM_FIELDS_CONFIG.map(({ id, content }) => (
            <Fragment key={id}>{content}</Fragment>
          ))}
        </section>
      )}
    </div>
  );
};

export default BasicInformation;
