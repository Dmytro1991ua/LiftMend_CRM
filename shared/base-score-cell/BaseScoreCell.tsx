import { useMemo } from 'react';

import { BaseScoreDots } from './base-score-dots';
import { ScoreThreshold } from './types';
import { getScoreThresholdLevel } from './utils';

export type BaseScoreCellProps<TLabel extends string> = {
  score?: number | null;
  scoreThresholds: ScoreThreshold<TLabel>[];
  testId?: string;
};

const BaseScoreCell = <TLabel extends string>({
  score,
  scoreThresholds,
  testId = 'base-score-cell',
}: BaseScoreCellProps<TLabel>) => {
  const scoreLevel = useMemo(() => getScoreThresholdLevel<TLabel>(score, scoreThresholds), [score, scoreThresholds]);

  return (
    <section data-testid={testId}>
      <BaseScoreDots<TLabel> scoreLevel={scoreLevel} />
    </section>
  );
};

export default BaseScoreCell;
