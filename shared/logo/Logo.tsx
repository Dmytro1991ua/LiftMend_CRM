import { FaElevator } from 'react-icons/fa6';

import { cn } from '@/lib/utils';

type LogoProps = {
  iconClassName?: string;
  wrapperClassName?: string;
  isLabelShown?: boolean;
};

const LOGO_LABEL = 'LiftMend';

const Logo = ({ iconClassName, wrapperClassName, isLabelShown = true }: LogoProps) => {
  return (
    <div className={cn('flex items-center justify-center group pb-4 mb-5 border-b-2 border-slate', wrapperClassName)}>
      <div className='flex justify-center items-center p-3 bg-primary text-white rounded-full mr-2 group'>
        <FaElevator className={iconClassName} />
      </div>
      {isLabelShown ? <h3 className='text-lg font-bold'>{LOGO_LABEL}</h3> : null}
    </div>
  );
};

export default Logo;
