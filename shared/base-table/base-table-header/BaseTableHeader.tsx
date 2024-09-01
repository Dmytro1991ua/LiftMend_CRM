import { HeaderGroup, flexRender } from '@tanstack/react-table';

import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

import ColumnResizer from '../column-resizer/ColumnResizer';

type BaseTableHeaderProps<T extends object> = {
  headerGroups: HeaderGroup<T>[];
};

const BaseTableHeader = <T extends object>({ headerGroups }: BaseTableHeaderProps<T>): React.JSX.Element => {
  return (
    <TableHeader className='shadow-md'>
      {headerGroups.map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <TableHead
                key={header.id}
                className='sticky w-full top-0 h-10 border-b-2 font-bold border-border z-50 bg-gray-100'
                style={{
                  width: `calc(var(--header-${header?.id}-size) * 1px)`,
                }}
              >
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                <ColumnResizer header={header} />
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
};

export default BaseTableHeader;
