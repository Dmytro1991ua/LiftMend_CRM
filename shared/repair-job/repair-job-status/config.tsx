import { FaHourglassStart } from 'react-icons/fa';
import { FaClock, FaPause } from 'react-icons/fa6';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import { MdCancel } from 'react-icons/md';

export enum Status {
  Scheduled = 'Scheduled',
  InProgress = 'In Progress',
  Completed = 'Completed',
  onHold = 'On Hold',
  Cancelled = 'Cancelled',
}

type StatusConfig = {
  icon: JSX.Element;
  label: Status;
  className?: string;
};

export const STATUS_CONFIG: Record<Status, StatusConfig> = {
  [Status.Scheduled]: {
    icon: <FaClock className='h-6 w-6 text-primary' />,
    label: Status.Scheduled,
    className: 'text-primary',
  },
  [Status.InProgress]: {
    icon: <FaHourglassStart className='h-6 w-6 text-orange-500' />,
    label: Status.InProgress,
    className: 'text-orange-500',
  },
  [Status.Completed]: {
    icon: <IoIosCheckmarkCircle className='h-6 w-6 text-green-500' />,
    label: Status.Completed,
    className: 'text-green-500',
  },
  [Status.onHold]: {
    icon: <FaPause className='h-6 w-6 text-yellow-500' />,
    label: Status.onHold,
    className: 'text-yellow-500',
  },
  [Status.Cancelled]: {
    icon: <MdCancel className='h-6 w-6 text-red-500' />,
    label: Status.Cancelled,
    className: 'text-red-500',
  },
};
