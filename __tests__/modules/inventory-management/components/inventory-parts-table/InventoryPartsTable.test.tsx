import * as apollo from '@apollo/client';
import { render, screen } from '@testing-library/react';

import {
  mockDoorSensorInventoryPart,
  mockDoorSensorInventoryPartId,
  mockInventoryParts,
  mockRubberBufferInventoryPart,
  mockRubberBufferInventoryPartId,
} from '@/mocks/inventoryPartMocks';
import { withRouterAndApolloProvider } from '@/mocks/testMocks';
import InventoryPartsTable from '@/modules/inventory-management/components/inventory-parts-table';
import { AppRoutes } from '@/types/enums';

describe('InventoryPartsTable', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const InventoryPartsTableComponent = () =>
    withRouterAndApolloProvider(<InventoryPartsTable />, AppRoutes.InventoryManagement, [mockInventoryParts]);

  it('should render component without crashing', () => {
    render(InventoryPartsTableComponent());

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('Export to CSV')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search by Record ID')).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render correct column headers', async () => {
    render(InventoryPartsTableComponent());

    const columnHeaders = screen.getAllByRole('columnheader');

    expect(columnHeaders).toHaveLength(6);

    expect(columnHeaders[0]).toHaveTextContent('');
    expect(columnHeaders[1]).toHaveTextContent('Record Id');
    expect(columnHeaders[2]).toHaveTextContent('Name');
    expect(columnHeaders[3]).toHaveTextContent('Stock');
    expect(columnHeaders[4]).toHaveTextContent('Unit Price');
    expect(columnHeaders[5]).toHaveTextContent('Status');
  });

  it('should render correct table cells', async () => {
    jest.spyOn(apollo, 'useQuery').mockImplementation(() => {
      return {
        data: {
          getInventoryParts: {
            edges: [
              { cursor: mockRubberBufferInventoryPartId, node: { ...mockRubberBufferInventoryPart } },
              { cursor: mockDoorSensorInventoryPartId, node: { ...mockDoorSensorInventoryPart } },
            ],
          },
        },
      } as apollo.QueryResult;
    });

    render(InventoryPartsTableComponent());

    const cells = screen.getAllByRole('cell');

    expect(cells).toHaveLength(12);

    // === First Row ===
    expect(cells[0]).toBeInTheDocument(); // checkbox
    expect(cells[1]).toHaveTextContent('test_inventory_part_id_2');
    expect(cells[2]).toHaveTextContent('Rubber Buffer');
    expect(cells[3]).toHaveTextContent('3');
    expect(cells[4]).toHaveTextContent('$130.00');
    expect(cells[5]).toHaveTextContent('Low Stock');

    // === Second Row ===
    expect(cells[6]).toBeInTheDocument();
    expect(cells[7]).toHaveTextContent('test_inventory_part_id');
    expect(cells[8]).toHaveTextContent('Door Sensor (Infrared)');
    expect(cells[9]).toHaveTextContent('5');
    expect(cells[10]).toHaveTextContent('$85.00');
    expect(cells[11]).toHaveTextContent('Low Stock');
  });
});
