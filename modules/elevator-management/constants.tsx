import ElevatorDetails from './components/elevator-record-form/steps/elevator-details';
import MaintenanceInformation from './components/elevator-record-form/steps/maintenance-information';
import TechnicianInformation from './components/elevator-record-form/steps/technician-information';
import { ElevatorRecordSteps } from './types';

export { ElevatorRecordSteps } from './types';

export const ADD_ELEVATOR_RECORD_BUTTON_LABEL = 'Add Elevator Record';

export const ELEVATOR_RECORD_FORM_STEPS = [
  { id: ElevatorRecordSteps.ElevatorDetails, value: 'Elevator Details' },
  { id: ElevatorRecordSteps.MaintenanceInformation, value: 'Maintenance Information' },
  { id: ElevatorRecordSteps.TechnicianInformation, value: 'Technician Information' },
];

export const STEP_CONTENT_CONFIG: Record<ElevatorRecordSteps, React.ReactNode> = {
  [ElevatorRecordSteps.ElevatorDetails]: <ElevatorDetails />,
  [ElevatorRecordSteps.MaintenanceInformation]: <MaintenanceInformation />,
  [ElevatorRecordSteps.TechnicianInformation]: <TechnicianInformation />,
};
