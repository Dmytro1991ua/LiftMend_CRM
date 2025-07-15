import { render, screen } from '@testing-library/react';

import OverdueRepairJob, { OverdueRepairJobProps } from '@/shared/repair-job/overdue-repair-job/OverdueRepairJob';

describe('OverdueRepairJob', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    isOverdue: false,
  };

  const OverdueRepairJobComponent = (props?: OverdueRepairJobProps) => (
    <OverdueRepairJob {...defaultProps} {...props} />
  );

  it('should correctly render icon and label for not overdue repair job', () => {
    render(OverdueRepairJobComponent());

    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('should correctly render icon and label for overdue repair job', () => {
    render(OverdueRepairJobComponent({ isOverdue: true }));

    expect(screen.getByTestId('warning-icon')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });
});
