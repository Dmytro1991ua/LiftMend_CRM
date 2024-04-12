import { Row } from '@tanstack/react-table';

type MockRowOriginal = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
};

type MockRow = {
  id: string;
  index: number;
  original: MockRowOriginal;
};

const mockGetContext = {
  table: {
    _features: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    options: {
      filterFromLeafRows: false,
      maxLeafRowFilterDepth: 100,
      globalFilterFn: 'auto',
      groupedColumnMode: 'reorder',
      paginateExpandedRows: true,
      enableRowSelection: true,
      enableMultiRowSelection: true,
      enableSubRowSelection: true,
      columnResizeMode: 'onEnd',
      columnResizeDirection: 'ltr',
      state: {
        columnSizing: {},
        columnSizingInfo: {
          startOffset: null,
          startSize: null,
          deltaOffset: null,
          deltaPercentage: null,
          isResizingColumn: false,
          columnSizingStart: [],
        },
        rowSelection: {},
        rowPinning: {
          top: [],
          bottom: [],
        },
        expanded: {},
        grouping: [],
        sorting: [],
        columnFilters: [],
        columnPinning: {
          left: [],
          right: [],
        },
        columnOrder: [],
        columnVisibility: {},
        pagination: {
          pageIndex: 0,
          pageSize: 10,
        },
      },
      renderFallbackValue: null,
      data: [
        {
          id: '728ed52f',
          amount: 100,
          status: 'pending',
          email: 'm@example.com',
        },
        {
          id: '489e1d42',
          amount: 125,
          status: 'processing',
          email: 'example@gmail.com',
        },
        {
          id: '4234e1d42',
          amount: 123,
          status: 'processing',
          email: 'example@gmail.com2',
        },
      ],
      columns: [
        {
          accessorKey: 'status',
          header: 'Status',
        },
        {
          accessorKey: 'email',
          header: 'Email',
        },
        {
          accessorKey: 'amount',
          header: 'Amount',
        },
      ],
    },
    initialState: {
      columnSizing: {},
      columnSizingInfo: {
        startOffset: null,
        startSize: null,
        deltaOffset: null,
        deltaPercentage: null,
        isResizingColumn: false,
        columnSizingStart: [],
      },
      rowSelection: {},
      rowPinning: {
        top: [],
        bottom: [],
      },
      expanded: {},
      grouping: [],
      sorting: [],
      columnFilters: [],
      columnPinning: {
        left: [],
        right: [],
      },
      columnOrder: [],
      columnVisibility: {},
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
  },
  column: {
    id: 'amount',
    depth: 0,
    columnDef: {
      header: 'Amount',
      filterFn: 'auto',
      sortingFn: 'auto',
      sortUndefined: 1,
      aggregationFn: 'auto',
      size: 150,
      minSize: 20,
      maxSize: 9007199254740991,
      accessorKey: 'amount',
    },
    columns: [],
  },
  row: {
    id: '2',
    index: 2,
    original: {
      id: '4234e1d42',
      amount: 123,
      status: 'processing',
      email: 'example@gmail.com2',
    },
    depth: 0,
    _valuesCache: {
      status: 'processing',
      email: 'example@gmail.com2',
      amount: 123,
    },
    _uniqueValuesCache: {},
    subRows: [],
    columnFilters: {},
    columnFiltersMeta: {},
    _groupingValuesCache: {},
  },
  cell: {
    id: '2_amount',
    row: {
      id: '2',
      index: 2,
      original: {
        id: '4234e1d42',
        amount: 123,
        status: 'processing',
        email: 'example@gmail.com2',
      },
      depth: 0,
      _valuesCache: {
        status: 'processing',
        email: 'example@gmail.com2',
        amount: 123,
      },
      _uniqueValuesCache: {},
      subRows: [],
      columnFilters: {},
      columnFiltersMeta: {},
      _groupingValuesCache: {},
    },
    column: {
      id: 'amount',
      depth: 0,
      columnDef: {
        header: 'Amount',
        filterFn: 'auto',
        sortingFn: 'auto',
        sortUndefined: 1,
        aggregationFn: 'auto',
        size: 150,
        minSize: 20,
        maxSize: 9007199254740991,
        accessorKey: 'amount',
      },
      columns: [],
    },
  },
};

const mockGetVisibleCells = {
  id: '2_status',
  row: {
    id: '2',
    index: 2,
    original: {
      id: '4234e1d42',
      amount: 123,
      status: 'processing',
      email: 'example@gmail.com2',
    },
    depth: 0,
    _valuesCache: {
      status: 'processing',
      email: 'example@gmail.com2',
      amount: 123,
    },
    _uniqueValuesCache: {},
    subRows: [],
    columnFilters: {},
    columnFiltersMeta: {},
    _groupingValuesCache: {},
  },
  column: {
    id: 'status',
    depth: 0,
    columnDef: {
      header: 'Status',
      filterFn: 'auto',
      sortingFn: 'auto',
      sortUndefined: 1,
      aggregationFn: 'auto',
      size: 150,
      minSize: 20,
      maxSize: 9007199254740991,
      accessorKey: 'status',
    },
    columns: [],
  },
  getContext: jest.fn().mockReturnValue(mockGetContext),
};

export const mockRows = [
  {
    id: '1',
    index: 1,
    original: {
      id: '489e1d42',
      amount: 125,
      status: 'processing',
      email: 'example@gmail.com',
    },
    getIsSelected: jest.fn(),
    getVisibleCells: jest.fn().mockReturnValue([mockGetVisibleCells]),
  },
] as unknown as Row<MockRow>[];
