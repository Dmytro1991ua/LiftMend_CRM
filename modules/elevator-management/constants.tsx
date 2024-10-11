import ElevatorDetails from './components/elevator-record-form/steps/elevator-details';
import MaintenanceInformation from './components/elevator-record-form/steps/maintenance-information';
import TechnicianInformation from './components/elevator-record-form/steps/technician-information';
import { ElevatorRecordFormFields } from './components/elevator-record-form/validation';
import { ElevatorRecordSteps } from './types';

export { ElevatorRecordSteps } from './types';

export const ADD_ELEVATOR_RECORD_BUTTON_LABEL = 'Add Elevator Record';

export const ELEVATOR_RECORD_FORM_STEPS = [
  { id: ElevatorRecordSteps.ElevatorDetails, value: 'Elevator Details' },
  { id: ElevatorRecordSteps.MaintenanceInformation, value: 'Maintenance Information' },
  { id: ElevatorRecordSteps.TechnicianInformation, value: 'Technician Information' },
];

export const ELEVATOR_RECORD_STEP_CONTENT_CONFIG: Record<ElevatorRecordSteps, React.ReactNode> = {
  [ElevatorRecordSteps.ElevatorDetails]: <ElevatorDetails />,
  [ElevatorRecordSteps.MaintenanceInformation]: <MaintenanceInformation />,
  [ElevatorRecordSteps.TechnicianInformation]: <TechnicianInformation />,
};

export const ELEVATOR_RECORD_STEP_STEP_VALIDATION_CONFIG: Record<number, keyof ElevatorRecordFormFields> = {
  0: 'elevatorDetails',
  1: 'maintenanceInfo',
  2: 'technicianInfo',
};

export const DEFAULT_ELEVATOR_MANAGEMENT_SEARCH_INPUT_PLACEHOLDER = 'Search by Record ID';

export const DEFAULT_ELEVATOR_RECORD_SUCCESS_MESSAGE = 'Successfully created elevator record';
export const DEFAULT_ELEVATOR_RECORD_FAIL_MESSAGE = 'Failed to create an elevator record';
