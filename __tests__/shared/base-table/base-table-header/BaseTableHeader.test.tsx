import { render, screen } from '@testing-library/react';

import { TestData, createMockHeader, mockHeaderGroup } from '@/mocks/tableMoks';
import BaseTableHeader from '@/shared/base-table/base-table-header';
import { BaseTableHeaderProps } from '@/shared/base-table/base-table-header/BaseTableHeader';

describe('BaseTableHeader', () => {
  const mockHeaderGroups = [
    mockHeaderGroup('group1', [createMockHeader('name', 'Name', true), createMockHeader('age', 'Age')]),
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    headerGroups: [],
    columnVisibility: {},
  };

  const BaseTableHeaderComponent = (props?: Partial<BaseTableHeaderProps<TestData>>) => (
    <BaseTableHeader {...defaultProps} {...props} />
  );

  it('should render all visible headers', () => {
    render(BaseTableHeaderComponent({ headerGroups: mockHeaderGroups }));

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  it('should hide columns based on columnVisibility', () => {
    render(BaseTableHeaderComponent({ headerGroups: mockHeaderGroups, columnVisibility: { age: false } }));

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.queryByText('Age')).not.toBeInTheDocument();
  });

  it('should show sort arrow for sortable columns', () => {
    render(BaseTableHeaderComponent({ headerGroups: mockHeaderGroups }));

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getAllByTestId('sort-arrow')).toHaveLength(1);
  });
});
