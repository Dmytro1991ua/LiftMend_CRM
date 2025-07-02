import { camelCase as _camelCase, startCase as _startCase } from 'lodash';

import { Checkbox } from '@/components/ui/checkbox';

import { CustomizeColumnsProps } from '../CustomizeColumns';
import { useCustomizeColumns } from '../hooks';

const CustomizeColumnsContent = <T,>({ columns }: CustomizeColumnsProps<T>) => {
  const { allAvailableColumns, visibleColumns, onToggleColumnVisibility } = useCustomizeColumns(columns);

  return (
    <div className='max-h-[30rem] overflow-y-auto'>
      {allAvailableColumns.map(({ id, getIsVisible, toggleVisibility }) => (
        <div key={id} className='flex items-center gap-2 py-2 border-b-[1px] border-gray-200 last:border-0'>
          <Checkbox
            checked={visibleColumns[id] ?? getIsVisible()}
            data-testid='column-checkbox'
            onCheckedChange={(value) => onToggleColumnVisibility(id, toggleVisibility, !!value)}
          />
          <h3 className='text-sm font-semibold'>{_startCase(_camelCase(id))}</h3>
        </div>
      ))}
    </div>
  );
};

export default CustomizeColumnsContent;
