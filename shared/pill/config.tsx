import {
  BsFillExclamationCircleFill,
  BsFillExclamationOctagonFill,
  BsFillExclamationTriangleFill,
} from 'react-icons/bs';
import { FaHourglassStart, FaTools, FaUserCheck, FaUserSlash, FaUserTimes } from 'react-icons/fa';
import { FaClock, FaPause } from 'react-icons/fa6';
import { IoIosCheckmarkCircle, IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { MdCancel, MdOutlineWorkOutline, MdPersonOff, MdWarning } from 'react-icons/md';

export enum PillStatus {
  Scheduled = 'Scheduled',
  InProgress = 'In Progress',
  Completed = 'Completed',
  onHold = 'On Hold',
  Cancelled = 'Cancelled',
  Operational = 'Operational',
  UnderMaintenance = 'Under Maintenance',
  OutOfService = 'Out of Service',
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
  Available = 'Available',
  Busy = 'Busy',
  OnLeave = 'On Leave',
  Inactive = 'Inactive',
  Active = 'Active',
  Retired = 'Retired',
  Unavailable = 'Unavailable',
  Reserved = 'Reserved',
  Paused = 'Paused',
}

type PillConfig = {
  icon: JSX.Element;
  label: string;
  className?: string;
};

export const PILL_CONFIG: Record<PillStatus, PillConfig> = {
  [PillStatus.Scheduled]: {
    icon: <FaClock className='h-6 w-6 text-primary' data-testid='scheduled-status' />,
    label: PillStatus.Scheduled,
    className: 'text-primary',
  },
  [PillStatus.InProgress]: {
    icon: <FaHourglassStart className='h-6 w-6 text-orange-500' data-testid='in-progress-status' />,
    label: PillStatus.InProgress,
    className: 'text-orange-500',
  },
  [PillStatus.Completed]: {
    icon: <IoIosCheckmarkCircle className='h-6 w-6 text-green-500' data-testid='completed-status' />,
    label: PillStatus.Completed,
    className: 'text-green-500',
  },
  [PillStatus.onHold]: {
    icon: <FaPause className='h-6 w-6 text-yellow-500' data-testid='on-hold-status' />,
    label: PillStatus.onHold,
    className: 'text-yellow-500',
  },
  [PillStatus.Cancelled]: {
    icon: <MdCancel className='h-6 w-6 text-red-500' data-testid='cancelled-status' />,
    label: PillStatus.Cancelled,
    className: 'text-red-500',
  },
  [PillStatus.Operational]: {
    icon: <IoMdCheckmarkCircleOutline className='h-6 w-6 text-green-500' data-testid='operational-status' />,
    label: PillStatus.Operational,
    className: 'text-green-500',
  },
  [PillStatus.UnderMaintenance]: {
    icon: <FaTools className='h-6 w-6 text-yellow-500' data-testid='under-maintenance-status' />,
    label: PillStatus.UnderMaintenance,
    className: 'text-yellow-500',
  },
  [PillStatus.OutOfService]: {
    icon: <MdWarning className='h-6 w-6 text-red-500' data-testid='out-of-service-status' />,
    label: PillStatus.OutOfService,
    className: 'text-red-500',
  },
  [PillStatus.High]: {
    icon: <BsFillExclamationTriangleFill className='h-6 w-6 text-red-500' data-testid='high-status' />,
    label: PillStatus.High,
    className: 'text-red-500',
  },
  [PillStatus.Medium]: {
    icon: <BsFillExclamationCircleFill className='h-6 w-6 text-yellow-400' data-testid='medium-status' />,
    label: PillStatus.Medium,
    className: 'text-yellow-500',
  },
  [PillStatus.Low]: {
    icon: <BsFillExclamationOctagonFill className='h-6 w-6 text-green-500' data-testid='active-status' />,
    label: PillStatus.Low,
    className: 'text-green-500',
  },
  [PillStatus.Available]: {
    icon: <FaUserCheck className='h-6 w-6 text-green-500' data-testid='available-status' />,
    label: PillStatus.Available,
    className: 'text-green-500',
  },
  [PillStatus.Busy]: {
    icon: <FaHourglassStart className='h-6 w-6 text-orange-500' data-testid='busy-status' />,
    label: PillStatus.Busy,
    className: 'text-orange-500',
  },
  [PillStatus.OnLeave]: {
    icon: <MdPersonOff className='h-6 w-6 text-yellow-500' data-testid='on-leave-status' />,
    label: PillStatus.OnLeave,
    className: 'text-yellow-500',
  },
  [PillStatus.Unavailable]: {
    icon: <FaUserTimes className='h-6 w-6 text-gray-500' data-testid='unavailable-status' />,
    label: PillStatus.Unavailable,
    className: 'text-gray-500',
  },
  [PillStatus.Inactive]: {
    icon: <FaUserSlash className='h-6 w-6 text-gray-500' data-testid='inactive-status' />,
    label: PillStatus.Inactive,
    className: 'text-gray-500',
  },
  [PillStatus.Active]: {
    icon: <MdOutlineWorkOutline className='h-6 w-6 text-blue-500' data-testid='active-status' />,
    label: PillStatus.Active,
    className: 'text-blue-500',
  },
  [PillStatus.Retired]: {
    icon: <MdCancel className='h-6 w-6 text-gray-400' data-testid='retired-status' />,
    label: PillStatus.Retired,
    className: 'text-gray-400',
  },
  [PillStatus.Reserved]: {
    icon: <FaPause className='h-6 w-6 text-blue-400' data-testid='reserved-status' />,
    label: PillStatus.Reserved,
    className: 'text-blue-400',
  },
  [PillStatus.Paused]: {
    icon: <FaPause className='h-6 w-6 text-blue-500' data-testid='paused-status' />,
    label: PillStatus.Paused,
    className: 'text-blue-500',
  },
};
