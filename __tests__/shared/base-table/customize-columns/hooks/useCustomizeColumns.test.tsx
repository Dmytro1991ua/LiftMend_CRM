import { Column } from '@tanstack/react-table';
import { RenderHookResult, act, renderHook } from '@testing-library/react-hooks';

import { TestData, createMockColumn } from '@/mocks/tableMoks';
import { UseCustomizeColumns, useCustomizeColumns } from '@/shared/base-table/customize-columns/hooks';

describe('useCustomizeColumns', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockToggle = jest.fn();

  const hook = (): RenderHookResult<unknown, UseCustomizeColumns<TestData>> =>
    renderHook(() => {
      const mockColumns = [
        createMockColumn('name', 'name', 'Name', true, true),
        createMockColumn('email', 'email', 'Email', false, true),
        createMockColumn('age', 'age', 'Age', true, false),
      ] as Column<TestData, unknown>[];

      return useCustomizeColumns(mockColumns);
    });

  it('should return initial visibility for each column based on getIsVisible()', () => {
    const { result } = hook();

    expect(result.current.visibleColumns).toEqual({
      email: false,
      name: true,
      age: true,
    });
  });

  it('should include only columns that have accessorFn and can be hidden in allAvailableColumns', () => {
    const { result } = hook();

    expect(result.current.allAvailableColumns).toHaveLength(2);
    expect(result.current.allAvailableColumns.map((col) => col.id)).toEqual(['name', 'email']);
  });

  it('should call toggleVisibility and update visibleColumns state when a column is toggled', () => {
    const { result } = hook();

    act(() => {
      result.current.onToggleColumnVisibility('email', mockToggle, true);
    });

    expect(mockToggle).toHaveBeenCalledWith(true);
    expect(result.current.visibleColumns.email).toBe(true);
  });

  it('should not affect visibility of other columns when toggling a single column', () => {
    const { result } = hook();

    act(() => {
      result.current.onToggleColumnVisibility('email', mockToggle, true);
    });

    expect(result.current.visibleColumns).toEqual({
      name: true,
      age: true,
      email: true,
    });
  });
});
