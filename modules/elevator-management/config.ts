import { ScoreThreshold } from '@/shared/base-score-cell/types';
import { getScoreTooltipMessage } from '@/shared/base-score-cell/utils';

import { ELEVATOR_HEALTH_SCORE_TOOLTIP_TITLE } from './constants';
import { HealthScoreLabel, HealthScoreTooltipDescription } from './types';

export const ELEVATOR_HEALTH_SCORE_THRESHOLDS: ScoreThreshold<HealthScoreLabel>[] = [
  {
    value: 90,
    label: HealthScoreLabel.Excellent,
    color: '#22c55e',
    classes: { background: 'bg-green-500', text: 'text-green-600', border: 'border-green-500' },
    activeDots: 4,
    tooltipProps: {
      id: HealthScoreLabel.Excellent,
      getTooltipMessage: (score: number) =>
        getScoreTooltipMessage({
          score,
          title: ELEVATOR_HEALTH_SCORE_TOOLTIP_TITLE,
          label: HealthScoreLabel.Excellent,
          description: HealthScoreTooltipDescription.Excellent,
        }),
    },
  },
  {
    value: 70,
    label: HealthScoreLabel.Good,
    color: '#facc15',
    classes: { background: 'bg-yellow-400', text: 'text-yellow-600', border: 'border-yellow-400' },
    activeDots: 3,
    tooltipProps: {
      id: HealthScoreLabel.Good,
      getTooltipMessage: (score: number) =>
        getScoreTooltipMessage({
          score,
          title: ELEVATOR_HEALTH_SCORE_TOOLTIP_TITLE,
          label: HealthScoreLabel.Good,
          description: HealthScoreTooltipDescription.Good,
        }),
    },
  },
  {
    value: 50,
    label: HealthScoreLabel.Fair,
    color: '#f97316',
    classes: { background: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-500' },
    activeDots: 2,
    tooltipProps: {
      id: HealthScoreLabel.Fair,
      getTooltipMessage: (score: number) =>
        getScoreTooltipMessage({
          score,
          title: ELEVATOR_HEALTH_SCORE_TOOLTIP_TITLE,
          label: HealthScoreLabel.Fair,
          description: HealthScoreTooltipDescription.Fair,
        }),
    },
  },
  {
    value: 0,
    label: HealthScoreLabel.Poor,
    color: '#ef4444',
    classes: { background: 'bg-red-500', text: 'text-red-600', border: 'border-red-500' },
    activeDots: 1,
    tooltipProps: {
      id: HealthScoreLabel.Poor,
      getTooltipMessage: (score: number) =>
        getScoreTooltipMessage({
          score,
          title: ELEVATOR_HEALTH_SCORE_TOOLTIP_TITLE,
          label: HealthScoreLabel.Poor,
          description: HealthScoreTooltipDescription.Poor,
        }),
    },
  },
];
