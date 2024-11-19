export const REPAIR_JOB_KEY_FIELDS = [
  'filterOptions',
  [
    'searchTerm',
    'jobType',
    'jobPriority',
    'elevatorType',
    'buildingName',
    'elevatorLocation',
    'technicianName',
    'status',
  ],
  'sortOptions',
  ['field', 'order'],
];

export const ELEVATOR_RECORD_KEY_FIELDS = [
  'filterOptions',
  ['searchTerm', 'elevatorType', 'buildingName', 'elevatorLocation', 'technicianName', 'status'],
  'sortOptions',
  ['field', 'order'],
];

export const TECHNICIAN_RECORD_KEY_FIELDS = [
  'filterOptions',
  ['searchTerm', 'availabilityStatus', 'employmentStatus', 'skills', 'certifications'],
];
