import { FilterKey, FilterLabel, TableFiltersConfig } from '@/shared/base-table/types';
import { MultiStepDropdownOption } from '@/shared/hooks/useFetchDropdownOptions';

export const getElevatorRecordFilterConfig = (dropdownOptions: MultiStepDropdownOption): TableFiltersConfig[] => {
  return [
    {
      id: 1,
      label: FilterLabel.BuildingName,
      filterKey: FilterKey.BuildingNames,
      options: dropdownOptions.buildingNames,
    },
    {
      id: 2,
      label: FilterLabel.ElevatorType,
      filterKey: FilterKey.ElevatorTypes,
      options: dropdownOptions.elevatorTypes,
    },
    {
      id: 3,
      label: FilterLabel.ElevatorLocation,
      filterKey: FilterKey.ElevatorLocations,
      options: dropdownOptions.elevatorLocations,
    },
    {
      id: 4,
      label: FilterLabel.Status,
      filterKey: FilterKey.Statuses,
      options: dropdownOptions.elevatorStatuses,
    },
  ];
};
