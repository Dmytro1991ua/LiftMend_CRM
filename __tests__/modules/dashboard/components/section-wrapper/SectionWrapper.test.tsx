import { render, screen } from '@testing-library/react';

import SectionWrapper from '@/modules/dashboard/components/section-wrapper';
import { SectionTitle } from '@/modules/dashboard/types';

describe('SectionWrapper', () => {
  it('should render component without crashing', () => {
    render(
      <SectionWrapper title={SectionTitle.ElevatorStatusMetrics}>
        <p>Elevator Status chart</p>
      </SectionWrapper>
    );

    expect(screen.getByText(SectionTitle.ElevatorStatusMetrics)).toBeInTheDocument();
    expect(screen.getByText('Elevator Status chart')).toBeInTheDocument();
  });

  it('should render component with different props', () => {
    render(
      <SectionWrapper title={SectionTitle.KeyAppMetrics}>
        <p>Key App Metrics chart</p>
      </SectionWrapper>
    );

    expect(screen.getByText(SectionTitle.KeyAppMetrics)).toBeInTheDocument();
    expect(screen.getByText('Key App Metrics chart')).toBeInTheDocument();
  });
});
