import { useMemo } from 'react';

import { getElevatorHealthScoreColor } from '../../utils';

import { HealthScoreDots } from './health-score-dots';

type HealthScoreCellProps = {
  healthScore?: number | null;
};

const HealthScoreCell = ({ healthScore }: HealthScoreCellProps) => {
  const healthScoreLevel = useMemo(() => getElevatorHealthScoreColor(healthScore), [healthScore]);

  return (
    <section data-testid='health-score-cell'>
      <HealthScoreDots healthScoreLevel={healthScoreLevel} />
    </section>
  );
};

export default HealthScoreCell;
