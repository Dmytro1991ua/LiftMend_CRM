export type SortArrowProps = {
  isSorted: 'asc' | 'desc' | false;
};

const SortArrow = ({ isSorted }: SortArrowProps) => {
  return (
    <span className='ml-2 text-transparent group-hover:text-gray-500' data-testid='sort-arrow'>
      {isSorted === 'asc' && '↑'}
      {isSorted === 'desc' && '↓'}
      {isSorted === false && '↑↓'}
    </span>
  );
};

export default SortArrow;
