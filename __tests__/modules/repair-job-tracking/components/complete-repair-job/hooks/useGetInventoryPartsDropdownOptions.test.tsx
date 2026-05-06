import { useQuery } from '@apollo/client';
import { renderHook } from '@testing-library/react-hooks';

import { GET_INVENTORY_PARTS_DROPDOWN_OPTIONS } from '@/graphql/schemas/getInventoryPartsDropdownOptions';
import { MockProviderHook } from '@/mocks/testMocks';
import {
  DEFAULT_FAIL_FETCH_INVENTORY_PARTS_DROPDOWN_OPTIONS_MESSAGE,
  useGetInventoryPartsDropdownOptions,
} from '@/modules/repair-job-tracking/components/complete-repair-job/hooks';
import { useBaseToast } from '@/shared/hooks';
import { removeTypeNamesFromArray } from '@/shared/utils';

jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useQuery: jest.fn(),
}));

jest.mock('@/shared/hooks', () => ({
  useBaseToast: jest.fn(),
}));

jest.mock('@/shared/utils', () => ({
  ...jest.requireActual('@/shared/utils'),
  removeTypeNamesFromArray: jest.fn(),
}));

describe('useGetInventoryPartsDropdownOptions', () => {
  const mockUseQuery = useQuery as jest.Mock;
  const mockUseBaseToast = useBaseToast as jest.Mock;
  const mockRemoveTypeNamesFromArray = removeTypeNamesFromArray as jest.Mock;
  const mockBaseToast = jest.fn();

  const mockOptions = [
    { label: 'Part A', value: 'part-a' },
    { label: 'Part B', value: 'part-b' },
  ];

  beforeEach(() => {
    mockUseBaseToast.mockReturnValue({ baseToast: mockBaseToast });
    mockRemoveTypeNamesFromArray.mockReturnValue(mockOptions);
    mockUseQuery.mockReturnValue({ data: undefined, error: undefined, loading: false });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (skip?: boolean) =>
    renderHook(() => useGetInventoryPartsDropdownOptions(skip), {
      wrapper: ({ children }) => <MockProviderHook mocks={[]}>{children}</MockProviderHook>,
    });

  it('should return inventory parts options', () => {
    mockUseQuery.mockReturnValue({
      data: { getInventoryPartsDropdownOptions: mockOptions },
      error: undefined,
      loading: false,
    });

    const { result } = hook();

    expect(result.current.inventoryPartsOptions).toEqual(mockOptions);
  });

  it('should return isLoading as true when query is loading', () => {
    mockUseQuery.mockReturnValue({ data: undefined, error: undefined, loading: true });

    const { result } = hook();

    expect(result.current.isLoading).toBe(true);
  });

  it('should return isLoading as false when query is not loading', () => {
    const { result } = hook();

    expect(result.current.isLoading).toBe(false);
  });

  it('should call baseToast with error message when query fails', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      error: { message: 'Something went wrong' },
      loading: false,
    });

    hook();

    expect(mockBaseToast).toHaveBeenCalledWith(
      DEFAULT_FAIL_FETCH_INVENTORY_PARTS_DROPDOWN_OPTIONS_MESSAGE,
      'Something went wrong'
    );
  });

  it('should not call baseToast when there is no error', () => {
    hook();

    expect(mockBaseToast).not.toHaveBeenCalled();
  });

  it('should return empty array when data is undefined', () => {
    mockRemoveTypeNamesFromArray.mockReturnValue([]);
    mockUseQuery.mockReturnValue({ data: undefined, error: undefined, loading: false });

    const { result } = hook();

    expect(result.current.inventoryPartsOptions).toEqual([]);
  });

  it('should skip query when skip is true', () => {
    hook(true);

    expect(mockUseQuery).toHaveBeenCalledWith(GET_INVENTORY_PARTS_DROPDOWN_OPTIONS, { skip: true });
  });
});
