import { Column } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TestData, createMockColumn } from '@/mocks/tableMoks';
import CustomizeColumns from '@/shared/base-table/customize-columns';

describe('CustomizeColumns', () => {
  const mockColumns = [
    createMockColumn('name', 'name', 'Name', true, true),
    createMockColumn('email', 'email', 'Email', false, true),
  ] as Column<TestData, unknown>[];

  afterEach(() => {
    jest.clearAllMocks();
  });

  const CustomizeColumnsComponent = () => <CustomizeColumns columns={mockColumns} />;

  it('should render component without crashing', () => {
    render(CustomizeColumnsComponent());

    expect(screen.getByText('Customize Columns')).toBeInTheDocument();
  });

  it('should show columns in dropdown options on Customize Columns button click', async () => {
    render(CustomizeColumnsComponent());

    const customizeColumnsBtn = screen.getByText('Customize Columns');

    await userEvent.click(customizeColumnsBtn);

    expect(screen.getByText('Toggle columns')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });
});
