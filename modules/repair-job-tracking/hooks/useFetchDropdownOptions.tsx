import { useMemo } from 'react';

import { useQuery } from '@apollo/client';

import { GET_REPAIR_JOB_SCHEDULE_DATA } from '@/graphql/schemas/getRepairJobScheduleData';
import {
  Get_Repair_Job_Schedule_DataQuery,
  Get_Repair_Job_Schedule_DataQueryVariables,
} from '@/graphql/types/client/generated_types';
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
};

type UseFetchDropdownOptions = {
  loading: boolean;
  dropdownOptions: MultiStepDropdownOption;
  error?: string;
};

export const useFetchDropdownOptions = (): UseFetchDropdownOptions => {
  {
    const { data, error, loading } = useQuery<
      Get_Repair_Job_Schedule_DataQuery,
      Get_Repair_Job_Schedule_DataQueryVariables
    >(GET_REPAIR_JOB_SCHEDULE_DATA);

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
