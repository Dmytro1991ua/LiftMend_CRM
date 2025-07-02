import { FilterKey, FilterLabel, TableFiltersConfig } from '@/shared/base-table/types';
import { MultiStepDropdownOption } from '@/shared/hooks/useFetchDropdownOptions';

export const getElevatorRecordFilterConfig = (dropdownOptions: MultiStepDropdownOption): TableFiltersConfig[] => {
  return [
    {
      id: 1,
      label: FilterLabel.BuildingName,
      filterKey: FilterKey.BuildingNames,
      filterType: 'checkbox',
      options: dropdownOptions.buildingNames,
    },
    {
      id: 2,
      label: FilterLabel.ElevatorType,
      filterKey: FilterKey.ElevatorTypes,
      filterType: 'checkbox',
      options: dropdownOptions.elevatorTypes,
    },
    {
      id: 3,
      label: FilterLabel.ElevatorLocation,
      filterKey: FilterKey.ElevatorLocations,
      filterType: 'checkbox',
      options: dropdownOptions.elevatorLocations,
    },
    {
      id: 4,
      label: FilterLabel.Status,
      filterKey: FilterKey.Statuses,
      filterType: 'checkbox',
      options: dropdownOptions.elevatorStatuses,
    },
  ];
};
