import { RepairJob } from '@/shared/types';

export const getReassignTechnicianWarningMessage = (repairJob: RepairJob) => {
  const { technicianName, jobType, buildingName, elevatorLocation } = repairJob;

  return `Reassigning ${technicianName} will unassign them from current ${jobType} repair job located at ${buildingName}, ${elevatorLocation}, if applicable. This could delay or interrupt their ongoing tasks. Ensure that this reassignment is necessary before proceeding with`;
};
