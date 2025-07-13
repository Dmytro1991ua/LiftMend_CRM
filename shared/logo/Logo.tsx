import { FaElevator } from 'react-icons/fa6';

import { cn } from '@/lib/utils';

export type LogoProps = {
  iconClassName?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  isLabelShown?: boolean;
};

export const LOGO_LABEL = 'LiftMend';

const Logo = ({ iconClassName, wrapperClassName, labelClassName, isLabelShown = true }: LogoProps) => {
  return (
    <div
      className={cn('flex items-center justify-center group pb-4 mb-5 border-b-2 border-slate', wrapperClassName)}
      data-testid='logo-wrapper'>
      <div className='flex justify-center items-center p-3 bg-primary text-white rounded-full group'>
        <FaElevator className={iconClassName} data-testid='logo-icon' />
      </div>
      {isLabelShown ? <h3 className={cn('text-lg font-bold', labelClassName)}>{LOGO_LABEL}</h3> : null}
    </div>
  );
};

export default Logo;
