import { useFormContext } from 'react-hook-form';

import BaseInput from '@/shared/base-input';
import ControlledSingleSelect from '@/shared/base-select/components/controlled-single-select/ControlledSingleSelect';
import BaseTextarea from '@/shared/base-textarea';

import { RepairJobFromFields } from '../repair-job-tracking-from/validation';

// TODO Mocked Priority select options
const priorityOptions = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];

const JobDetails = () => {
  const { clearErrors } = useFormContext<RepairJobFromFields>();

  return (
    <>
      <BaseInput<RepairJobFromFields>
        id='jobTitle'
        label='Job Title'
        name='jobTitle'
        placeholder='Please provide a job name'
        onChange={() => clearErrors('jobTitle')}
      />
      <BaseTextarea<RepairJobFromFields>
        id='jobDescription'
        label='Job Description'
        name='jobDescription'
        placeholder='Please provide a job description'
        wrapperClassName='mb-8'
        onChange={() => clearErrors('jobDescription')}
      />
      <ControlledSingleSelect
        clearErrors={clearErrors}
        isMultiSelect={false}
        label='Priority'
        name='priority'
        options={priorityOptions}
        placeholder='Select priority'
      />
    </>
  );
};

export default JobDetails;
