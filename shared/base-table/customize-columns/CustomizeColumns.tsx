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
import { useDropdownState } from '@/shared/hooks';

import CustomizeColumnsContent from './CustomizeColumnsContent';

export type CustomizeColumnsProps<T> = {
  columns: Column<T, unknown>[];
  isDisabled?: boolean;
};

const CustomizeColumns = <T,>({ columns, isDisabled }: CustomizeColumnsProps<T>) => {
  const { isDropdownOpen, onHandleDropdownOpenState } = useDropdownState({ isDisabled });

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={onHandleDropdownOpenState}>
      <DropdownMenuTrigger asChild>
        <Button
          className='ml-auto h-8 py-5 px-3 bg-primary text-white'
          disabled={isDisabled}
          size='sm'
          variant='default'
        >
          <CiSettings className='mr-2 h-4 w-4' />
          Customize Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[25rem]'>
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <CustomizeColumnsContent columns={columns} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomizeColumns;
