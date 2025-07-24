import { Fragment } from 'react';

import { useFormContext } from 'react-hook-form';

import { GetTechnicianRecordFormDataQuery } from '@/graphql/types/client/generated_types';
import ControlledMultiSelect from '@/shared/base-select/components/controlled-multi-select';
import { useFetchDropdownOptions } from '@/shared/hooks/useFetchDropdownOptions';
import { DropdownOptions } from '@/shared/hooks/useFetchDropdownOptions/config';
import { ItemConfig } from '@/shared/types';

import { TechnicianRecordFormFields } from '../../validation';

const SkillsAndCertifications = () => {
  const { clearErrors } = useFormContext<TechnicianRecordFormFields>();

  const {
    dropdownOptions: { skills, certifications },
  } = useFetchDropdownOptions<GetTechnicianRecordFormDataQuery>({ configKey: DropdownOptions.TechnicianManagement });

  const SKILLS_AND_CERTIFICATIONS_FORM_FIELDS_CONFIG: ItemConfig[] = [
    {
      id: 1,
      content: (
        <ControlledMultiSelect<TechnicianRecordFormFields>
          captureMenuScroll={false}
          className='mb-8'
          clearErrors={clearErrors}
          closeMenuOnScroll={false}
          closeMenuOnSelect={false}
          hasSearchInput={true}
          hideSelectedOptions={false}
          isMultiSelect={true}
          label='Technician Skill(s)'
          multipleSelectControls={true}
          name='skillsAndCertifications.skills'
          options={skills}
          placeholder='Select Technician Skills'
          searchInputPlaceholder='Search for Technician Skill(s)...'
        />
      ),
    },
    {
      id: 2,
      content: (
        <ControlledMultiSelect<TechnicianRecordFormFields>
          captureMenuScroll={false}
          className='mb-8'
          clearErrors={clearErrors}
          closeMenuOnScroll={false}
          closeMenuOnSelect={false}
          hasSearchInput={true}
          hideSelectedOptions={false}
          isMultiSelect={true}
          label='Technician Certificate(s)'
          multipleSelectControls={true}
          name='skillsAndCertifications.certifications'
          options={certifications}
          placeholder='Select Technician Certifications'
          searchInputPlaceholder='Search for Technician Certification(s)...'
        />
      ),
    },
  ];

  return (
    <section>
      {SKILLS_AND_CERTIFICATIONS_FORM_FIELDS_CONFIG.map(({ id, content }) => (
        <Fragment key={id}>{content}</Fragment>
      ))}
    </section>
  );
};

export default SkillsAndCertifications;
