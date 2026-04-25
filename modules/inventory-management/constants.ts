import { FilterKey, FilterLabel, TableFiltersConfig } from '@/shared/base-table/types';
import {
  PREDEFINED_DROPDOWN_OPTIONS_CONFIG,
  PredefinedDropdownOptions,
} from '@/shared/hooks/useFetchDropdownOptions/config';

export const DEFAULT_INVENTORY_PART_MANAGEMENT_SEARCH_INPUT_PLACEHOLDER = 'Search by Record ID';
export const INVENTORY_PARTS_TABLE_FILTER_KEY_MAP: Record<string, string> = {
  statuses: 'status',
};
export const DEFAULT_INVENTORY_PARTS_TABLE_EMPTY_TABLE_MESSAGE =
  'No data available. Please create a new inventory in the table to keep track of it or apply different filter.';
export const INVENTORY_PART_FILTER_CONFIG: TableFiltersConfig[] = [
  {
    id: 1,
    label: FilterLabel.Status,
    filterKey: FilterKey.Statuses,
    filterType: 'checkbox',
    options: PREDEFINED_DROPDOWN_OPTIONS_CONFIG[PredefinedDropdownOptions.InventoryPartStatus],
  },
];
