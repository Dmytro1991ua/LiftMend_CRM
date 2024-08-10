import { Fragment } from 'react';

import { useFormContext } from 'react-hook-form';
import { Bars } from 'react-loader-spinner';

import BaseAlert from '@/shared/base-alert/BaseAlert';
import ControlledSingleSelect from '@/shared/base-select/components/controlled-single-select';
import QueryResponse from '@/shared/query-response';

import { useFetchDropdownOptions } from '../../hooks';
import { FORM_FIELD_CONFIG } from '../../types';
import { RepairJobFromFields } from '../repair-job-tracking-from/validation';

const ElevatorInformation = () => {
  const { clearErrors } = useFormContext<RepairJobFromFields>();

  const {
    dropdownOptions: { elevatorTypes, elevatorLocations, buildingNames },
    loading,
    error,
  } = useFetchDropdownOptions();

  const ELEVATOR_INFORMATION_FORM_FIELDS_CONFIG: FORM_FIELD_CONFIG[] = [
    {
      id: 1,
      content: (
        <ControlledSingleSelect<RepairJobFromFields>
          captureMenuScroll={false}
          className='mb-8'
          clearErrors={clearErrors}
          hasSearchInput={true}
          isMultiSelect={false}
          label='Elevator Type'
          name='elevatorInformation.elevatorType'
          options={elevatorTypes}
          placeholder='Select Elevator Type'
          searchInputPlaceholder='Search for Elevator Type...'
        />
      ),
    },
    {
      id: 2,
      content: (
        <ControlledSingleSelect<RepairJobFromFields>
          captureMenuScroll={false}
          className='mb-8'
          clearErrors={clearErrors}
          hasSearchInput={true}
          isMultiSelect={false}
          label='Building Name'
          name='elevatorInformation.buildingName'
          options={buildingNames}
          placeholder='Select Building Name'
          searchInputPlaceholder='Search for Building Name...'
        />
      ),
    },
    {
      id: 3,
      content: (
        <ControlledSingleSelect<RepairJobFromFields>
          captureMenuScroll={false}
          className='mb-8'
          clearErrors={clearErrors}
          hasSearchInput={true}
          isMultiSelect={false}
          label='Elevator Location'
          name='elevatorInformation.elevatorLocation'
          options={elevatorLocations}
          placeholder='Select Elevator Location'
          searchInputPlaceholder='Search for Elevator Location...'
        />
      ),
    },
  ];

  return (
    <>
      <QueryResponse
        errorComponent={
          <BaseAlert description={error} title='Failed to fetch elevator information data' variant='destructive' />
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
          {ELEVATOR_INFORMATION_FORM_FIELDS_CONFIG.map(({ id, content }) => (
            <Fragment key={id}>{content}</Fragment>
          ))}
        </section>
      )}
    </>
  );
};

export default ElevatorInformation;
