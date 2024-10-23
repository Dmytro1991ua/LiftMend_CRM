import { useMemo } from 'react';

import { useFormContext } from 'react-hook-form';

import { GetElevatorRecordFormDataQuery } from '@/graphql/types/client/generated_types';
import FormInput from '@/shared/base-input/form-input';
import ControlledSingleSelect from '@/shared/base-select/components/controlled-single-select';
import ControlledSingleDatePicker from '@/shared/date-picker/components/controlled-single-date-picker/ControlledSingleDatePicker';
import EditEntityForm from '@/shared/edit-entity-form/EditEntityForm';
import { useFetchDropdownOptions } from '@/shared/hooks/useFetchDropdownOptions';
import { DropdownOptions } from '@/shared/hooks/useFetchDropdownOptions/config';
import { ElevatorRecord, FormFieldLabel, ItemConfig } from '@/shared/types';

import { ElevatorRecordFormValues } from '../../types';
import { convertElevatorRecordToFormValues } from '../../utils';

type EditElevatorRecordFormProps = {
  elevatorRecord: ElevatorRecord;
};

const EditElevatorRecordForm = ({ elevatorRecord }: EditElevatorRecordFormProps) => {
  const {
    dropdownOptions: { elevatorTypes, elevatorLocations, buildingNames, elevatorStatuses, technicianNames },
    loading,
    error,
  } = useFetchDropdownOptions<GetElevatorRecordFormDataQuery>(DropdownOptions.ElevatorManagement);

  const { clearErrors } = useFormContext<ElevatorRecordFormValues>();

  const currentElevatorRecord = useMemo(() => convertElevatorRecordToFormValues(elevatorRecord), [elevatorRecord]);

  const {
    elevatorType,
    buildingName,
    elevatorLocation,
    technicianName,
    status,
    lastMaintenanceDate,
    nextMaintenanceDate,
    capacity,
    contactInformation,
  } = currentElevatorRecord;

  const ELEVATOR_RECORD_FORM_FIELD_CONFIG: ItemConfig[] = [
    {
      id: 1,
      label: FormFieldLabel.BuildingName,
      content: (
        <ControlledSingleSelect<ElevatorRecordFormValues>
          captureMenuScroll={false}
          className='mb-4'
          clearErrors={clearErrors}
          defaultValue={buildingName}
          hasSearchInput={true}
          isMultiSelect={false}
          name='buildingName'
          options={buildingNames}
          placeholder='Select Building Name'
          searchInputPlaceholder='Search for Building Name...'
        />
      ),
      className: 'row-start-1 row-end-2 col-start-1 col-end-4',
    },
    {
      id: 2,
      label: FormFieldLabel.ElevatorType,
      content: (
        <ControlledSingleSelect<ElevatorRecordFormValues>
          captureMenuScroll={false}
          className='mb-4'
          clearErrors={clearErrors}
          defaultValue={elevatorType}
          hasSearchInput={true}
          isMultiSelect={false}
          name='elevatorType'
          options={elevatorTypes}
          placeholder='Select Elevator Type'
          searchInputPlaceholder='Search for Elevator Type...'
        />
      ),
      className: 'row-start-1 row-end-2 col-start-4 col-end-7',
    },

    {
      id: 3,
      label: FormFieldLabel.ElevatorLocation,
      content: (
        <ControlledSingleSelect<ElevatorRecordFormValues>
          captureMenuScroll={false}
          className='mb-4'
          clearErrors={clearErrors}
          defaultValue={elevatorLocation}
          hasSearchInput={true}
          isMultiSelect={false}
          name='elevatorLocation'
          options={elevatorLocations}
          placeholder='Select Elevator Location'
          searchInputPlaceholder='Search for Elevator Location...'
        />
      ),
      className: 'row-start-2 row-end-3 col-start-1 col-end-4',
    },
    {
      id: 4,
      label: FormFieldLabel.Status,
      content: (
        <ControlledSingleSelect<ElevatorRecordFormValues>
          captureMenuScroll={false}
          clearErrors={clearErrors}
          defaultValue={status}
          isMultiSelect={false}
          name='status'
          options={elevatorStatuses}
          placeholder='Select Elevator Maintenance Status'
        />
      ),
      className: 'row-start-2 row-end-3 col-start-4 col-end-7',
    },
    {
      id: 5,
      content: (
        <ControlledSingleDatePicker<ElevatorRecordFormValues>
          allowPastDates={true}
          className='mb-8'
          clearErrors={clearErrors}
          defaultValue={new Date(lastMaintenanceDate ?? '')}
          isDateRangeMode={false}
          label={FormFieldLabel.LastMaintenanceDate}
          name='lastMaintenanceDate'
          numberOfMonths={1}
        />
      ),
      className: 'row-start-3 row-end-4 col-start-1 col-end-4',
    },
    {
      id: 6,
      content: (
        <ControlledSingleDatePicker<ElevatorRecordFormValues>
          clearErrors={clearErrors}
          defaultValue={new Date(nextMaintenanceDate ?? '')}
          isDateRangeMode={false}
          label={FormFieldLabel.NextMaintenanceDate}
          name='nextMaintenanceDate'
          numberOfMonths={1}
        />
      ),
      className: 'row-start-3 row-end-4 col-start-4 col-end-7',
    },
    {
      id: 7,
      label: FormFieldLabel.TechnicianName,
      content: (
        <ControlledSingleSelect<ElevatorRecordFormValues>
          captureMenuScroll={false}
          className='mb-8'
          clearErrors={clearErrors}
          defaultValue={technicianName}
          hasSearchInput={true}
          isMultiSelect={false}
          name='technicianName'
          options={technicianNames}
          placeholder='Select Technician Name'
          searchInputPlaceholder='Search for Technician Name...'
        />
      ),
      className: 'row-start-4 row-end-5 col-start-1 col-end-7',
    },
    {
      id: 8,
      label: FormFieldLabel.Capacity,
      content: (
        <FormInput<ElevatorRecordFormValues>
          defaultValue={capacity}
          id='capacity'
          min={0}
          name='capacity'
          placeholder='Please provide a elevator capacity'
          type='number'
          onChange={() => clearErrors('capacity')}
        />
      ),
      className: 'row-start-6 row-end-7 col-start-1 col-end-4',
    },
    {
      id: 9,
      label: FormFieldLabel.ContactInformation,
      content: (
        <FormInput<ElevatorRecordFormValues>
          defaultValue={contactInformation}
          id='contactInformation'
          name='contactInformation'
          placeholder='Please provide a contact information'
          onChange={() => clearErrors('contactInformation')}
        />
      ),
      className: 'row-start-6 row-end-7 col-start-4 col-end-7',
    },
  ];

  return (
    <EditEntityForm<ElevatorRecordFormValues>
      error={error}
      fieldConfigs={ELEVATOR_RECORD_FORM_FIELD_CONFIG}
      formValues={currentElevatorRecord}
      loading={loading}
    />
  );
};

export default EditElevatorRecordForm;
