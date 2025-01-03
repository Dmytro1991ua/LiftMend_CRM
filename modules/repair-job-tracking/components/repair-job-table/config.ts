import { FilterKey, FilterLabel, TableFiltersConfig } from '@/shared/base-table/types';
import { MultiStepDropdownOption } from '@/shared/hooks/useFetchDropdownOptions';

import { DEFAULT_RADIO_BUTTON_FILTER_OPTIONS } from './constants';

export const getRepairJobFilterConfig = (dropdownOptions: MultiStepDropdownOption): TableFiltersConfig[] => {
  return [
    {
      id: 1,
      label: FilterLabel.JobType,
      filterKey: FilterKey.RepairJobTypes,
      filterType: 'checkbox',
      options: dropdownOptions.repairJobTypes,
    },
    {
      id: 2,
      label: FilterLabel.JobPriority,
      filterKey: FilterKey.Priorities,
      filterType: 'checkbox',
      options: dropdownOptions.priorities,
    },
    {
      id: 3,
      label: FilterLabel.BuildingName,
      filterKey: FilterKey.BuildingNames,
      filterType: 'checkbox',
      options: dropdownOptions.buildingNames,
    },
    {
      id: 4,
      label: FilterLabel.ElevatorLocation,
      filterKey: FilterKey.ElevatorLocations,
      filterType: 'checkbox',
      options: dropdownOptions.elevatorLocations,
    },
    {
      id: 5,
      label: FilterLabel.ElevatorType,
      filterKey: FilterKey.ElevatorTypes,
      filterType: 'checkbox',
      options: dropdownOptions.elevatorTypes,
    },
    {
      id: 6,
      label: FilterLabel.Status,
      filterKey: FilterKey.Statuses,
      filterType: 'checkbox',
      options: dropdownOptions.statuses,
    },
    {
      id: 7,
      label: FilterLabel.TechnicianName,
      filterKey: FilterKey.TechnicianNames,
      filterType: 'checkbox',
      options: dropdownOptions.technicianNames,
    },
    {
      id: 8,
      label: FilterLabel.IsOverdue,
      filterKey: FilterKey.IsOverdue,
      filterType: 'radio',
      options: DEFAULT_RADIO_BUTTON_FILTER_OPTIONS,
    },
  ];
};
