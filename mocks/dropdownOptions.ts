export const mockElevatorTypes = {
  elevatorTypes: [
    { value: 'Auto-Elevator', label: 'Auto-Elevator' },
    { value: 'Baggage Lift', label: 'Baggage Lift' },
    { value: 'Glass Elevator', label: 'Glass Elevator' },
  ],
};

export const mockBuildingNames = {
  buildingNames: [
    { value: 'Clearwater Towers', label: 'Clearwater Towers' },
    { value: 'Coastal Heights', label: 'Coastal Heights' },
    { value: 'Crystal Bay Apartments', label: 'Crystal Bay Apartments' },
    { value: 'Silverhill Apartments', label: 'Silverhill Apartments' },
  ],
};

export const mockElevatorLocations = {
  elevatorLocations: [
    { value: 'Warehouse', label: 'Warehouse' },
    { value: 'Warehouse Level', label: 'Warehouse Level' },
    { value: 'Workshop', label: 'Workshop' },
    { value: 'Penthouse', label: 'Penthouse' },
  ],
};

export const mockElevatorStatuses = {
  elevatorStatuses: [
    { value: 'Operational', label: 'Operational' },
    { value: 'Out of Service', label: 'Out of Service' },
    { value: 'Paused', label: 'Paused' },
    { value: 'Under Maintenance', label: 'Under Maintenance' },
  ],
};

export const mockRepairJobTypes = {
  repairJobTypes: {
    repairJobTypes: [
      { value: 'Compliance', label: 'Compliance' },
      { value: 'Consultation', label: 'Consultation' },
      { value: 'Emergency', label: 'Emergency' },
    ],
  },
};

export const mockRepairJobPriorities = {
  priorities: [
    { value: 'High', label: 'High' },
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
  ],
};

export const mockAvailableTechnicianStatuses = {
  availabilityStatuses: ['Available', 'Busy', 'Inactive', 'On Leave', 'Reserved', 'Unavailable'],
};

export const mockTechnicianEmploymentStatus = { employmentStatuses: ['Active', 'Inactive'] };

export const mockTechnicianCertificates = {
  certifications: ['Advanced Welding Certification', 'Certified Elevator Technician'],
};

export const mockTechnicianSkills = {
  skills: ['Blueprint Reading', 'Customer Service'],
};

export const mockElevatorManagementDropdownOptions = {
  ...mockElevatorTypes,
  ...mockBuildingNames,
  ...mockElevatorLocations,
  ...mockElevatorStatuses,
};

export const mockRepairJobSchedulingDropdownOptions = {
  ...mockRepairJobTypes,
  ...mockRepairJobPriorities,
};

export const mockTechnicalManagementDropdownOptions = {
  ...mockTechnicianEmploymentStatus,
  ...mockAvailableTechnicianStatuses,
  ...mockTechnicianCertificates,
  ...mockTechnicianSkills,
};
