import { RepairJob } from '@prisma/client';

import { formatDate } from '@/shared/utils';

import { isRepairJobOverdue, isRepairJobUpcoming, isRepairJobUrgent } from '../graphql/utils/utils';

type NotificationPriority = 'Medium' | 'High';
type NotificationMessage = (job: RepairJob) => string;
type NotificationCategory = 'Overdue' | 'Upcoming' | 'Urgent';
type NotificationCondition = (job: RepairJob, tomorrow: Date) => boolean;

export type NotificationRule = {
  priority: NotificationPriority;
  condition: (job: RepairJob, tomorrow: Date) => boolean;
  message: (job: RepairJob) => string;
};

export const NOTIFICATION_MESSAGE_CONFIG: Record<NotificationCategory, NotificationMessage> = {
  Overdue: ({ elevatorType, buildingName, elevatorLocation, technicianName, endDate }) =>
    `Overdue Repair Job for ${elevatorType} at ${buildingName} (${elevatorLocation}). Scheduled completion date: ${formatDate(
      new Date(endDate)
    )}. Technician: ${technicianName}.`,
  Upcoming: ({ elevatorType, buildingName, elevatorLocation, technicianName }) =>
    `Upcoming Repair Job for ${elevatorType} at ${buildingName} (${elevatorLocation}) scheduled for tomorrow. Technician: ${technicianName}.`,
  Urgent: ({ elevatorType, buildingName, elevatorLocation, technicianName, startDate }) =>
    `High-priority Repair Job for ${elevatorType} at ${buildingName} (${elevatorLocation}). Scheduled start date: ${formatDate(
      new Date(startDate)
    )}. Technician: ${technicianName}.`,
};

export const NOTIFICATION_CONDITION_CONFIG: Record<NotificationCategory, NotificationCondition> = {
  Overdue: (job: RepairJob) => isRepairJobOverdue(job.endDate, job.status),
  Upcoming: (job: RepairJob, tomorrow: Date) => isRepairJobUpcoming(job, tomorrow),
  Urgent: (job: RepairJob) => isRepairJobUrgent(job),
};

export const NOTIFICATION_RULE_CONFIG: Record<NotificationCategory, NotificationRule> = {
  Overdue: {
    priority: 'High',
    condition: NOTIFICATION_CONDITION_CONFIG.Overdue,
    message: NOTIFICATION_MESSAGE_CONFIG.Overdue,
  },
  Upcoming: {
    priority: 'Medium',
    condition: NOTIFICATION_CONDITION_CONFIG.Upcoming,
    message: NOTIFICATION_MESSAGE_CONFIG.Upcoming,
  },
  Urgent: {
    priority: 'High',
    condition: NOTIFICATION_CONDITION_CONFIG.Urgent,
    message: NOTIFICATION_MESSAGE_CONFIG.Urgent,
  },
};
