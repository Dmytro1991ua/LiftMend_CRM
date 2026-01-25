import { render, screen } from '@testing-library/react';

import { ElevatorSeverityLevel } from '@/graphql/types/client/generated_types';
import InspectionStatus, {
  InspectionStatusProps,
} from '@/modules/elevator-management/components/inspection-status/InspectionStatus';

describe('InspectionStatus', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    inspectionStatus: { severity: ElevatorSeverityLevel.Error, label: 'Inspection overdue' },
  };

  const InspectionStatusComponent = (props?: Partial<InspectionStatusProps>) => (
    <InspectionStatus {...defaultProps} {...props} />
  );

  it('should render component without crashing', async () => {
    render(InspectionStatusComponent());

    expect(screen.getByText('Inspection overdue')).toBeInTheDocument();
    expect(screen.getByTestId('error-severity')).toBeInTheDocument();
    expect(screen.getByTestId('info-icon')).toBeInTheDocument();
  });
});
