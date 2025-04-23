import { useFormContext } from 'react-hook-form';

import { GetElevatorRecordFormDataQuery } from '@/graphql/types/client/generated_types';
import FormInput from '@/shared/base-input/form-input';
import ControlledSingleSelect from '@/shared/base-select/components/controlled-single-select';
import InfoTooltip from '@/shared/base-tooltip/info-tooltip/InfoTooltip';
import ControlledSingleDatePicker from '@/shared/date-picker/components/controlled-single-date-picker/ControlledSingleDatePicker';
import EditEntityForm from '@/shared/edit-entity-form/EditEntityForm';
import { useFetchDropdownOptions } from '@/shared/hooks/useFetchDropdownOptions';
import { DropdownOptions } from '@/shared/hooks/useFetchDropdownOptions/config';
import { FormFieldLabel, ItemConfig } from '@/shared/types';

import { ElevatorRecordFormValues } from '../../types';

import {
  BUILDING_NAME_TOOLTIP_MESSAGE,
  ELEVATOR_CAPACITY_TOOLTIP_MESSAGE,
  ELEVATOR_LOCATION_TOOLTIP_MESSAGE,
  ELEVATOR_STATUS_TOOLTIP_MESSAGE,
  ELEVATOR_TYPE_TOOLTIP_MESSAGE,
  LAST_MAINTENANCE_DATE_TOOLTIP_MESSAGE,
} from './constants';

export type EditElevatorRecordFormProps = {
  elevatorRecordFormValues: ElevatorRecordFormValues;
};

