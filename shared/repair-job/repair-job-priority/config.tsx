import {
  BsFillExclamationCircleFill,
  BsFillExclamationOctagonFill,
  BsFillExclamationTriangleFill,
} from 'react-icons/bs';

export enum Priority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

type PriorityConfig = {
  icon: JSX.Element;
  label: Priority;
  className?: string;
};

export const PRIORITY_CONFIG: Record<Priority, PriorityConfig> = {
  [Priority.High]: {
    icon: <BsFillExclamationTriangleFill className='h-6 w-6 text-red-500' />,
    label: Priority.High,
    className: 'text-red-500',
  },
  [Priority.Medium]: {
    icon: <BsFillExclamationCircleFill className='h-6 w-6 text-yellow-400' />,
    label: Priority.Medium,
    className: 'text-yellow-400',
  },
  [Priority.Low]: {
    icon: <BsFillExclamationOctagonFill className='h-6 w-6 text-green-500' />,
    label: Priority.Low,
    className: 'text-green-500',
  },
};
