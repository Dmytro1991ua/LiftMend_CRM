import { upperFirst as _upperFirst } from 'lodash';

import { FilterKey, FilterLabel, TableFiltersConfig } from '@/shared/base-table/types';
import { MultiStepDropdownOption } from '@/shared/hooks/useFetchDropdownOptions';
import { removeTypeNamesFromArray } from '@/shared/utils';

export const getChangeLogPageFiltersConfig = (dropdownOptions: MultiStepDropdownOption): TableFiltersConfig[] => {
  const { actions, entityTypes, users } = dropdownOptions;

  return [
    {
      id: 1,
      label: FilterLabel.ChangeLogAction,
      filterKey: FilterKey.ChangeLogAction,
      filterType: 'checkbox',
      options: actions.map((action) => ({
        ...action,
        label: _upperFirst(action.label),
      })),
    },
    {
      id: 2,
      label: FilterLabel.ChangeLogEntityType,
      filterKey: FilterKey.ChangeLogEntityType,
      filterType: 'checkbox',
      options: entityTypes,
    },
    {
      id: 3,
      label: FilterLabel.ChangeLogUser,
      filterKey: FilterKey.ChangeLogUserId,
      filterType: 'checkbox',
      options: removeTypeNamesFromArray(users),
    },
  ];
};
