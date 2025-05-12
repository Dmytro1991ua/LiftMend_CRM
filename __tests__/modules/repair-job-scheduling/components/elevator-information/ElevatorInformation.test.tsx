import { render, screen } from '@testing-library/react';

import { mockBuildingNames, mockElevatorLocations, mockElevatorTypes } from '@/mocks/dropdownOptions';
import { withApolloAndFormProvider } from '@/mocks/testMocks';
import ElevatorInformation from '@/modules/repair-job-scheduling/components/elevator-Information';
import { useFetchDropdownOptions } from '@/shared/hooks/useFetchDropdownOptions';
import { DropdownOptions } from '@/shared/hooks/useFetchDropdownOptions/config';

jest.mock('@/shared/hooks/useFetchDropdownOptions');

describe('ElevatorInformation', () => {
  beforeEach(() => {
    (useFetchDropdownOptions as jest.Mock).mockImplementation((configKey, skip) => {
      if (configKey === DropdownOptions.RepairJob) {
        return {
          dropdownOptions: {
            buildingNames: [mockBuildingNames],
          },
          loading: false,
          error: undefined,
        };
      }

      if (configKey === DropdownOptions.ElevatorDetails && !skip) {
        return {
          dropdownOptions: {
            elevatorLocations: [mockElevatorLocations.elevatorLocations[0]],
            elevatorTypes: [mockElevatorTypes.elevatorTypes[0]],
          },
          loading: false,
          error: undefined,
        };
      }

      return {
        dropdownOptions: {
          elevatorLocations: [],
          elevatorTypes: [],
        },
        loading: false,
        error: undefined,
      };
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const ElevatorInformationComponent = () =>
    withApolloAndFormProvider(<ElevatorInformation />, [], {
      defaultValues: {
        elevatorInformation: {
          buildingName: 'Clearwater Towers',
        },
      },
    });

  it('should render component without crashing', async () => {
    render(ElevatorInformationComponent());

    expect(screen.getByText('Building Name')).toBeInTheDocument();
    expect(screen.getByText('Elevator Type')).toBeInTheDocument();
    expect(screen.getByText('Elevator Location')).toBeInTheDocument();
  });
});
