import { Column, Row } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TestData, createMockColumn, createMockRow, createMockRowModel } from '@/mocks/tableMoks';
import ExportButton, { ExportButtonProps } from '@/shared/base-table/export-button/ExportButton';
import { TableNames } from '@/shared/types';

describe('ExportButton', () => {
  const mockTestData: TestData = {
    name: 'Joe',
    email: 'test@gmail.com',
    age: 30,
  };
  const mockRow = createMockRow('name', mockTestData);
  const mockRowModel = createMockRowModel([mockRow as Row<TestData>]);
  const mockColumns = [
    createMockColumn('name', 'name', 'Name', true),
    createMockColumn('email', 'email', 'Email', true),
    createMockColumn('age', 'age', 'Age', true),
  ];
  const mockTimeValue = new Date('2025-06-25T10:00:00').getTime();

  beforeAll(() => {
    jest.spyOn(Date, 'now').mockImplementation(() => mockTimeValue);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps: ExportButtonProps<TestData> = {
    rowModel: mockRowModel,
    columns: mockColumns as Column<TestData, unknown>[],
    tableName: TableNames.ElevatorManagementTable,
    isDisabled: false,
  };

  const ExportButtonComponent = (props?: Partial<ExportButtonProps<TestData>>) => (
    <ExportButton {...defaultProps} {...props} />
  );

  it('should render a regular button when isDisabled is true', () => {
    render(ExportButtonComponent({ isDisabled: true }));

    expect(screen.getByTestId('regular-btn')).toBeInTheDocument();
    expect(screen.queryByTestId('csv-link')).not.toBeInTheDocument();
  });

  it('should render a csv link when isDisabled is false', () => {
    render(ExportButtonComponent());

    expect(screen.getByTestId('csv-link')).toBeInTheDocument();
    expect(screen.queryByTestId('regular-btn')).not.toBeInTheDocument();
  });

  it('should set correct filename for Elevator Records table', () => {
    render(ExportButtonComponent());

    const link = screen.getByTestId('csv-link');

    expect(link).toHaveAttribute('download', 'ElevatorManagement_062525_1000AM.csv');
    expect(link).toHaveAttribute('download', expect.stringContaining('.csv'));
  });

  it('should set correct filename for Repair jobs table', () => {
    render(ExportButtonComponent({ tableName: TableNames.RepairJobsTable }));

    const link = screen.getByTestId('csv-link');

    expect(link).toHaveAttribute('download', 'RepairJobs_062525_1000AM.csv');
    expect(link).toHaveAttribute('download', expect.stringContaining('.csv'));
  });

  it('should set correct filename for Technician records table', () => {
    render(ExportButtonComponent({ tableName: TableNames.TechnicianManagementTable }));

    const link = screen.getByTestId('csv-link');

    expect(link).toHaveAttribute('download', 'TechnicianManagement_062525_1000AM.csv');
    expect(link).toHaveAttribute('download', expect.stringContaining('.csv'));
  });
  it('should trigger CSV download on click', async () => {
    render(ExportButtonComponent());

    const csvLink = screen.getByTestId('csv-link');

    await userEvent.click(csvLink);

    expect(csvLink).toBeInTheDocument();
    expect(csvLink).toHaveAttribute('href');
    expect(csvLink).toHaveAttribute('href', expect.stringMatching(/^data:text\/csv/));
  });
});
