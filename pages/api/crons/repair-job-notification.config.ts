import { RepairJob } from '@prisma/client';

import { formatDate } from '@/shared/utils';

import { isRepairJobOverdue, isRepairJobUpcoming, isRepairJobUrgent } from '../graphql/utils/utils';

import { NotificationRule } from './types';

type NotificationMessage = (job: RepairJob) => string;
type NotificationCategory = 'Overdue' | 'Upcoming' | 'Urgent';
type RepairJobNotificationContext = Date;
type NotificationCondition = (job: RepairJob, context?: RepairJobNotificationContext) => boolean;

export const REPAIR_JOB_NOTIFICATION_MESSAGE_CONFIG: Record<NotificationCategory, NotificationMessage> = {
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

export const REPAIR_JOB_NOTIFICATION_CONDITION_CONFIG: Record<NotificationCategory, NotificationCondition> = {
  Overdue: (job) => isRepairJobOverdue(job.endDate, job.status),
  Upcoming: (job, tomorrow) => (tomorrow ? isRepairJobUpcoming(job, tomorrow) : false),
  Urgent: (job) => isRepairJobUrgent(job),
};

export const REPAIR_JOB_NOTIFICATION_RULE_CONFIG: Record<
  NotificationCategory,
  NotificationRule<RepairJob, RepairJobNotificationContext>
> = {
  Overdue: {
    priority: 'High',
    condition: REPAIR_JOB_NOTIFICATION_CONDITION_CONFIG.Overdue,
    message: REPAIR_JOB_NOTIFICATION_MESSAGE_CONFIG.Overdue,
  },
  Upcoming: {
    priority: 'Medium',
    condition: REPAIR_JOB_NOTIFICATION_CONDITION_CONFIG.Upcoming,
    message: REPAIR_JOB_NOTIFICATION_MESSAGE_CONFIG.Upcoming,
  },
  Urgent: {
    priority: 'High',
    condition: REPAIR_JOB_NOTIFICATION_CONDITION_CONFIG.Urgent,
    message: REPAIR_JOB_NOTIFICATION_MESSAGE_CONFIG.Urgent,
  },
};
