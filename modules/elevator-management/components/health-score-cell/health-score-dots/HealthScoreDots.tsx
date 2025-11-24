import { ElevatorHealthScore } from '@/modules/elevator-management/types';
import BaseTooltip from '@/shared/base-tooltip';

import { DEFAULT_HEALTH_SCORE_LABEL, DEFAULT_INACTIVE_DOT_STYLES, DEFAULT_TOTAL_DOTS } from './constants';

export type HealthScoreDotsProps = {
  healthScoreLevel: ElevatorHealthScore | null;
  totalDots?: number;
};

const HealthScoreDots = ({ healthScoreLevel, totalDots = DEFAULT_TOTAL_DOTS }: HealthScoreDotsProps) => {
  if (!healthScoreLevel) return <span>{DEFAULT_HEALTH_SCORE_LABEL}</span>;

  const {
    activeDots,
    classes: { background },
    value,
    tooltipProps: { id, getTooltipMessage },
  } = healthScoreLevel;

  return (
    <BaseTooltip shouldRenderInPortal className='shadow-none' id={id} message={getTooltipMessage(value)}>
      <div className='flex items-center justify-center gap-1 cursor-pointer p-2' data-testid='health-dot-container'>
        {Array.from({ length: totalDots }).map((_, i) => {
          const isDotActive = i < activeDots;
          const dotColor = isDotActive ? background : DEFAULT_INACTIVE_DOT_STYLES;

          return <span key={i} className={`w-2.5 h-2.5 rounded-full ${dotColor}`} data-testid='health-dot' />;
        })}
      </div>
    </BaseTooltip>
  );
};

export default HealthScoreDots;
