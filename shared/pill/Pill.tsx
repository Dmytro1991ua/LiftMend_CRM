import { PILL_CONFIG, PillStatus } from './config';

type PillProps = {
  status: PillStatus;
};

const Pill = ({ status }: PillProps) => {
  const { icon, label, className } = PILL_CONFIG[status] || {};

  return (
    <span className='flex items-center gap-1'>
      {icon}
      <span className={className}>{label}</span>
    </span>
  );
};

export default Pill;
