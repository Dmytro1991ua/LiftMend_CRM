import { QueryResult, useQuery } from '@apollo/client';
import { render, screen } from '@testing-library/react';

import { mockRepairJobTypes } from '@/mocks/dropdownOptions';
import { withApolloAndFormProvider } from '@/mocks/testMocks';
import { STEP_CONTENT_CONFIG } from '@/modules/repair-job-scheduling/config';
import BaseStepper from '@/shared/base-stepper';

jest.mock('@apollo/client');

describe('BaseStepper', () => {
  const mockOnSubmit = jest.fn();
  const mockOnReset = jest.fn();
  const mockOnHandleNext = jest.fn();
  const mockSteps = [
    {
      id: 0,
      value: 'Step 1',
    },
    {
      id: 1,
      value: 'Step 2',
    },
    {
      id: 2,
      value: 'Step 3',
    },
  ];

  beforeEach(() => {
    (useQuery as jest.Mock).mockImplementation(() => {
      return {
        data: {
          getRepairJobScheduleData: {
            repairJobTypes: [mockRepairJobTypes],
          },
        },
        loading: false,
      } as unknown as QueryResult;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    steps: mockSteps,
    isLoading: false,
    stepContentConfig: STEP_CONTENT_CONFIG,
    onSubmit: mockOnSubmit,
    onReset: mockOnReset,
    onHandleNext: mockOnHandleNext,
  };

  const BaseStepperComponent = () => withApolloAndFormProvider(<BaseStepper {...defaultProps} />);

  it('should render component without crashing', () => {
    render(BaseStepperComponent());

    expect(screen.getByTestId('base-stepper')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
  });
});
