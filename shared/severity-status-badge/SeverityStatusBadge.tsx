import { cn } from '@/lib/utils';

import InfoTooltip from '../base-tooltip/info-tooltip/InfoTooltip';

import { SeverityStatus, SeverityStatusBadgeConfig } from './types';

export type SeverityStatusBadgeProps = {
  config: SeverityStatusBadgeConfig;
  severityStatusItem?: SeverityStatus | null;
  isTooltipIconShown?: boolean;
};

const SeverityStatusBadge = ({ config, severityStatusItem, isTooltipIconShown = true }: SeverityStatusBadgeProps) => {
  const severityStatusBadgeConfig = severityStatusItem?.severity ? config[severityStatusItem?.severity] : null;

  return (
    <section className={'relative flex items-center gap-2 p-1 rounded'}>
      <div>{severityStatusBadgeConfig?.icon}</div>
      <h3 className={cn(severityStatusBadgeConfig?.textColor, 'font-medium')}> {severityStatusItem?.label}</h3>
      {isTooltipIconShown && (
        <InfoTooltip
          className='w-[33rem] !shadow-none'
          iconClassName='relative -top-2'
          iconColor='#2563eb'
          iconSize='14'
          id={`severity-badge-tooltip-${severityStatusItem?.label}`}
          message={severityStatusBadgeConfig?.tooltipMessage ?? severityStatusItem?.description ?? ''}
          place='bottom'
        />
      )}
    </section>
  );
};

export default SeverityStatusBadge;
