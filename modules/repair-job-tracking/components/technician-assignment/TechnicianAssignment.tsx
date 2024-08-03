import { Fragment } from 'react';

import { useFormContext } from 'react-hook-form';

import BaseInput from '@/shared/base-input';
import ControlledMultiSelect from '@/shared/base-select/components/controlled-multi-select';
import ControlledSingleSelect from '@/shared/base-select/components/controlled-single-select';

import { FORM_FIELD_CONFIG } from '../../types';
import { RepairJobFromFields } from '../repair-job-tracking-from/validation';

const technicianNames = [
  { value: 'John Doe', label: 'John Doe' },
  { value: 'Jane Smith', label: 'Jane Smith' },
  { value: 'Alice Johnson', label: 'Alice Johnson' },
  { value: 'Michael Brown', label: 'Michael Brown' },
  { value: 'Emily Davis', label: 'Emily Davis' },
  { value: 'David Wilson', label: 'David Wilson' },
  { value: 'Laura Taylor', label: 'Laura Taylor' },
  { value: 'James Anderson', label: 'James Anderson' },
  { value: 'Sophia Martinez', label: 'Sophia Martinez' },
  { value: 'William Thomas', label: 'William Thomas' },
  { value: 'Charles Robinson', label: 'Charles Robinson' },
  { value: 'Olivia Lewis', label: 'Olivia Lewis' },
  { value: 'Benjamin Hall', label: 'Benjamin Hall' },
  { value: 'Ava Young', label: 'Ava Young' },
  { value: 'Lucas King', label: 'Lucas King' },
  { value: 'Mia Scott', label: 'Mia Scott' },
  { value: 'Ethan Green', label: 'Ethan Green' },
  { value: 'Isabella Adams', label: 'Isabella Adams' },
  { value: 'Matthew Nelson', label: 'Matthew Nelson' },
  { value: 'Chloe Carter', label: 'Chloe Carter' },
  { value: 'Daniel Walker', label: 'Daniel Walker' },
  { value: 'Grace Harris', label: 'Grace Harris' },
];

const technicianSkills = [
  { value: 'Electrical', label: 'Electrical' },
  { value: 'Mechanical', label: 'Mechanical' },
  { value: 'Hydraulic', label: 'Hydraulic' },
  { value: 'General Maintenance', label: 'General Maintenance' },
  { value: 'Safety Inspection', label: 'Safety Inspection' },
  { value: 'Troubleshooting', label: 'Troubleshooting' },
  { value: 'Installation', label: 'Installation' },
  { value: 'Repair', label: 'Repair' },
  { value: 'System Upgrades', label: 'System Upgrades' },
  { value: 'Routine Maintenance', label: 'Routine Maintenance' },
  { value: 'Emergency Response', label: 'Emergency Response' },
  { value: 'Customer Service', label: 'Customer Service' },
  { value: 'Quality Assurance', label: 'Quality Assurance' },
  { value: 'Problem Solving', label: 'Problem Solving' },
  { value: 'Project Management', label: 'Project Management' },
  { value: 'Technical Documentation', label: 'Technical Documentation' },
  { value: 'Welding', label: 'Welding' },
  { value: 'Blueprint Reading', label: 'Blueprint Reading' },
];

const TechnicianAssignment = () => {
  const { clearErrors } = useFormContext<RepairJobFromFields>();

  const TECHNICIAN_ASSIGNMENT_FORM_FIELDS_CONFIG: FORM_FIELD_CONFIG[] = [
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
        <BaseInput<RepairJobFromFields>
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
