import { render, screen } from '@testing-library/react';

import StatusChangePill from '@/modules/technician-management/components/technician-employment-history-table/status-change-pill';
import { PillStatus } from '@/shared/pill/config';

jest.mock('@/shared/pill', () => ({
  __esModule: true,
  default: ({ status }: { status: string }) => <div data-testid={`pill-${status}`}>{status}</div>,
}));

describe('StatusChangePill', () => {
  it('should render previous and current status pills', () => {
    render(<StatusChangePill currentStatus={PillStatus.Inactive} previousStatus={PillStatus.Active} />);

    expect(screen.getByTestId('pill-Active')).toBeInTheDocument();
    expect(screen.getByTestId('pill-Inactive')).toBeInTheDocument();
  });

  it('should render arrow between statuses', () => {
    render(<StatusChangePill currentStatus={PillStatus.Unavailable} previousStatus={PillStatus.Available} />);

    expect(screen.getByText('→')).toBeInTheDocument();
  });
});
