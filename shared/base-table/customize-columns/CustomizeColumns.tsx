import { Column } from '@tanstack/react-table';
import { CiSettings } from 'react-icons/ci';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import CustomizeColumnsContent from './CustomizeColumnsContent';

export type CustomizeColumnsProps<T> = {
  columns: Column<T, unknown>[];
};

const CustomizeColumns = <T,>({ columns }: CustomizeColumnsProps<T>) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='ml-auto hidden h-8 lg:flex' size='sm' variant='outline'>
          <CiSettings className='mr-2 h-4 w-4' />
          Customize Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[20rem]'>
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <CustomizeColumnsContent columns={columns} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomizeColumns;
