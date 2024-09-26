import { MultiStepDropdownOption } from '@/modules/repair-job-scheduling/hooks';
import { FilterKey, FilterLabel, TableFiltersConfig } from '@/shared/base-table/types';

export const getRepairJobFilterConfig = (dropdownOptions: MultiStepDropdownOption): TableFiltersConfig[] => {
  return [
    {
      id: 1,
      label: FilterLabel.JobType,
      filterKey: FilterKey.RepairJobTypes,
      options: dropdownOptions.repairJobTypes,
    },
    {
      id: 2,
      label: FilterLabel.JobPriority,
      filterKey: FilterKey.Priorities,
      options: dropdownOptions.priorities,
    },
    {
      id: 3,
      label: FilterLabel.BuildingName,
      filterKey: FilterKey.BuildingNames,
      options: dropdownOptions.buildingNames,
    },
    {
      id: 4,
      label: FilterLabel.ElevatorLocation,
      filterKey: FilterKey.ElevatorLocations,
      options: dropdownOptions.elevatorLocations,
    },
    {
      id: 5,
      label: FilterLabel.ElevatorType,
      filterKey: FilterKey.ElevatorTypes,
      options: dropdownOptions.elevatorTypes,
    },
    {
      id: 6,
      label: FilterLabel.Status,
      filterKey: FilterKey.Statuses,
      options: dropdownOptions.statuses,
    },
    {
      id: 7,
      label: FilterLabel.TechnicianName,
      filterKey: FilterKey.TechnicianNames,
      options: dropdownOptions.technicianNames,
    },
  ];
};
