import { ElevatorHealthScore, HealthScoreLabel, HealthScoreTooltipDescription } from '../../types';
import { getElevatorHealthTooltipMessage } from '../../utils';

export const ELEVATOR_HEALTH_SCORE_THRESHOLDS: ElevatorHealthScore[] = [
  {
    value: 90,
    label: HealthScoreLabel.Excellent,
    color: '#22c55e',
    classes: { background: 'bg-green-500', text: 'text-green-600', border: 'border-green-500' },
    activeDots: 3,
    tooltipProps: {
      id: HealthScoreLabel.Excellent,
      getTooltipMessage: (score: number) =>
        getElevatorHealthTooltipMessage({
          score,
          label: HealthScoreLabel.Excellent,
          description: HealthScoreTooltipDescription.Excellent,
        }),
    },
  },
  {
    value: 70,
    label: HealthScoreLabel.Fair,
    color: '#facc15',
    classes: { background: 'bg-yellow-400', text: 'text-yellow-600', border: 'border-yellow-400' },
    activeDots: 2,
    tooltipProps: {
      id: HealthScoreLabel.Fair,
      getTooltipMessage: (score: number) =>
        getElevatorHealthTooltipMessage({
          score,
          label: HealthScoreLabel.Fair,
          description: HealthScoreTooltipDescription.Fair,
        }),
    },
  },
  {
    value: 50,
    label: HealthScoreLabel.Poor,
    color: '#f97316',
    classes: { background: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-500' },
    activeDots: 1,
    tooltipProps: {
      id: HealthScoreLabel.Poor,
      getTooltipMessage: (score: number) =>
        getElevatorHealthTooltipMessage({
          score,
          label: HealthScoreLabel.Poor,
          description: HealthScoreTooltipDescription.Poor,
        }),
    },
  },
  {
    value: 0,
    label: HealthScoreLabel.Critical,
    color: '#ef4444',
    classes: { background: 'bg-red-500', text: 'text-red-600', border: 'border-red-500' },
    activeDots: 1,
    tooltipProps: {
      id: HealthScoreLabel.Critical,
      getTooltipMessage: (score: number) =>
        getElevatorHealthTooltipMessage({
          score,
          label: HealthScoreLabel.Critical,
          description: HealthScoreTooltipDescription.Critical,
        }),
    },
  },
];
