import { Fragment } from 'react';

import { useFormContext } from 'react-hook-form';

import { GetRepairJobFromDataQuery } from '@/graphql/types/client/generated_types';
import FormInput from '@/shared/base-input/form-input';
import ControlledMultiSelect from '@/shared/base-select/components/controlled-multi-select';
import ControlledSingleSelect from '@/shared/base-select/components/controlled-single-select';
import { useFetchDropdownOptions } from '@/shared/hooks/useFetchDropdownOptions';
import { DropdownOptions } from '@/shared/hooks/useFetchDropdownOptions/config';
import { FormFieldConfig } from '@/shared/types';

import { RepairJobFromFields } from '../repair-job-tracking-from/validation';

const TechnicianAssignment = () => {
  const { clearErrors } = useFormContext<RepairJobFromFields>();

  const {
    dropdownOptions: { technicianNames, technicianSkills },
  } = useFetchDropdownOptions<GetRepairJobFromDataQuery>(DropdownOptions.RepairJob);

  const TECHNICIAN_ASSIGNMENT_FORM_FIELDS_CONFIG: FormFieldConfig[] = [
    {
      id: 1,
      content: (
        <ControlledSingleSelect<RepairJobFromFields>
          captureMenuScroll={false}
          className='mb-8'
          clearErrors={clearErrors}
          hasSearchInput={true}
          isMultiSelect={false}
          label='Technician Name'
          name='technicianAssignment.technicianName'
          options={technicianNames}
          placeholder='Select Technician Name'
          searchInputPlaceholder='Search for Technician name...'
        />
      ),
    },
    {
      id: 2,
      content: (
        <ControlledMultiSelect<RepairJobFromFields>
          captureMenuScroll={false}
          className='mb-8'
          clearErrors={clearErrors}
          closeMenuOnScroll={false}
          closeMenuOnSelect={false}
          hasSearchInput={true}
          hideSelectedOptions={false}
          isMultiSelect={true}
          label='Technician Skill(s)'
          name='technicianAssignment.technicianSkills'
          options={technicianSkills}
          placeholder='Select Technician Skills'
          searchInputPlaceholder='Search for Technician skill(s)...'
        />
      ),
    },
    {
      id: 3,
      content: (
        <FormInput<RepairJobFromFields>
          id='contactInformation'
          label='Technician Contact Information'
          name='technicianAssignment.contactInformation'
          placeholder='Please provide a contact information'
          onChange={() => clearErrors('technicianAssignment.contactInformation')}
        />
      ),
    },
  ];

  return (
    <section>
      {TECHNICIAN_ASSIGNMENT_FORM_FIELDS_CONFIG.map(({ id, content }) => (
        <Fragment key={id}>{content}</Fragment>
      ))}
    </section>
  );
};

export default TechnicianAssignment;
