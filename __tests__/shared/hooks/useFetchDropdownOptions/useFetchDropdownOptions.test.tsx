import * as apollo from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { RenderHookResult, renderHook } from '@testing-library/react-hooks';

import { mockElevatorRecordsFormData } from '@/mocks/elevatorManagementMocks';
import { mockRepairJobsFormData } from '@/mocks/repairJobTrackingMocks';
import { mockTechnicianRecordsFormData } from '@/mocks/technicianManagementMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import {
  UseFetchDropdownOptions,
  UseFetchDropdownOptionsProps,
  useFetchDropdownOptions,
} from '@/shared/hooks/useFetchDropdownOptions';
import { DropdownOptions } from '@/shared/hooks/useFetchDropdownOptions/config';

describe('useFetchDropdownOptions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    configKey: DropdownOptions.RepairJob,
    skip: false,
    variables: undefined,
  };

  const hook = (
    props?: Partial<UseFetchDropdownOptionsProps>,
    mocks: MockedResponse[] = []
  ): RenderHookResult<unknown, UseFetchDropdownOptions> => {
    return renderHook(() => useFetchDropdownOptions({ ...defaultProps, ...props }), {
      wrapper: ({ children }) => <MockProviderHook mocks={mocks}>{children}</MockProviderHook>,
    });
  };

  it('should not trigger query if skip prop is true', () => {
    const { result } = hook({ skip: true }, [mockRepairJobsFormData]);

    expect(result.current.dropdownOptions).toEqual({
      buildingNames: [],
      elevatorLocations: [],
      elevatorTypes: [],
      priorities: [],
      repairJobTypes: [],
      statuses: [],
      technicianNames: [],
      technicianSkills: [],
    });
    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toBeUndefined();
  });

  it('should fetch dropdown options by RepairJob config key', async () => {
    const { result, waitForNextUpdate } = hook(undefined, [mockRepairJobsFormData]);

    await waitForNextUpdate();

    const mockDropdownOptions = {
      buildingNames: [
        { label: 'Bayview Condominiums', value: 'Bayview Condominiums' },
        { label: 'Beacon Heights Office Complex', value: 'Beacon Heights Office Complex' },
        { label: 'Bluewater Hotel', value: 'Bluewater Hotel' },
      ],
      elevatorLocations: [
        { label: 'Art Gallery', value: 'Art Gallery' },
        { label: 'Auditorium', value: 'Auditorium' },
        { label: 'Basement Garage', value: 'Basement Garage' },
      ],
      elevatorTypes: [
        { label: 'Auto-Elevator', value: 'Auto-Elevator' },
        { label: 'Baggage Lift', value: 'Baggage Lift' },
        { label: 'Battery Powered Lift', value: 'Battery Powered Lift' },
      ],
      priorities: [
        { label: 'High', value: 'High' },
        { label: 'Low', value: 'Low' },
        { label: 'Medium', value: 'Medium' },
      ],
      repairJobTypes: [
        { label: 'Compliance', value: 'Compliance' },
        { label: 'Consultation', value: 'Consultation' },
        { label: 'Emergency', value: 'Emergency' },
      ],
      statuses: [
        { label: 'Cancelled', value: 'Cancelled' },
        { label: 'Completed', value: 'Completed' },
        { label: 'In Progress', value: 'In Progress' },
        { label: 'On Hold', value: 'On Hold' },
        { label: 'Scheduled', value: 'Scheduled' },
      ],
      technicianNames: [
        { label: 'Alice Johnson', value: 'Alice Johnson' },
        { label: 'Ava Young', value: 'Ava Young' },
        { label: 'Benjamin Hall', value: 'Benjamin Hall' },
      ],
      technicianSkills: [
        { label: 'Blueprint Reading', value: 'Blueprint Reading' },
        { label: 'Customer Service', value: 'Customer Service' },
        { label: 'Electrical', value: 'Electrical' },
      ],
    };

    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toBeUndefined();
    expect(result.current.dropdownOptions).toEqual(mockDropdownOptions);
  });

  it('should fetch dropdown options by ElevatorManagement config key', async () => {
    const { result, waitForNextUpdate } = hook({ configKey: DropdownOptions.ElevatorManagement }, [
      mockElevatorRecordsFormData,
    ]);

    await waitForNextUpdate();

    const mockDropdownOptions = {
      buildingNames: [
        { label: 'Clearwater Towers', value: 'Clearwater Towers' },
        { label: 'Coastal Heights', value: 'Coastal Heights' },
        { label: 'Crystal Bay Apartments', value: 'Crystal Bay Apartments' },
        { label: 'Silverhill Apartments', value: 'Silverhill Apartments' },
      ],
      elevatorLocations: [
        { label: 'Warehouse', value: 'Warehouse' },
        { label: 'Warehouse Level', value: 'Warehouse Level' },
        { label: 'Workshop', value: 'Workshop' },
        { label: 'Penthouse', value: 'Penthouse' },
      ],
      elevatorStatuses: [
        { label: 'Operational', value: 'Operational' },
        { label: 'Out of Service', value: 'Out of Service' },
        { label: 'Paused', value: 'Paused' },
        { label: 'Under Maintenance', value: 'Under Maintenance' },
      ],
      elevatorTypes: [
        { label: 'Auto-Elevator', value: 'Auto-Elevator' },
        { label: 'Baggage Lift', value: 'Baggage Lift' },
        { label: 'Glass Elevator', value: 'Glass Elevator' },
      ],
    };

    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toBeUndefined();
    expect(result.current.dropdownOptions).toEqual(mockDropdownOptions);
  });

  it('should fetch dropdown options by TechnicianManagement config key', async () => {
    const { result, waitForNextUpdate } = hook({ configKey: DropdownOptions.TechnicianManagement }, [
      mockTechnicianRecordsFormData,
    ]);

    await waitForNextUpdate();

    const mockDropdownOptions = {
      availabilityStatuses: [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' },
      ],
      certifications: [
        { label: 'Certified Elevator Technician', value: 'Certified Elevator Technician' },
        { label: 'First Aid Certification', value: 'First Aid Certification' },
      ],
      employmentStatuses: [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' },
      ],
      skills: [
        { label: 'Electrical', value: 'Electrical' },
        { label: 'Mechanical', value: 'Mechanical' },
        { label: 'Troubleshooting', value: 'Troubleshooting' },
      ],
    };

    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toBeUndefined();
    expect(result.current.dropdownOptions).toEqual(mockDropdownOptions);
  });

  it('should handle error when query fails', async () => {
    jest.spyOn(apollo, 'useQuery').mockImplementation(() => {
      return {
        data: undefined,
        loading: false,
        error: { message: 'Error Occurs' },
      } as apollo.QueryResult;
    });

    const { result } = hook();

    expect(result.current.loading).toBeFalsy();
    expect(result.current.dropdownOptions).toEqual({
      buildingNames: [],
      elevatorLocations: [],
      elevatorTypes: [],
      priorities: [],
      repairJobTypes: [],
      statuses: [],
      technicianNames: [],
      technicianSkills: [],
    });
    expect(result.current.error).toBe('Error Occurs');
  });
});
