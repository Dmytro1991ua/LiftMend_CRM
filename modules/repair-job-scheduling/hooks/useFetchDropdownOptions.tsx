import { useMemo } from 'react';

import { useQuery } from '@apollo/client';

import { GET_REPAIR_JOB_FORM_DATA } from '@/graphql/schemas/getRepairJobFormData';
import { GetRepairJobByIdQueryVariables, GetRepairJobFromDataQuery } from '@/graphql/types/client/generated_types';
import { DropdownOption } from '@/shared/base-select/types';

import { convertQueryResponseToDropdownOptions } from '../utils';

export type MultiStepDropdownOption = {
  repairJobTypes: DropdownOption[];
  elevatorTypes: DropdownOption[];
  buildingNames: DropdownOption[];
  elevatorLocations: DropdownOption[];
  technicianNames: DropdownOption[];
  technicianSkills: DropdownOption[];
  priorities: DropdownOption[];
  statuses: DropdownOption[];
};

type UseFetchDropdownOptions = {
  loading: boolean;
  dropdownOptions: MultiStepDropdownOption;
  error?: string;
};

export const useFetchDropdownOptions = (): UseFetchDropdownOptions => {
  {
    const { data, error, loading } = useQuery<GetRepairJobFromDataQuery, GetRepairJobByIdQueryVariables>(
      GET_REPAIR_JOB_FORM_DATA,
      { fetchPolicy: 'cache-first' }
    );

    const dropdownOptions: MultiStepDropdownOption = useMemo(() => {
      // Define the fields to be converted to dropdown options
      const fields: (keyof MultiStepDropdownOption)[] = [
        'repairJobTypes',
        'elevatorTypes',
        'buildingNames',
        'elevatorLocations',
        'technicianNames',
        'technicianSkills',
        'priorities',
        'statuses',
      ];

      // Reduce the fields to an object with converted dropdown options
      return fields.reduce((acc, field) => {
        acc[field] = convertQueryResponseToDropdownOptions(data?.getRepairJobScheduleData[field] ?? []);

        return acc;
      }, {} as MultiStepDropdownOption);
    }, [data]);

    return {
      dropdownOptions,
      loading,
      error: error?.message,
    };
  }
};
