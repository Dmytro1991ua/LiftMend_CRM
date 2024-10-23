import { Fragment } from 'react';

import { useFormContext } from 'react-hook-form';

import { GetElevatorRecordFormDataQuery } from '@/graphql/types/client/generated_types';
import FormInput from '@/shared/base-input/form-input';
import ControlledSingleSelect from '@/shared/base-select/components/controlled-single-select';
import { useFetchDropdownOptions } from '@/shared/hooks/useFetchDropdownOptions';
import { DropdownOptions } from '@/shared/hooks/useFetchDropdownOptions/config';
import { ItemConfig } from '@/shared/types';

import { ElevatorRecordFormFields } from '../../validation';

const TechnicianInformation = () => {
  const { clearErrors } = useFormContext<ElevatorRecordFormFields>();

  const {
    dropdownOptions: { technicianNames },
  } = useFetchDropdownOptions<GetElevatorRecordFormDataQuery>(DropdownOptions.ElevatorManagement);

  const TECHNICIAN_INFORMATION_FORM_FIELDS_CONFIG: ItemConfig[] = [
    {
      id: 1,
      content: (
        <ControlledSingleSelect<ElevatorRecordFormFields>
          captureMenuScroll={false}
          className='mb-8'
          clearErrors={clearErrors}
          hasSearchInput={true}
          isMultiSelect={false}
          label='Technician Name'
          name='technicianInfo.technicianName'
          options={technicianNames}
          placeholder='Select Technician Name'
          searchInputPlaceholder='Search for Technician Name...'
        />
      ),
    },
    {
      id: 2,
      content: (
        <FormInput<ElevatorRecordFormFields>
          id='contactInformation'
          label='Technician Contact Information'
          name='technicianInfo.contactInformation'
          placeholder='Please provide a contact information'
          onChange={() => clearErrors('technicianInfo.contactInformation')}
        />
      ),
    },
  ];

  return (
    <section>
      {TECHNICIAN_INFORMATION_FORM_FIELDS_CONFIG.map(({ id, content }) => (
        <Fragment key={id}>{content}</Fragment>
      ))}
    </section>
  );
};

export default TechnicianInformation;
