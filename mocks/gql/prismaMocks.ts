import { PrismaClient } from '@prisma/client';

export const authServicePrismaMock = {
  user: {
    create: jest.fn(),
  },
} as unknown as PrismaClient;

export const calendarEventServicePrismaMock = {
  calendarEvent: {
    create: jest.fn(),
    delete: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
} as unknown as PrismaClient;

export const elevatorRecordServicePrismaMock = {
  elevatorRecord: {
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  elevatorTypes: {},
  buildingNames: {},
  elevatorLocations: {},
  elevatorStatuses: {},
} as unknown as PrismaClient;

export const repairJobServicePrismaMock = {
  repairJob: {
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
  repairJobTypes: {},
  elevatorTypes: {},
  buildingNames: {},
  elevatorLocations: {},
  technicianNames: {},
  technicianSkills: {},
  priorities: {},
  statuses: {},
  elevatorRecord: {
    findMany: jest.fn(),
  },
} as unknown as PrismaClient;

export const technicianRecordPrismaMock = {
  technicianRecord: {
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  availabilityStatuses: {},
  certifications: {},
  technicianSkills: {},
  employmentStatuses: {},
} as unknown as PrismaClient;

export const userServicePrismaMock = {
  user: {
    update: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
  storage: {
    from: jest.fn(),
  },
} as unknown as PrismaClient;

export const notificationServicePrismaMock = {
  notification: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
    updateMany: jest.fn(),
  },
} as unknown as PrismaClient;

export const changeLogPrismaMock = {
  changeLog: {
    create: jest.fn(),
  },
};
