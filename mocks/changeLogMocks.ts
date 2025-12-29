export const mockRepairJobChangeLogUserId = 'test-change-log-user-id';
export const mockRepairJobChangeLogId = 'test-change-log-id';
export const mockRepairJobChangeLogEntityId = 'test-change-log-entity-id';

export const mocCalendarEventChangeLogUserId = 'test-change-log-user-id-2';
export const mocCalendarEventChangeLogId = 'test-change-log-id-2';
export const mocCalendarEventChangeLogEntityId = 'test-change-log-entity-id-2';

export const mockRepairJobChangeLog = {
  userId: mockRepairJobChangeLogUserId,
  id: mockRepairJobChangeLogId,
  entityType: 'RepairJob',
  entityId: mockRepairJobChangeLogEntityId,
  field: '*',
  oldValue: null,
  newValue: {
    id: mockRepairJobChangeLogEntityId,
    jobType: 'Emergency',
    jobDetails: 'sdadasdasasdas',
    elevatorType: 'Ship Elevator',
    buildingName: 'Bayview Condominiums',
    elevatorLocation: 'Kitchen',
    technicianName: 'Ava Young',
    startDate: '2025-12-28T08:00:00.000Z',
    endDate: '2025-12-28T11:00:00.000Z',
    calendarEventId: null,
    jobPriority: 'High',
    status: 'Scheduled',
    actualEndDate: null,
    isOverdue: false,
    createdAt: '2025-12-27T18:08:21.374Z',
    updatedAt: '2025-12-27T18:08:21.374Z',
    elevatorId: 'cdd361e9-53b7-486a-a0a9-465a43787f64',
    technicianId: '31114b1d-eb1f-4c1f-9602-979f1e6d90cf',
  },
};

export const mockCalendarEventChangeLog = {
  userId: mocCalendarEventChangeLogUserId,
  id: mocCalendarEventChangeLogId,
  entityType: 'CalendarEvent',
  entityId: mocCalendarEventChangeLogEntityId,
  field: '*',
  oldValue: null,
  newValue: {
    id: mocCalendarEventChangeLogEntityId,
    title: 'Emergency Repair Job',
    start: '2025-12-28T08:00:00.000Z',
    end: '2025-12-28T11:00:00.000Z',
    description: 'Repair Job for Ship Elevator at Bayview Condominiums - Kitchen',
    allDay: false,
    repairJobId: 'f00442c5-ab22-445d-af55-b8012bf5fe6e',
  },
  action: 'create',
  createdAt: '2025-12-27T18:08:22.199Z',
};

export const mockedReturnedChangeLogsData = {
  getChangeLogs: {
    edges: [
      {
        cursor: mockRepairJobChangeLogUserId,
        node: { ...mockRepairJobChangeLog, __typename: 'ChangeLog' },
        __typename: 'ChangeLogEdge',
      },
    ],
    pageInfo: {
      hasNextPage: true,
      hasPreviousPage: false,
      startCursor: mockRepairJobChangeLogUserId,
      endCursor: mockRepairJobChangeLogUserId,
      __typename: 'PageInfo',
    },
    total: 1,
    __typename: 'ChangeLogConnection',
  },
};
