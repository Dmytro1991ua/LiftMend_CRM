import { Fragment } from 'react';

import { useFormContext } from 'react-hook-form';
import { Bars } from 'react-loader-spinner';

import { GetElevatorRecordFormDataQuery } from '@/graphql/types/client/generated_types';
import BaseAlert from '@/shared/base-alert/BaseAlert';
import FormInput from '@/shared/base-input/form-input';
import ControlledSingleSelect from '@/shared/base-select/components/controlled-single-select';
import { useFetchDropdownOptions } from '@/shared/hooks/useFetchDropdownOptions';
import { DropdownOptions } from '@/shared/hooks/useFetchDropdownOptions/config';
import QueryResponse from '@/shared/query-response';
import { FormFieldConfig } from '@/shared/types';

import { ElevatorRecordFormFields } from '../../validation';

const ElevatorDetails = () => {
  const { clearErrors } = useFormContext<ElevatorRecordFormFields>();

  const {
    dropdownOptions: { elevatorTypes, elevatorLocations, buildingNames },
    loading,
    error,
  } = useFetchDropdownOptions<GetElevatorRecordFormDataQuery>(DropdownOptions.ElevatorManagement);

  const ELEVATOR_DETAILS_FORM_FIELDS_CONFIG: FormFieldConfig[] = [
    {
      id: 1,
      content: (
        <ControlledSingleSelect<ElevatorRecordFormFields>
          captureMenuScroll={false}
          className='mb-8'
          clearErrors={clearErrors}
          hasSearchInput={true}
          isMultiSelect={false}
          label='Building Name'
          name='elevatorDetails.buildingName'
          options={buildingNames}
          placeholder='Select Building Name'
          searchInputPlaceholder='Search for Building Name...'
        />
      ),
    },
    {
      id: 2,
      content: (
        <ControlledSingleSelect<ElevatorRecordFormFields>
          captureMenuScroll={false}
          className='mb-8'
          clearErrors={clearErrors}
          hasSearchInput={true}
          isMultiSelect={false}
          label='Elevator Type'
          name='elevatorDetails.elevatorType'
          options={elevatorTypes}
          placeholder='Select Elevator Type'
          searchInputPlaceholder='Search for Elevator Type...'
        />
      ),
    },
    {
      id: 3,
      content: (
        <ControlledSingleSelect<ElevatorRecordFormFields>
          captureMenuScroll={false}
          className='mb-8'
          clearErrors={clearErrors}
          hasSearchInput={true}
          isMultiSelect={false}
          label='Elevator Location'
          name='elevatorDetails.elevatorLocation'
          options={elevatorLocations}
          placeholder='Select Elevator Location'
          searchInputPlaceholder='Search for Elevator Location...'
        />
      ),
    },
    {
      id: 4,
      content: (
        <FormInput<ElevatorRecordFormFields>
          id='capacity'
          label='Elevator Capacity'
          min={0}
          name='elevatorDetails.capacity'
          placeholder='Please provide a elevator capacity'
          type='number'
          onChange={() => clearErrors('elevatorDetails.capacity')}
        />
      ),
    },
  ];

  return (
    <div>
      <QueryResponse
        errorComponent={
          <BaseAlert description={error} title='Failed to fetch elevator details data' variant='destructive' />
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
          {ELEVATOR_DETAILS_FORM_FIELDS_CONFIG.map(({ id, content }) => (
            <Fragment key={id}>{content}</Fragment>
          ))}
        </section>
      )}
    </div>
  );
};

export default ElevatorDetails;
