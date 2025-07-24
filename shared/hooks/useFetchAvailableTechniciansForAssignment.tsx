import { useMemo } from 'react';

import { useQuery } from '@apollo/client';

import { GET_AVAILABLE_TECHNICIANS_FOR_ASSIGNMENT } from '@/graphql/schemas/getAvailableTechniciansForAssignment';
import {
  GetAvailableTechniciansForAssignmentQuery,
  GetAvailableTechniciansForAssignmentQueryVariables,
} from '@/graphql/types/client/generated_types';
import { DropdownOption } from '@/shared/base-select/types';
import { removeTypeNamesFromArray } from '@/shared/utils';

export type UseFetchAvailableTechniciansForAssignment = {
  availableTechnicians: DropdownOption[];
  loading: boolean;
  error?: string;
};

export const useFetchAvailableTechniciansForAssignment = (): UseFetchAvailableTechniciansForAssignment => {
  const { data, error, loading } = useQuery<
    GetAvailableTechniciansForAssignmentQuery,
    GetAvailableTechniciansForAssignmentQueryVariables
  >(GET_AVAILABLE_TECHNICIANS_FOR_ASSIGNMENT, {
    fetchPolicy: 'cache-and-network',
  });

  const availableTechnicians: DropdownOption[] = useMemo(
    () =>
      removeTypeNamesFromArray(data?.getAvailableTechniciansForAssignment ?? []).map(({ id, name }) => ({
        id,
        value: name,
        label: name,
      })),
    [data]
  );

  return {
    availableTechnicians,
    loading,
    error: error?.message,
  };
};