const EditElevatorRecordForm = ({ elevatorRecordFormValues }: EditElevatorRecordFormProps) => {
  const {
    dropdownOptions: { elevatorTypes, elevatorLocations, buildingNames, elevatorStatuses },
    loading,
    error,
  } = useFetchDropdownOptions<GetElevatorRecordFormDataQuery>(DropdownOptions.ElevatorManagement);

  const { clearErrors } = useFormContext<ElevatorRecordFormValues>();

  const { elevatorType, buildingName, elevatorLocation, status, lastMaintenanceDate, nextMaintenanceDate, capacity } =
    elevatorRecordFormValues;

  const ELEVATOR_RECORD_FORM_FIELD_CONFIG: ItemConfig[] = [
    {
      id: 1,
      content: (
        <ControlledSingleSelect<ElevatorRecordFormValues>
          disabled
          captureMenuScroll={false}
          className='mb-4'
          clearErrors={clearErrors}
          defaultValue={buildingName}
          hasSearchInput={true}
          infoTooltip={
            <InfoTooltip
              className='w-[33rem]'
              iconColor='#2563eb'
              iconSize='14'
              id={'buildingName-field-id'}
              message={BUILDING_NAME_TOOLTIP_MESSAGE}
              place='right'
            />
          }
          isMultiSelect={false}
          label={FormFieldLabel.BuildingName}
          name='buildingName'
          options={buildingNames}
          placeholder='Select Building Name'
          searchInputPlaceholder='Search for Building Name...'
        />
      ),
      className: 'row-start-1 row-end-2 col-start-1 col-end-7',
    },
    {
      id: 2,
      content: (
        <ControlledSingleSelect<ElevatorRecordFormValues>
          disabled
          captureMenuScroll={false}
          className='mb-4'
          clearErrors={clearErrors}
          defaultValue={elevatorType}
          hasSearchInput={true}
          infoTooltip={
            <InfoTooltip
              className='w-[33rem]'
              iconColor='#2563eb'
              iconSize='14'
              id={'elevatorType-field-id'}
              message={ELEVATOR_TYPE_TOOLTIP_MESSAGE}
              place='right'
            />
          }
          isMultiSelect={false}
          label={FormFieldLabel.ElevatorType}
          name='elevatorType'
          options={elevatorTypes}
          placeholder='Select Elevator Type'
          searchInputPlaceholder='Search for Elevator Type...'
        />
      ),
      className: 'row-start-2 row-end-3 col-start-1 col-end-4',
    },

    {
      id: 3,
      content: (
        <ControlledSingleSelect<ElevatorRecordFormValues>
          disabled
          captureMenuScroll={false}
          className='mb-4'
          clearErrors={clearErrors}
          defaultValue={elevatorLocation}
          hasSearchInput={true}
          infoTooltip={
            <InfoTooltip
              className='w-[33rem]'
              iconColor='#2563eb'
              iconSize='14'
              id={'elevatorLocation-field-id'}
              message={ELEVATOR_LOCATION_TOOLTIP_MESSAGE}
              place='right'
            />
          }
          isMultiSelect={false}
          label={FormFieldLabel.ElevatorLocation}
          name='elevatorLocation'
          options={elevatorLocations}
          placeholder='Select Elevator Location'
          searchInputPlaceholder='Search for Elevator Location...'
        />
      ),
      className: 'row-start-2 row-end-3 col-start-4 col-end-7',
    },
    {
      id: 4,
      content: (
        <ControlledSingleSelect<ElevatorRecordFormValues>
          disabled
          captureMenuScroll={false}
          clearErrors={clearErrors}
          defaultValue={status}
          infoTooltip={
            <InfoTooltip
              className='w-[33rem]'
              iconColor='#2563eb'
              iconSize='14'
              id={'status-field-id'}
              message={ELEVATOR_STATUS_TOOLTIP_MESSAGE}
              place='right'
            />
          }
          isMultiSelect={false}
          label={FormFieldLabel.Status}
          name='status'
          options={elevatorStatuses}
          placeholder='Select Elevator Maintenance Status'
        />
      ),
      className: 'row-start-3 row-end-4 col-start-1 col-end-4',
    },
    {
      id: 5,
      content: (
        <FormInput<ElevatorRecordFormValues>
          disabled
          isLastElement
          defaultValue={capacity}
          id='capacity'
          infoTooltip={
            <InfoTooltip
              className='w-[33rem]'
              iconColor='#2563eb'
              iconSize='14'
              id={'capacity-field-id'}
              message={ELEVATOR_CAPACITY_TOOLTIP_MESSAGE}
              place='right'
            />
          }
          label={FormFieldLabel.Capacity}
          min={0}
          name='capacity'
          placeholder='Please provide a elevator capacity'
          type='number'
          onChange={() => clearErrors('capacity')}
        />
      ),
      className: 'row-start-3 row-end-4 col-start-4 col-end-7',
    },
    {
      id: 6,
      content: (
        <ControlledSingleDatePicker<ElevatorRecordFormValues>
          isDisabled
          allowPastDates={true}
          className='mb-4'
          clearErrors={clearErrors}
          defaultValue={new Date(lastMaintenanceDate ?? '')}
          infoTooltip={
            <InfoTooltip
              className='w-[33rem]'
              iconColor='#2563eb'
              iconSize='14'
              id={'lastMaintenanceDate-field-id'}
              message={LAST_MAINTENANCE_DATE_TOOLTIP_MESSAGE}
              place='right'
            />
          }
          isDateRangeMode={false}
          label={FormFieldLabel.LastMaintenanceDate}
          name='lastMaintenanceDate'
          numberOfMonths={1}
        />
      ),
      className: 'row-start-4 row-end-5 col-start-1 col-end-4',
    },
    {
      id: 7,
      content: (
        <ControlledSingleDatePicker<ElevatorRecordFormValues>
          className='mb-4'
          clearErrors={clearErrors}
          defaultValue={new Date(nextMaintenanceDate ?? '')}
          isDateRangeMode={false}
          label={FormFieldLabel.NextMaintenanceDate}
          name='nextMaintenanceDate'
          numberOfMonths={1}
        />
      ),
      className: 'row-start-4 row-end-5 col-start-4 col-end-7',
    },
  ];

  return (
    <EditEntityForm<ElevatorRecordFormValues>
      dataTestId='edit-elevator-record-form'
      error={error}
      fieldConfigs={ELEVATOR_RECORD_FORM_FIELD_CONFIG}
      formValues={elevatorRecordFormValues}
      loading={loading}
    />
  );
};

export default EditElevatorRecordForm;
