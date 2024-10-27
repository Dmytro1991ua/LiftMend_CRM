import { Checkbox } from '@/components/ui/checkbox';
import { DropdownOption } from '@/shared/base-select/types';

type FilterOptionProps = {
  option: DropdownOption;
  isSelected: boolean;
  onFilterChange: () => void;
};

const FilterOption = ({ option, isSelected, onFilterChange }: FilterOptionProps) => (
  <div key={option.value} className='flex gap-2 p-2 border-b-[0.5px]'>
    <Checkbox checked={isSelected} id={option.value} onCheckedChange={onFilterChange} />
    <label className='text-sm font-semibold'>{option.label}</label>
  </div>
);

export default FilterOption;
