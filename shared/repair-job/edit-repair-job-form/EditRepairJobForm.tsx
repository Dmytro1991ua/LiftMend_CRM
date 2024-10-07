import { useEffect, useMemo } from 'react';

import { Controller, Form, useFormContext } from 'react-hook-form';
import { CirclesWithBar } from 'react-loader-spinner';

import { GetRepairJobFromDataQuery, RepairJob } from '@/graphql/types/client/generated_types';
import BaseAlert from '@/shared/base-alert/BaseAlert';
import FormInput from '@/shared/base-input/form-input';
import ControlledMultiSelect from '@/shared/base-select/components/controlled-multi-select';
import ControlledSingleSelect from '@/shared/base-select/components/controlled-single-select/ControlledSingleSelect';
import BaseTextarea from '@/shared/base-textarea';
import DatePicker from '@/shared/date-picker/DatePicker';
import { useFetchDropdownOptions } from '@/shared/hooks/useFetchDropdownOptions';
import { DropdownOptions } from '@/shared/hooks/useFetchDropdownOptions/config';
import QueryResponse from '@/shared/query-response';
import { formatScheduledDate } from '@/shared/utils';

import { convertRepairJobToFormValues } from '../../../modules/repair-job-details/utils';

import { FormFieldConfig, FormFieldLabel, RepairJobFormValues } from './types';

type EditRepairJobFormProps = {
  repairJob: RepairJob;
};

type FormFieldKeys = keyof RepairJobFormValues;

