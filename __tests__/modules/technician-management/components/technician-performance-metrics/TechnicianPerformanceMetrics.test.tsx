import { render, screen } from '@testing-library/react';

import { mockBenjaminHallRecord } from '@/mocks/technicianManagementMocks';
import { TechnicianPerformanceMetrics } from '@/modules/technician-management/components/technician-performance-metrics';

describe('TechnicianPerformanceMetrics', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render component without crashing', () => {
    render(<TechnicianPerformanceMetrics technicianRecord={mockBenjaminHallRecord} />);

    expect(screen.getByTestId('base-app-metrics')).toBeInTheDocument();
    expect(screen.getByText('Total Repair Jobs')).toBeInTheDocument();
    expect(screen.getByText('Active Repair Jobs')).toBeInTheDocument();
    expect(screen.getByText('Completed Repair Jobs')).toBeInTheDocument();
    expect(screen.getByText('Overdue Repair Jobs')).toBeInTheDocument();
    expect(screen.getByText('On-Time Completion')).toBeInTheDocument();
    expect(screen.getByText('Average Repair Job Duration')).toBeInTheDocument();
  });
});
