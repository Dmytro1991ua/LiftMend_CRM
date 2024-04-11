import { HeaderGroup, flexRender } from '@tanstack/react-table';

type BaseTableHeaderProps<T extends object> = {
  headerGroups: HeaderGroup<T>[];
};

import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

const BaseTableHeader = <T extends object>({ headerGroups }: BaseTableHeaderProps<T>): React.JSX.Element => {
  return (
    <TableHeader>
      {headerGroups.map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <TableHead key={header.id}>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
};

export default BaseTableHeader;
