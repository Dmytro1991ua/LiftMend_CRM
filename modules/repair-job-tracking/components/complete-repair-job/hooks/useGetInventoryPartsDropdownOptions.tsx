import { useEffect, useMemo } from 'react';

import { useQuery } from '@apollo/client';

import { GET_INVENTORY_PARTS_DROPDOWN_OPTIONS } from '@/graphql/schemas/getInventoryPartsDropdownOptions';
import { GetInventoryPartsDropdownOptionsQuery } from '@/graphql/types/client/generated_types';
import { DropdownOption } from '@/shared/base-select/types';
import { useBaseToast } from '@/shared/hooks';
import { BaseToastVariant } from '@/shared/hooks/useBaseToast/types';
import { removeTypeNamesFromArray } from '@/shared/utils';

export type UseGetInventoryPartsDropdownOptions = {
  inventoryPartsOptions: DropdownOption[];
  isLoading: boolean;
};

export const DEFAULT_FAIL_FETCH_INVENTORY_PARTS_DROPDOWN_OPTIONS_MESSAGE =
  'Failed to fetch inventory parts dropdown options';

export const useGetInventoryPartsDropdownOptions = (skip?: boolean): UseGetInventoryPartsDropdownOptions => {
  const { data, error, loading } = useQuery<GetInventoryPartsDropdownOptionsQuery>(
    GET_INVENTORY_PARTS_DROPDOWN_OPTIONS,
    {
      skip,
    }
  );
  const { baseToast } = useBaseToast(BaseToastVariant.Error);

  useEffect(() => {
    if (error && error.message) {
      baseToast(DEFAULT_FAIL_FETCH_INVENTORY_PARTS_DROPDOWN_OPTIONS_MESSAGE, error.message);
    }
  }, [baseToast, error]);

  const inventoryPartsOptions = useMemo(
    () => removeTypeNamesFromArray<DropdownOption>(data?.getInventoryPartsDropdownOptions ?? []),
    [data]
  );

  return {
    inventoryPartsOptions,
    isLoading: loading,
  };
};
