export enum RepairJobTrackingSteps {
  JobDetails,
  ElevatorInformation,
  TechnicianAssignment,
}

export type FormFieldConfig = {
  id: number;
  content: JSX.Element;
};

export type TimePosition = 'start' | 'end';
