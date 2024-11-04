import ReactTooltip, { TooltipProps as ReactTooltipProps } from 'react-tooltip';

import { cn } from '@/lib/utils';

export interface BaseTooltipProps
  extends Pick<ReactTooltipProps, 'place' | 'delayShow' | 'delayHide' | 'disable' | 'effect'> {
  // provide a unique ID for each tooltip
  id: string;
  className?: string;
  children: JSX.Element;
  // data-tip only accepts a string, data-html supports HTML, both are setup
  message: string;
}

const BaseTooltip = ({
  id,
  className,
  children,
  message,
  place,
  delayShow,
  delayHide,
  disable,
  effect = 'solid',
}: BaseTooltipProps): JSX.Element => {
  return (
    <div data-testid='tooltip-wrapper'>
      <ReactTooltip
        backgroundColor='#272C35'
        className={cn('!opacity-100 !px-2 !py-3 text-center bg-gray-800 text-white rounded-xl shadow-lg', className)}
        effect={effect}
        id={id}
      />
      <div
        data-html
        className='flex justify-center'
        data-delay-hide={delayHide || 100}
        data-delay-show={delayShow || 100}
        data-for={id}
        data-place={place || 'bottom'}
        data-tip={message}
        data-tip-disable={disable || false}
      >
        {children}
      </div>
    </div>
  );
};

export default BaseTooltip;