const EditRepairJobForm = ({ repairJob }: EditRepairJobFormProps) => {
  const {
    dropdownOptions: {
      repairJobTypes,
      priorities,
      elevatorLocations,
      elevatorTypes,
      buildingNames,
      technicianNames,
      technicianSkills,
      statuses,
    },
    loading,
    error,
  } = useFetchDropdownOptions<GetRepairJobFromDataQuery>(DropdownOptions.RepairJob);

  const { control, clearErrors, setValue } = useFormContext<RepairJobFormValues>();

  const currentRepairJob = useMemo(() => convertRepairJobToFormValues(repairJob), [repairJob]);

  // Sync form fields with the currentRepairJob object whenever it changes,
  // ensuring that the form displays the latest values for each field.
  useEffect(() => {
    Object.keys(currentRepairJob).forEach((key) => {
      setValue(key as keyof RepairJobFormValues, currentRepairJob[key as FormFieldKeys]);
    });
  }, [currentRepairJob, setValue]);

  const {
    jobType,
    jobPriority,
    scheduledDates,
    elevatorType,
    buildingName,
    elevatorLocation,
    technicianName,
    technicianSkill,
    contactInfo,
    jobDescription,
    status,
  } = currentRepairJob;

  const REPAIR_JOB_DETAILS_FORM_FIELD_CONFIG: FormFieldConfig[] = [
    {
      id: 1,
      label: FormFieldLabel.JobType,
      content: (
        <ControlledSingleSelect<RepairJobFormValues>
          captureMenuScroll={false}
          className='mb-4'
          defaultValue={jobType}
          isMultiSelect={false}
          name='jobType'
          options={repairJobTypes}
          placeholder='Select Job Type'
        />
      ),
      className: 'row-start-1 row-end-2 col-start-1 col-end-3',
    },
    {
      id: 2,
      label: FormFieldLabel.JobDescription,
      content: (
        <BaseTextarea<RepairJobFormValues>
          defaultValue={jobDescription}
          id='jobDescription'
          name='jobDescription'
          placeholder='Please provide a job description'
          wrapperClassName='mb-4'
        />
      ),
      className: 'row-start-2 row-end-3 col-start-1 col-end-7',
    },
    {
      id: 3,
      label: FormFieldLabel.JobPriority,
      content: (
        <ControlledSingleSelect<RepairJobFormValues>
          captureMenuScroll={false}
          className='mb-4'
          defaultValue={jobPriority}
          isMultiSelect={false}
          name='jobPriority'
          options={priorities}
          placeholder='Select Job Priority'
        />
      ),
      className: 'row-start-1 row-end-2 col-start-3 col-end-5',
    },
    {
      id: 4,
      label: FormFieldLabel.JobStatus,
      content: (
        <ControlledSingleSelect<RepairJobFormValues>
          captureMenuScroll={false}
          className='mb-4'
          defaultValue={status}
          isMultiSelect={false}
          name='status'
          options={statuses}
          placeholder='Select Job Status'
        />
      ),
      className: 'row-start-1 row-end-2 col-start-5 col-end-7',
    },
    {
      id: 5,
      label: FormFieldLabel.ScheduledDates,
      content: (
        <Controller
          control={control}
          defaultValue={scheduledDates}
          name='scheduledDates'
          render={({ field: { onChange } }) => (
            <DatePicker
              dateRange={scheduledDates}
              onChange={(range) => {
                const formattedRange = {
                  from: formatScheduledDate(range?.from),
                  to: formatScheduledDate(range?.to),
                };

                onChange(formattedRange);
              }}
            />
          )}
        />
      ),
      className: 'row-start-6 row-end-6 col-start-3 col-end-7 mt-1',
    },
    {
      id: 6,
      label: FormFieldLabel.ElevatorType,
      content: (
        <ControlledSingleSelect<RepairJobFormValues>
          captureMenuScroll={false}
          className='mb-4'
          defaultValue={elevatorType}
          isMultiSelect={false}
          name='elevatorType'
          options={elevatorTypes}
          placeholder='Select Elevator Type'
        />
      ),
      className: 'row-start-3 row-end-4 col-start-1 col-end-4',
    },
    {
      id: 7,
      label: FormFieldLabel.BuildingName,
      content: (
        <ControlledSingleSelect<RepairJobFormValues>
          captureMenuScroll={false}
          className='mb-4'
          defaultValue={buildingName}
          isMultiSelect={false}
          name='buildingName'
          options={buildingNames}
          placeholder='Select Building Name'
        />
      ),
      className: 'row-start-3 row-end-4 col-start-4 col-end-7',
    },
    {
      id: 8,
      label: FormFieldLabel.ElevatorLocation,
      content: (
        <ControlledSingleSelect<RepairJobFormValues>
          captureMenuScroll={false}
          className='mb-4'
          defaultValue={elevatorLocation}
          isMultiSelect={false}
          name='elevatorLocation'
          options={elevatorLocations}
          placeholder='Select Elevator Location'
        />
      ),
      className: 'row-start-4 row-end-5 col-start-1 col-end-4',
    },
    {
      id: 9,
      label: FormFieldLabel.TechnicianName,
      content: (
        <ControlledSingleSelect<RepairJobFormValues>
          captureMenuScroll={false}
          className='mb-4'
          defaultValue={technicianName}
          isMultiSelect={false}
          name='technicianName'
          options={technicianNames}
          placeholder='Select Technician Name'
        />
      ),
      className: 'row-start-4 row-end-5 col-start-4 col-end-7',
    },
    {
      id: 10,
      label: FormFieldLabel.TechnicianSkill,
      content: (
        <ControlledMultiSelect<RepairJobFormValues>
          captureMenuScroll={false}
          className='mb-4'
          clearErrors={clearErrors}
          closeMenuOnScroll={false}
          closeMenuOnSelect={false}
          defaultValue={technicianSkill ?? []}
          hasSearchInput={true}
          hideSelectedOptions={false}
          isMultiSelect={true}
          name='technicianSkill'
          options={technicianSkills}
          placeholder='Select Technician Skills'
          searchInputPlaceholder='Search for Technician skill(s)...'
        />
      ),
      className: 'row-start-5 row-end-5 col-start-1 col-end-7',
    },
    {
      id: 11,
      label: FormFieldLabel.ContactInformation,
      content: (
        <FormInput<RepairJobFormValues>
          defaultValue={contactInfo}
          id='contactInfo'
          name='contactInfo'
          placeholder='Please provide contact information'
          onChange={() => clearErrors('contactInfo')}
        />
      ),
      className: 'row-start-6 row-end-6 col-start-1 col-end-3',
    },
  ];

  return (
    <Form className='grid grid-cols-6 gap-2'>
      <QueryResponse
        errorComponent={
          <BaseAlert description={error} title='Failed to fetch job details data' variant='destructive' />
        }
        loading={loading}
        loadingComponent={
          <CirclesWithBar
            ariaLabel='bars-loading'
            color='#2563eb'
            height='70'
            visible={true}
            width='70'
            wrapperClass='row-start-1 row-end-7 col-start-1 col-end-7 justify-center items-center'
          />
        }
      />
      {!loading && !error && (
        <>
          {REPAIR_JOB_DETAILS_FORM_FIELD_CONFIG.map(({ id, label, className, content }) => (
            <div key={id} className={className}>
              <span className='block text-sm font-bold mb-2'>{label}</span>
              <>{content}</>
            </div>
          ))}
        </>
      )}
    </Form>
  );
};

export default EditRepairJobForm;
