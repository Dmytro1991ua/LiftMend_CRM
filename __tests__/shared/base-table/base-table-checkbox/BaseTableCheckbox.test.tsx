import { Table } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import BaseTableCheckbox from '@/shared/base-table/base-table-checkbox';
import { ElevatorRecord } from '@/shared/types';

describe('BaseTableCheckbox', () => {
  const mockGetIsAllPageRowsSelected = jest.fn();
  const mockGetIsSomePageRowsSelected = jest.fn();
  const mockToggleAllPageRowsSelected = jest.fn();

  const BaseTableCheckboxComponent = ({
    isAllSelected = false,
    isSomeSelected = false,
  }: {
    isAllSelected?: boolean;
    isSomeSelected?: boolean;
  }) => {
    mockGetIsAllPageRowsSelected.mockReturnValue(isAllSelected);
    mockGetIsSomePageRowsSelected.mockReturnValue(isSomeSelected);

    const mockTable = {
      getIsAllPageRowsSelected: mockGetIsAllPageRowsSelected,
      getIsSomePageRowsSelected: mockGetIsSomePageRowsSelected,
      toggleAllPageRowsSelected: mockToggleAllPageRowsSelected,
    } as unknown as Table<ElevatorRecord>;

    return <BaseTableCheckbox table={mockTable} />;
  };

  it('should render component without crashing', () => {
    render(BaseTableCheckboxComponent({}));

    expect(screen.getByTestId('base-table-checkbox')).toBeInTheDocument();
  });

  it('should be checked when all rows are selected', () => {
    render(BaseTableCheckboxComponent({ isAllSelected: true }));

    const checkbox = screen.getByTestId('base-table-checkbox');

    expect(checkbox).toBeChecked();
  });

  it('should be indeterminate when some rows are selected', () => {
    render(BaseTableCheckboxComponent({ isSomeSelected: true }));

    const checkbox = screen.getByTestId('base-table-checkbox');

    expect(checkbox).toHaveAttribute('data-state', 'indeterminate');
  });

  it('should be unchecked when no rows are selected', () => {
    render(BaseTableCheckboxComponent({}));

    const checkbox = screen.getByTestId('base-table-checkbox');

    expect(checkbox).not.toBeChecked();
    expect(checkbox).not.toHaveAttribute('data-state', 'indeterminate');
  });

  it('should toggle selection to true when clicked and currently unchecked', async () => {
    render(BaseTableCheckboxComponent({}));

    const checkbox = screen.getByTestId('base-table-checkbox');

    await userEvent.click(checkbox);

    expect(mockToggleAllPageRowsSelected).toHaveBeenCalledWith(true);
  });

  it('should toggle selection to false when clicked and currently checked', async () => {
    render(BaseTableCheckboxComponent({ isAllSelected: true }));

    const checkbox = screen.getByTestId('base-table-checkbox');

    await userEvent.click(checkbox);

    expect(mockToggleAllPageRowsSelected).toHaveBeenCalledWith(false);
  });
});
