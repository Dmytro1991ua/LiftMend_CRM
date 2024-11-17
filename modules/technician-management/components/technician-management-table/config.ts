import { FilterKey, FilterLabel, TableFiltersConfig } from '@/shared/base-table/types';
import { MultiStepDropdownOption } from '@/shared/hooks/useFetchDropdownOptions';

export const getTechnicianRecordFilterConfig = (dropdownOptions: MultiStepDropdownOption): TableFiltersConfig[] => {
  return [
    {
      id: 1,
      label: FilterLabel.AvailableStatus,
      filterKey: FilterKey.AvailableStatuses,
      options: dropdownOptions.availabilityStatuses,
    },
    {
      id: 2,
      label: FilterLabel.EmploymentStatus,
      filterKey: FilterKey.EmploymentStatuses,
      options: dropdownOptions.employmentStatuses,
    },
    {
      id: 3,
      label: FilterLabel.TechnicianSkills,
      filterKey: FilterKey.TechnicianSkills,
      options: dropdownOptions.skills,
    },
    {
      id: 4,
      label: FilterLabel.Certifications,
      filterKey: FilterKey.Certifications,
      options: dropdownOptions.certifications,
    },
  ];
};
