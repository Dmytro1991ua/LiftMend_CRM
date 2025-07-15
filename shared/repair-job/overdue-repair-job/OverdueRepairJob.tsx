import { FaCheckCircle } from 'react-icons/fa';
import { IoIosWarning } from 'react-icons/io';

import { Maybe } from '@/graphql/types/client/generated_types';

export type OverdueRepairJobProps = {
  isOverdue?: Maybe<boolean>;
};

const OverdueRepairJob = ({ isOverdue }: OverdueRepairJobProps) => {
  const statusIcon = isOverdue ? (
    <IoIosWarning className='h-6 w-6 mr-1 text-yellow-400' data-testid='warning-icon' />
  ) : (
    <FaCheckCircle className='h-6 w-6 mr-1 text-green-400' data-testid='check-icon' />
  );

  const statusText = isOverdue ? (
    <span className='font-bold text-yellow-400'>Yes</span>
  ) : (
    <span className='font-bold text-green-400'>No</span>
  );

  return (
    <div className='flex items-center'>
      {statusIcon}
      {statusText}
    </div>
  );
};

export default OverdueRepairJob;
