import { PRIORITY_CONFIG, Priority } from './config';

type RepairJobPriorityProps = {
  priority: Priority;
};

const RepairJobPriority = ({ priority }: RepairJobPriorityProps) => {
  const { icon, label, className } = PRIORITY_CONFIG[priority] || {};

  return (
    <span className='flex items-center gap-1'>
      {icon}
      <span className={className}>{label}</span>
    </span>
  );
};

export default RepairJobPriority;
