import ElevatorDetails from './components/elevator-record-form/steps/elevator-details';
import MaintenanceInformation from './components/elevator-record-form/steps/maintenance-information';
import { ElevatorRecordFormFields } from './components/elevator-record-form/validation';
import { ElevatorRecordSteps } from './types';

export { ElevatorRecordSteps } from './types';

export const ADD_ELEVATOR_RECORD_BUTTON_LABEL = 'Add Elevator Record';

export const ELEVATOR_RECORD_FORM_STEPS = [
  { id: ElevatorRecordSteps.ElevatorDetails, value: 'Elevator Details' },
  { id: ElevatorRecordSteps.MaintenanceInformation, value: 'Maintenance Information' },
];

export const ELEVATOR_RECORD_STEP_CONTENT_CONFIG: Record<ElevatorRecordSteps, React.ReactNode> = {
  [ElevatorRecordSteps.ElevatorDetails]: <ElevatorDetails />,
  [ElevatorRecordSteps.MaintenanceInformation]: <MaintenanceInformation />,
};

export const ELEVATOR_RECORD_STEP_VALIDATION_CONFIG: Record<number, keyof ElevatorRecordFormFields> = {
  0: 'elevatorDetails',
  1: 'maintenanceInfo',
};

export const DEFAULT_ELEVATOR_MANAGEMENT_SEARCH_INPUT_PLACEHOLDER = 'Search by Record ID';
export const DEFAULT_ELEVATOR_RECORD_SUCCESS_MESSAGE = 'Successfully created elevator record';
export const DEFAULT_ELEVATOR_RECORD_FAIL_MESSAGE = 'Failed to create an elevator record';
export const DEFAULT_DELETE_ELEVATOR_MODAL_TITLE = 'Delete elevator record';
export const DEFAULT_ELEVATOR_RECORDS_TABLE_EMPTY_TABLE_MESSAGE =
  'No data available. Please create a new elevator record in the table to keep track of it or apply different filter.';
