import { STATUS_CONFIG, Status } from './config';

type RepairJobStatusProps = {
  status: Status;
};

const RepairJobStatus = ({ status }: RepairJobStatusProps) => {
  const { icon, label, className } = STATUS_CONFIG[status] || {};

  return (
    <span className='flex items-center gap-1'>
      {icon}
      <span className={className}>{label}</span>
    </span>
  );
};

export default RepairJobStatus;
