import { Fragment } from 'react';

import { useFormContext } from 'react-hook-form';

import ControlledSingleSelect from '@/shared/base-select/components/controlled-single-select';

import { FORM_FIELD_CONFIG } from '../../types';
import { RepairJobFromFields } from '../repair-job-tracking-from/validation';

const elevatorTypes = [
  { label: 'Passenger Elevator', value: 'passenger_elevator' },
  { label: 'Freight Elevator', value: 'freight_elevator' },
  { label: 'Service Elevator', value: 'service_elevator' },
  { label: 'Dumbwaiter', value: 'dumbwaiter' },
  { label: 'Home Lift', value: 'home_lift' },
  { label: 'Glass Elevator', value: 'glass_elevator' },
  { label: 'Hydraulic Elevator', value: 'hydraulic_elevator' },
  { label: 'Traction Elevator', value: 'traction_elevator' },
  { label: 'Inclined Elevator', value: 'inclined_elevator' },
  { label: 'Scissor Lift', value: 'scissor_lift' },
  { label: 'Vacuum Elevator', value: 'vacuum_elevator' },
  { label: 'Pneumatic Elevator', value: 'pneumatic_elevator' },
  { label: 'Rope-less Elevator', value: 'rope_less_elevator' },
  { label: 'Modular Elevator', value: 'modular_elevator' },
  { label: 'Miniature Elevator', value: 'miniature_elevator' },
  { label: 'Car Lift', value: 'car_lift' },
  { label: 'Observation Elevator', value: 'observation_elevator' },
  { label: 'Industrial Elevator', value: 'industrial_elevator' },
];

const buildingNames = [
  { value: 'Downtown Tower', label: 'Downtown Tower' },
  { value: 'Skyline Plaza', label: 'Skyline Plaza' },
  { value: 'Riverfront Complex', label: 'Riverfront Complex' },
  { value: 'Eastside Apartments', label: 'Eastside Apartments' },
  { value: 'Westview Mall', label: 'Westview Mall' },
  { value: 'City Hall', label: 'City Hall' },
  { value: 'The Grand Hotel', label: 'The Grand Hotel' },
  { value: 'Tech Park Offices', label: 'Tech Park Offices' },
  { value: 'Greenfield Hospital', label: 'Greenfield Hospital' },
  { value: 'Maplewood Community Center', label: 'Maplewood Community Center' },
  { value: 'Sunset Towers', label: 'Sunset Towers' },
  { value: 'Oceanview Condos', label: 'Oceanview Condos' },
];

const elevatorLocations = [
  { value: '1st Floor', label: '1st Floor' },
  { value: '2nd Floor', label: '2nd Floor' },
  { value: '3rd Floor', label: '3rd Floor' },
  { value: 'Basement', label: 'Basement' },
  { value: 'Rooftop', label: 'Rooftop' },
  { value: 'Lobby', label: 'Lobby' },
  { value: 'Parking Garage', label: 'Parking Garage' },
  { value: 'Mechanical Room', label: 'Mechanical Room' },
  { value: 'Service Level', label: 'Service Level' },
  { value: 'Penthouse', label: 'Penthouse' },
  { value: 'Lower Level', label: 'Lower Level' },
  { value: 'Ground Floor', label: 'Ground Floor' },
  { value: 'Sub-Basement', label: 'Sub-Basement' },
  { value: 'Sky Bridge', label: 'Sky Bridge' },
];

const ElevatorInformation = () => {
  const { clearErrors } = useFormContext<RepairJobFromFields>();

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
    <section>
      {ELEVATOR_INFORMATION_FORM_FIELDS_CONFIG.map(({ id, content }) => (
        <Fragment key={id}>{content}</Fragment>
      ))}
    </section>
  );
};

export default ElevatorInformation;
