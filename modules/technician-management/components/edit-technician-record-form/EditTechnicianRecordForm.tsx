import { useFormContext } from 'react-hook-form';

import { GetTechnicianRecordFormDataQuery } from '@/graphql/types/client/generated_types';
import FormInput from '@/shared/base-input/form-input';
import ControlledMultiSelect from '@/shared/base-select/components/controlled-multi-select';
import EditEntityForm from '@/shared/edit-entity-form/EditEntityForm';
import { useFetchDropdownOptions } from '@/shared/hooks/useFetchDropdownOptions';
import { DropdownOptions } from '@/shared/hooks/useFetchDropdownOptions/config';
import { FormFieldLabel, ItemConfig } from '@/shared/types';

import { EditTechnicalRecordFormValues, TechnicianRecordFormValues } from '../../types';

export type EditTechnicianRecordFormProps = {
  technicianRecordFormValues: EditTechnicalRecordFormValues;
};

const EditTechnicianRecordForm = ({ technicianRecordFormValues }: EditTechnicianRecordFormProps) => {
  const { clearErrors } = useFormContext<TechnicianRecordFormValues>();

  const {
    dropdownOptions: { skills: technicianSkills, certifications: technicianCertifications },
    loading,
    error,
  } = useFetchDropdownOptions<GetTechnicianRecordFormDataQuery>({ configKey: DropdownOptions.TechnicianManagement });

  const { contactInformation, name, skills, certifications } = technicianRecordFormValues;

  const TECHNICIAN_RECORD_FORM_FIELD_CONFIG: ItemConfig[] = [
    {
      id: 1,
      label: FormFieldLabel.FullName,
      content: (
        <FormInput<TechnicianRecordFormValues>
          defaultValue={name}
          id='name'
          name='name'
          placeholder='Please provide a full name'
          onChange={() => clearErrors('name')}
        />
      ),
      className: 'row-start-1 row-end-2 col-start-1 col-end-7',
    },
    {
      id: 2,
      label: FormFieldLabel.ContactInformation,
      content: (
        <FormInput<TechnicianRecordFormValues>
          defaultValue={contactInformation ?? ''}
          id='contactInformation'
          name='contactInformation'
          placeholder='Please provide a contact information'
          onChange={() => clearErrors('contactInformation')}
        />
      ),
      className: 'row-start-2 row-end-3 col-start-1 col-end-7',
    },
    {
      id: 3,
      label: FormFieldLabel.TechnicianSkill,
      content: (
        <ControlledMultiSelect<TechnicianRecordFormValues>
          captureMenuScroll={false}
          className='mb-8'
          clearErrors={clearErrors}
          closeMenuOnScroll={false}
          closeMenuOnSelect={false}
          defaultValue={skills ?? []}
          hasSearchInput={true}
          hideSelectedOptions={false}
          isMultiSelect={true}
          multipleSelectControls={true}
          name='skills'
          options={technicianSkills}
          placeholder='Select Technician Skills'
          searchInputPlaceholder='Search for Technician Skill(s)...'
        />
      ),
      className: 'row-start-3 row-end-4 col-start-1 col-end-7',
    },
    {
      id: 4,
      label: FormFieldLabel.Certifications,
      content: (
        <ControlledMultiSelect<TechnicianRecordFormValues>
          captureMenuScroll={false}
          className='mb-8'
          clearErrors={clearErrors}
          closeMenuOnScroll={false}
          closeMenuOnSelect={false}
          defaultValue={certifications ?? []}
          hasSearchInput={true}
          hideSelectedOptions={false}
          isMultiSelect={true}
          multipleSelectControls={true}
          name='certifications'
          options={technicianCertifications}
          placeholder='Select Technician Certificates'
          searchInputPlaceholder='Search for Technician Certificate(s)...'
        />
      ),
      className: 'row-start-4 row-end-5 col-start-1 col-end-7',
    },
  ];

  return (
    <EditEntityForm<EditTechnicalRecordFormValues>
      error={error}
      fieldConfigs={TECHNICIAN_RECORD_FORM_FIELD_CONFIG}
      formValues={technicianRecordFormValues}
      loading={loading}
    />
  );
};

export default EditTechnicianRecordForm;
