import { upperFirst as _upperFirst } from 'lodash';

import { ChangeLogFieldChange } from '@/shared/types';

import { formatChangeLogValue } from '../utils';

export type ChangeLogContent = {
  changeList: ChangeLogFieldChange[];
};

const ChangeLogContent = ({ changeList }: ChangeLogContent) => {
  return (
    <div className='overflow-x-auto'>
      <table className='w-full text-sm border-collapse table-fixed'>
        <colgroup>
          <col className='w-[13rem]' /> {/* Field */}
          <col className='w-[25rem]' /> {/* Old value */}
          <col className='w-[30rem]' /> {/* New value */}
          <col className='w-[5rem]' /> {/* Action */}
        </colgroup>
        <thead>
          <tr className='text-left text-muted-foreground border-b'>
            <th className='py-3 pr-4'>Field</th>
            <th className='py-3 pr-4'>Old value</th>
            <th className='py-3 pr-4'>New value</th>
            <th className='py-3'>Action</th>
          </tr>
        </thead>
        <tbody>
          {changeList.map(({ field, oldValue, newValue, action }, index) => (
            <tr key={index} className='border-b last:border-b-0  text-muted-foreground '>
              <td className='py-3 pr-4 font-medium'>{field}</td>
              <td className='py-3 pr-4'>{formatChangeLogValue(oldValue)}</td>
              <td className='py-3'>{formatChangeLogValue(newValue)}</td>
              <td className='py-3'>{_upperFirst(action)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChangeLogContent;
