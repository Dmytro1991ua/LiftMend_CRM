import { ScoreThreshold } from '@/shared/base-score-cell/types';
import BaseTooltip from '@/shared/base-tooltip';

import { DEFAULT_INACTIVE_DOT_STYLES, DEFAULT_SCORE_THRESHOLD_LABEL, DEFAULT_TOTAL_DOTS } from '../constants';

export type BaseScoreDotsProps<TLabel extends string> = {
  scoreLevel: ScoreThreshold<TLabel> | null;
  totalDots?: number;
};

const BaseScoreDots = <TLabel extends string>({
  scoreLevel,
  totalDots = DEFAULT_TOTAL_DOTS,
}: BaseScoreDotsProps<TLabel>) => {
  if (!scoreLevel) return <span className='block text-center'>{DEFAULT_SCORE_THRESHOLD_LABEL}</span>;

  const {
    activeDots = 0,
    classes: { background },
    tooltipProps,
    value,
  } = scoreLevel;

  const tooltipId = tooltipProps?.id ?? 'score-tooltip';
  const tooltipMessage = tooltipProps?.getTooltipMessage ? tooltipProps.getTooltipMessage(value) : '';

  return (
    <BaseTooltip shouldRenderInPortal className='shadow-none w-[33rem]' id={tooltipId} message={tooltipMessage}>
      <div className='flex items-center justify-center gap-1 cursor-pointer p-2' data-testid='score-dot-container'>
        {Array.from({ length: totalDots }).map((_, index) => {
          const isDotActive = index < activeDots;
          const dotColorClass = isDotActive ? background : DEFAULT_INACTIVE_DOT_STYLES;

          return (
            <span
              key={`dot_${index}`}
              className={`w-2.5 h-2.5 rounded-full ${dotColorClass}`}
              data-testid='score-dot'
            />
          );
        })}
      </div>
    </BaseTooltip>
  );
};

export default BaseScoreDots;
