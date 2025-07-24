import { useMemo } from 'react';

import { useQuery } from '@apollo/client';
import { get as _get } from 'lodash';

import { DropdownOption } from '@/shared/base-select/types';

import { convertQueryResponseToDropdownOptions } from '../utils';

import { DROPDOWN_OPTIONS_CONFIG, DropdownOptions } from './config';

export type MultiStepDropdownOption = Record<string, DropdownOption[]>;

export type UseFetchDropdownOptionsProps = {
  configKey: DropdownOptions;
  skip?: boolean;
  variables?: Record<string, string>;
};

export type UseFetchDropdownOptions = {
  loading: boolean;
  dropdownOptions: MultiStepDropdownOption;
  error?: string;
};

export const useFetchDropdownOptions = <T,>({
  configKey,
  skip,
  variables,
}: UseFetchDropdownOptionsProps): UseFetchDropdownOptions => {
  const { schema, queryName, fields, requiresVariable } = DROPDOWN_OPTIONS_CONFIG[configKey] || {};

  const requiredQueryVariables = requiresVariable && variables ? variables : undefined;

  const { data, error, loading } = useQuery<T>(schema, {
    variables: requiredQueryVariables,
    fetchPolicy: 'cache-first',
    skip,
  });

  const dropdownOptions: MultiStepDropdownOption = useMemo(() => {
    const queryNameData = _get(data, queryName, []) as Record<string, string[]>;

    return fields.reduce((acc, field) => {
      acc[field] = convertQueryResponseToDropdownOptions(queryNameData[field] ?? []);

      return acc;
    }, {} as MultiStepDropdownOption);
  }, [data, fields, queryName]);

  return {
    dropdownOptions,
    loading,
    error: error?.message,
  };
};
