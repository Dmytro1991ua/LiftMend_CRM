import { Fragment } from 'react';

import { useFormContext } from 'react-hook-form';

import { GetRepairJobFromDataQuery } from '@/graphql/types/client/generated_types';
import ControlledSingleSelect from '@/shared/base-select/components/controlled-single-select';
import { useFetchDropdownOptions } from '@/shared/hooks/useFetchDropdownOptions';
import { DropdownOptions } from '@/shared/hooks/useFetchDropdownOptions/config';
import { ItemConfig } from '@/shared/types';

import { RepairJobFromFields } from '../repair-job-tracking-from/validation';

const ElevatorInformation = () => {
  const { clearErrors } = useFormContext<RepairJobFromFields>();

  const {
    dropdownOptions: { elevatorTypes, elevatorLocations, buildingNames },
  } = useFetchDropdownOptions<GetRepairJobFromDataQuery>(DropdownOptions.RepairJob);

  const ELEVATOR_INFORMATION_FORM_FIELDS_CONFIG: ItemConfig[] = [
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
    <section>
      {ELEVATOR_INFORMATION_FORM_FIELDS_CONFIG.map(({ id, content }) => (
        <Fragment key={id}>{content}</Fragment>
      ))}
    </section>
  );
};

export default ElevatorInformation;
