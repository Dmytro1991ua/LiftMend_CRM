import { useFormContext } from 'react-hook-form';

import { GetRepairJobFromDataQuery } from '@/graphql/types/client/generated_types';
import ControlledSingleSelect from '@/shared/base-select/components/controlled-single-select/ControlledSingleSelect';
import BaseTextarea from '@/shared/base-textarea';
import InfoTooltip from '@/shared/base-tooltip/info-tooltip/InfoTooltip';
import ControlledDateRangePicker from '@/shared/date-picker/components/controlled-date-range-picker';
import EditEntityForm from '@/shared/edit-entity-form/EditEntityForm';
import { useFetchDropdownOptions } from '@/shared/hooks/useFetchDropdownOptions';
import { DropdownOptions } from '@/shared/hooks/useFetchDropdownOptions/config';
import { FormFieldLabel, ItemConfig } from '@/shared/types';

import { ELEVATOR_DETAILS_TOOLTIP, JOB_TYPE_TOOLTIP } from './constants';
import { RepairJobFormValues } from './types';

type EditRepairJobFormProps = {
  repairJobFormValues: RepairJobFormValues;
};

const EditRepairJobForm = ({ repairJobFormValues }: EditRepairJobFormProps) => {
  const {
    dropdownOptions: { repairJobTypes, priorities, elevatorLocations, elevatorTypes, buildingNames, statuses },
    loading,
    error,
  } = useFetchDropdownOptions<GetRepairJobFromDataQuery>(DropdownOptions.RepairJob);

  const { clearErrors } = useFormContext<RepairJobFormValues>();

  const { jobType, jobPriority, scheduledDates, elevatorType, buildingName, elevatorLocation, jobDescription, status } =
    repairJobFormValues;

  const REPAIR_JOB_FORM_FIELD_CONFIG: ItemConfig[] = [
    {
      id: 1,
      content: (
        <ControlledSingleSelect<RepairJobFormValues>
          disabled
          captureMenuScroll={false}
          className='mb-4'
          clearErrors={clearErrors}
          defaultValue={jobType}
          infoTooltip={
            <InfoTooltip
              className='w-[33rem]'
              iconColor='#2563eb'
              iconSize='14'
              id={'job-type-field-id'}
              message={JOB_TYPE_TOOLTIP}
              place='right'
            />
          }
          isMultiSelect={false}
          label='Job Type'
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
          clearErrors={clearErrors}
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
          clearErrors={clearErrors}
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
        <ControlledDateRangePicker clearErrors={clearErrors} defaultValue={scheduledDates} name='scheduledDates' />
      ),

      className: 'row-start-6 row-end-6 col-start-1 col-end-7',
    },
    {
      id: 6,
      content: (
        <ControlledSingleSelect<RepairJobFormValues>
          disabled
          captureMenuScroll={false}
          className='mb-4'
          clearErrors={clearErrors}
          defaultValue={elevatorType}
          infoTooltip={
            <InfoTooltip
              className='w-[33rem]'
              iconColor='#2563eb'
              iconSize='14'
              id={'elevator-type-field-id'}
              message={ELEVATOR_DETAILS_TOOLTIP}
              place='right'
            />
          }
          isMultiSelect={false}
          label='Elevator Type'
          name='elevatorType'
          options={elevatorTypes}
          placeholder='Select Elevator Type'
        />
      ),
      className: 'row-start-3 row-end-4 col-start-1 col-end-4',
    },
    {
      id: 7,
      content: (
        <ControlledSingleSelect<RepairJobFormValues>
          disabled
          captureMenuScroll={false}
          className='mb-4'
          clearErrors={clearErrors}
          defaultValue={buildingName}
          infoTooltip={
            <InfoTooltip
              className='w-[33rem]'
              iconColor='#2563eb'
              iconSize='14'
              id={'building-name-field-id'}
              message={ELEVATOR_DETAILS_TOOLTIP}
              place='left'
            />
          }
          isMultiSelect={false}
          label='Building Name'
          name='buildingName'
          options={buildingNames}
          placeholder='Select Building Name'
        />
      ),
      className: 'row-start-3 row-end-4 col-start-4 col-end-7',
    },
    {
      id: 8,
      content: (
        <ControlledSingleSelect<RepairJobFormValues>
          disabled
          captureMenuScroll={false}
          className='mb-4'
          clearErrors={clearErrors}
          defaultValue={elevatorLocation}
          infoTooltip={
            <InfoTooltip
              className='w-[33rem]'
              iconColor='#2563eb'
              iconSize='14'
              id={'elevator-location-field-id'}
              message={ELEVATOR_DETAILS_TOOLTIP}
              place='right'
            />
          }
          isMultiSelect={false}
          label='Elevator Location'
          name='elevatorLocation'
          options={elevatorLocations}
          placeholder='Select Elevator Location'
        />
      ),
      className: 'row-start-4 row-end-5 col-start-1 col-end-7',
    },
  ];

  return (
    <EditEntityForm<RepairJobFormValues>
      error={error}
      fieldConfigs={REPAIR_JOB_FORM_FIELD_CONFIG}
      formValues={repairJobFormValues}
      loading={loading}
    />
  );
};

export default EditRepairJobForm;
