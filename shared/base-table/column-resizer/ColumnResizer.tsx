import { Header } from '@tanstack/react-table';

export type ColumnResizerProps<T> = {
  header: Header<T, unknown>;
};
const ColumnResizer = <T,>({ header }: ColumnResizerProps<T>) => {
  const {
    getResizeHandler,
    column: { getCanResize, getIsResizing },
  } = header;

  if (!getCanResize()) return null;

  return (
    <div
      data-testid='column-resizer'
      {...{
        onMouseDown: getResizeHandler(),
        onTouchStart: getResizeHandler(),
        onClick: (e) => e.stopPropagation(),
        className: `resizer ${getIsResizing() ? 'isResizing' : ''}`,
        style: {
          userSelect: 'none',
          touchAction: 'none',
        },
      }}
    />
  );
};

export default ColumnResizer;
