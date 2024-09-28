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

export const convertStoredFiltersToQueryFormat = (
  filterValues: FilterValues,
  filterKeyMap: Record<string, string>
): Record<string, string[]> =>
  Object.fromEntries(
    Object.entries(filterValues || {}).map(([key, value]) => {
      // map stored filter key to query filter key
      const queryFilterKey = filterKeyMap[key] || key;

      // transform dropdown value to array for GraphQL query format (e.g., ['value1', 'value2'])
      const transformedValue = value.map?.((item) => item.value) || value;

      return [queryFilterKey, transformedValue];
    })
  );
