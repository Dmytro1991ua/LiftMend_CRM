import { ElevatorRecord } from '@/shared/types';

import { ElevatorRecordFormValues } from './types';

export const convertElevatorRecordToFormValues = (elevatorRecord: ElevatorRecord): ElevatorRecordFormValues => ({
  elevatorType: elevatorRecord ? elevatorRecord.elevatorType : null,
  capacity: elevatorRecord ? elevatorRecord.capacity : null,
  buildingName: elevatorRecord ? elevatorRecord.buildingName : null,
  elevatorLocation: elevatorRecord ? elevatorRecord.elevatorLocation : null,
  technicianName: elevatorRecord ? elevatorRecord.technicianName : null,
  contactInformation: elevatorRecord ? elevatorRecord.contactInformation : '',
  id: elevatorRecord ? elevatorRecord.id : '',
  status: elevatorRecord ? elevatorRecord.status : null,
  lastMaintenanceDate: elevatorRecord ? elevatorRecord.lastMaintenanceDate : undefined,
  nextMaintenanceDate: elevatorRecord ? elevatorRecord.nextMaintenanceDate : undefined,
});

export const convertFormFieldsToElevatorRecord = (formFields: ElevatorRecordFormValues): ElevatorRecord => ({
  elevatorType: formFields.elevatorType ?? '',
  capacity: formFields.capacity ?? null,
  lastMaintenanceDate: formFields.lastMaintenanceDate ?? new Date(),
  nextMaintenanceDate: formFields.nextMaintenanceDate ?? new Date(),
  buildingName: formFields.buildingName ?? '',
  elevatorLocation: formFields.elevatorLocation ?? '',
  technicianName: formFields.technicianName ?? '',
  contactInformation: formFields.contactInformation ?? '',
  id: formFields.id ?? '',
  status: formFields.status ?? '',
});
