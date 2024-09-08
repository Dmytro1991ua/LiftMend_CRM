import { Fragment } from 'react';

import { useFormContext } from 'react-hook-form';
import { Bars } from 'react-loader-spinner';

import BaseAlert from '@/shared/base-alert/BaseAlert';
import ControlledSingleSelect from '@/shared/base-select/components/controlled-single-select/ControlledSingleSelect';
import BaseTextarea from '@/shared/base-textarea';
import QueryResponse from '@/shared/query-response';
import { FormFieldConfig } from '@/shared/types';

import { useFetchDropdownOptions } from '../../hooks';
import { RepairJobFromFields } from '../repair-job-tracking-from/validation';

const JobDetails = () => {
  const { clearErrors } = useFormContext<RepairJobFromFields>();

  const {
    dropdownOptions: { repairJobTypes, priorities },
    loading,
    error,
  } = useFetchDropdownOptions();

  const JOB_DETAILS_FORM_FIELDS_CONFIG: FormFieldConfig[] = [
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

  return (
    <>
      <QueryResponse
        errorComponent={
          <BaseAlert description={error} title='Failed to fetch job details data' variant='destructive' />
        }
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
          {JOB_DETAILS_FORM_FIELDS_CONFIG.map(({ id, content }) => (
            <Fragment key={id}>{content}</Fragment>
          ))}
        </section>
      )}
    </>
  );
};

export default JobDetails;