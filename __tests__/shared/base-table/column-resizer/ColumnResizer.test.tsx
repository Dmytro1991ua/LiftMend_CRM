import { Header } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';

import { TestData, createMockHeader } from '@/mocks/tableMoks';
import ColumnResizer, { ColumnResizerProps } from '@/shared/base-table/column-resizer/ColumnResizer';

describe('ColumnResizer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const ColumnResizerComponent = (props?: Partial<ColumnResizerProps<TestData>>) => {
    const mockHeader = createMockHeader('age', 'Age') as Header<TestData, unknown>;

    return <ColumnResizer header={mockHeader} {...props} />;
  };

  it('should render the column resizer if column can resize', () => {
    render(ColumnResizerComponent());

    const columnResizer = screen.getByTestId('column-resizer');

    expect(columnResizer).toBeInTheDocument();
    expect(columnResizer).toHaveClass('resizer');
    expect(columnResizer).toHaveClass('isResizing');
  });

  it('should not render if getCanResize returns false', () => {
    const mockHeader = createMockHeader('age', 'Age') as Header<TestData, unknown>;
    mockHeader.column.getCanResize = () => false;

    render(ColumnResizerComponent({ header: mockHeader }));

    expect(screen.queryByTestId('column-resizer')).not.toBeInTheDocument();
  });

  it('should call event stopPropagation on click', () => {
    const mockClickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    jest.spyOn(mockClickEvent, 'stopPropagation');

    render(ColumnResizerComponent());

    const columnResizer = screen.getByTestId('column-resizer');
    expect(columnResizer).toBeInTheDocument();

    columnResizer.dispatchEvent(mockClickEvent);

    expect(mockClickEvent.stopPropagation).toHaveBeenCalled();
  });
});
