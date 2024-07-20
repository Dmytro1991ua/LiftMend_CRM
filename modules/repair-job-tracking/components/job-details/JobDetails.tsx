import BaseInput from '@/shared/base-input';
import BaseTextarea from '@/shared/base-textarea';

import { RepairJobFromFields } from '../repair-job-tracking-from/validation';

const JobDetails = () => {
  return (
    <>
      <BaseInput<RepairJobFromFields>
        id='jobTitle'
        label='Job Title'
        name='jobTitle'
        placeholder='Please provide a job name'
      />
      <BaseTextarea<RepairJobFromFields>
        id='jobDescription'
        label='Job Description'
        name='jobDescription'
        placeholder='Please provide a job description'
      />
    </>
  );
};

export default JobDetails;
