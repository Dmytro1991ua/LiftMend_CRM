import { LuArrowUpDown, LuArrowUp, LuArrowDown } from 'react-icons/lu';

type SortArrowProps = {
  isSorted: 'asc' | 'desc' | false;
  isSortingEnabled?: boolean;
};

const SortArrow = ({ isSorted, isSortingEnabled }: SortArrowProps) => {
  if (!isSortingEnabled) return null;

  return (
    <span className='ml-2'>
      {isSorted === 'asc' && <LuArrowUp className='text-gray-500' />}
      {isSorted === 'desc' && <LuArrowDown className='text-gray-500' />}
      {isSorted === false && <LuArrowUpDown className='text-transparent group-hover:text-gray-500' />}
    </span>
  );
};

export default SortArrow;
