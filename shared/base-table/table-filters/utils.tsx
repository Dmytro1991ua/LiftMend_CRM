import { FilterValues } from '@/shared/base-table/types';

export const getSelectedFiltersCount = (filterValues: FilterValues = {}) =>
  Object.values(filterValues).filter((filterArray) => filterArray.length > 0).length;

export const getSelectedFilterCountLabel = (label: string, selectedFilterCount: number): JSX.Element => {
  const selectedFiltersCountLabel = selectedFilterCount > 0 ? `(${selectedFilterCount})` : null;

  return (
    <>
      {label} <span className='font-bold'>{selectedFiltersCountLabel}</span>
    </>
  );
};

export const getAccordionHeight = (currentOpenedFilter: string | null, isAccordionAutoHeight: boolean) => {
  if (currentOpenedFilter && isAccordionAutoHeight) return 'h-auto';
  if (currentOpenedFilter) return 'h-[50rem] overflow-y-auto';

  return 'h-auto';
};
