import { Fragment } from 'react';

import { useFormContext } from 'react-hook-form';

import ControlledSingleSelect from '@/shared/base-select/components/controlled-single-select/ControlledSingleSelect';
import BaseTextarea from '@/shared/base-textarea';

import { useFetchDropdownOptions } from '../../hooks';
import { FORM_FIELD_CONFIG } from '../../types';
import { handleQueryResponse } from '../../utils';
import { RepairJobFromFields } from '../repair-job-tracking-from/validation';

const JobDetails = () => {
  const {
    dropdownOptions: { repairJobTypes, priorities },
    loading,
    error,
  } = useFetchDropdownOptions();

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
          options={repairJobTypes}
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
          options={priorities}
          placeholder='Select Priority'
        />
      ),
    },
  ];

  const queryResponse = handleQueryResponse({ loading, error });

  if (queryResponse) {
    return queryResponse;
  }

  return (
    <section>
      {JOB_DETAILS_FORM_FIELDS_CONFIG.map(({ id, content }) => (
        <Fragment key={id}>{content}</Fragment>
      ))}
    </section>
  );
};

export default JobDetails;
