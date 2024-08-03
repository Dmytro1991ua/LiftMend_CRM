import { Fragment } from 'react';

import { useFormContext } from 'react-hook-form';

import ControlledSingleSelect from '@/shared/base-select/components/controlled-single-select/ControlledSingleSelect';
import BaseTextarea from '@/shared/base-textarea';

import { FORM_FIELD_CONFIG } from '../../types';
import { RepairJobFromFields } from '../repair-job-tracking-from/validation';

// TODO Mocked Priority select options
const priorityOptions = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];

const jobTypes = [
  { value: 'repair', label: 'Repair' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'installation', label: 'Installation' },
  { value: 'inspection', label: 'Inspection' },
  { value: 'upgrade', label: 'Upgrade' },
  { value: 'emergency', label: 'Emergency Repair' },
  { value: 'routine', label: 'Routine Maintenance' },
  { value: 'consultation', label: 'Consultation' },
  { value: 'modernization', label: 'Modernization' },
  { value: 'compliance', label: 'Compliance Check' },
];

const JobDetails = () => {
  const { clearErrors } = useFormContext<RepairJobFromFields>();

  const JOB_DETAILS_FORM_FIELDS_CONFIG: FORM_FIELD_CONFIG[] = [
    {
      id: 1,
      content: (
        <ControlledSingleSelect<RepairJobFromFields>
          captureMenuScroll={false}
          className='mb-8'
          clearErrors={clearErrors}
          isMultiSelect={false}
          label='Job Type'
          name='jobDetails.jobType'
          options={jobTypes}
          placeholder='Select Job Type'
        />
      ),
    },
    {
      id: 2,
      content: (
        <BaseTextarea<RepairJobFromFields>
          id='jobDescription'
          label='Job Description'
          name='jobDetails.jobDescription'
          placeholder='Please provide a job description'
          wrapperClassName='mb-8'
          onChange={() => clearErrors('jobDetails.jobDescription')}
        />
      ),
    },
    {
      id: 3,
      content: (
        <ControlledSingleSelect<RepairJobFromFields>
          clearErrors={clearErrors}
          isMultiSelect={false}
          label='Priority'
          name='jobDetails.priority'
          options={priorityOptions}
          placeholder='Select Priority'
        />
      ),
    },
  ];

  return (
    <section>
      {JOB_DETAILS_FORM_FIELDS_CONFIG.map(({ id, content }) => (
        <Fragment key={id}>{content}</Fragment>
      ))}
    </section>
  );
};

export default JobDetails;
