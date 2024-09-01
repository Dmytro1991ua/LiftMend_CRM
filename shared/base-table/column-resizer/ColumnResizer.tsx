import { Header } from '@tanstack/react-table';

type ColumnResizerProps<T> = {
  header: Header<T, unknown>;
};
const ColumnResizer = <T extends object>({ header }: ColumnResizerProps<T>) => {
  const {
    getResizeHandler,
    column: { getCanResize, getIsResizing },
  } = header;

  if (!getCanResize()) return null;

  return (
    <div
      {...{
        onMouseDown: getResizeHandler(),
        onTouchStart: getResizeHandler(),
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
