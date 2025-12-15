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
    'isOverdue',
  ],
  'sortOptions',
  ['field', 'order'],
];

export const ELEVATOR_RECORD_KEY_FIELDS = [
  'filterOptions',
  ['searchTerm', 'elevatorType', 'buildingName', 'elevatorLocation', 'status'],
  'sortOptions',
  ['field', 'order'],
];

export const TECHNICIAN_RECORD_KEY_FIELDS = [
  'filterOptions',
  ['searchTerm', 'availabilityStatus', 'employmentStatus', 'skills', 'certifications'],
  'sortOptions',
  ['field', 'order'],
];

export const ELEVATOR_MAINTENANCE_HISTORY_KEY_FIELDS = ['buildingName', 'elevatorLocation'];

export const NOTIFICATIONS_KEY_FIELDS = ['filterOptions', ['category', 'status']];
