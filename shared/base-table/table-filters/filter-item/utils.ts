import { DropdownOption } from '@/shared/base-select/types';
import { FilterType } from '@/shared/base-table/types';

type FilterSelectionParams = {
  filterType: FilterType;
  filters: DropdownOption[];
  filterOption: DropdownOption;
};

export const getIsFilterSelected = ({ filterType, filters, filterOption }: FilterSelectionParams): boolean => {
  const isCheckboxSelected = filters.some((opt) => opt.value === filterOption.value) || false;

  const isRadioButtonSelected = filters[0]?.value === filterOption.value;

  return filterType === 'checkbox' ? isCheckboxSelected : isRadioButtonSelected;
};
