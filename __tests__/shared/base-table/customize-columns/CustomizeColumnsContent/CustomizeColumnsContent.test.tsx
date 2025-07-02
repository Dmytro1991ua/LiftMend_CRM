import { Column } from '@tanstack/react-table';
import { fireEvent, render, screen } from '@testing-library/react';

import { TestData, createMockColumn } from '@/mocks/tableMoks';
import CustomizeColumnsContent from '@/shared/base-table/customize-columns/CustomizeColumnsContent';
import { useCustomizeColumns } from '@/shared/base-table/customize-columns/hooks';

jest.mock('@/shared/base-table/customize-columns/hooks');

describe('CustomizeColumnsContent', () => {
  const mockToggleVisibility = jest.fn();
  const mockOnToggleColumnVisibility = jest.fn();

  beforeEach(() => {
    (useCustomizeColumns as jest.Mock).mockReturnValue({
      allAvailableColumns: [
        {
          id: 'user_name',
          getIsVisible: () => true,
          toggleVisibility: mockToggleVisibility,
        },
        {
          id: 'email_address',
          getIsVisible: () => false,
          toggleVisibility: mockToggleVisibility,
        },
      ],
      visibleColumns: {
        user_name: true,
      },
      onToggleColumnVisibility: mockOnToggleColumnVisibility,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const CustomizeColumnsContentComponent = () => (
    <CustomizeColumnsContent
      columns={
        [createMockColumn('user_name', 'name', 'Name'), createMockColumn('email_address', 'age', 'Age')] as Column<
          TestData,
          unknown
        >[]
      }
    />
  );

  it('should render all columns with proper labels and checkbox states', () => {
    render(CustomizeColumnsContentComponent());

    expect(screen.getByText('User Name')).toBeInTheDocument();
    expect(screen.getByText('Email Address')).toBeInTheDocument();

    const checkboxes = screen.getAllByTestId('column-checkbox');
    expect(checkboxes).toHaveLength(2);

    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it('should call onToggleColumnVisibility on checkbox change', () => {
    render(CustomizeColumnsContentComponent());

    const checkboxes = screen.getAllByTestId('column-checkbox');

    fireEvent.click(checkboxes[1]);

    expect(mockOnToggleColumnVisibility).toHaveBeenCalledWith('email_address', mockToggleVisibility, true);
  });
});
