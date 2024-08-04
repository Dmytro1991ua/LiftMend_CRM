import { JobTypes, Priorities } from '@prisma/client';
import { orderBy as _orderBy } from 'lodash';

import { QueryResolvers } from '@/graphql/types/server/generated_types';

import prisma from '../../../../prisma/db';

const Query: QueryResolvers = {
  hello: () => 'world',
  getRepairJobPriorities: async () => {
    try {
      const priorities: Priorities[] = await prisma.priorities.findMany();

      return priorities.flatMap(({ priorities }) => _orderBy(priorities));
    } catch (error) {
      throw new Error('Failed to fetch repair job priorities');
    }
  },
  getRepairJobTypes: async () => {
    try {
      const jobTypes: JobTypes[] = await prisma.jobTypes.findMany();

      return jobTypes.flatMap(({ job_types }) => _orderBy(job_types));
    } catch (error) {
      console.log(error);
      throw new Error('Failed to fetch repair job types');
    }
  },
  getElevatorTypes: async () => {
    try {
      const elevatorTypes = await prisma.elevatorTypes.findMany();

      return elevatorTypes.flatMap(({ elevator_types }) => _orderBy(elevator_types));
    } catch (error) {
      console.log(error);
      throw new Error('Failed to fetch elevator types');
    }
  },
  getBuildingNames: async () => {
    try {
      const buildingNames = await prisma.buildingNames.findMany();

      return buildingNames.flatMap(({ building_names }) => _orderBy(building_names));
    } catch (error) {
      console.log(error);
      throw new Error('Failed to fetch building names');
    }
  },
  getElevatorLocations: async () => {
    try {
      const elevatorLocations = await prisma.elevatorLocations.findMany();

      return elevatorLocations.flatMap(({ locations }) => _orderBy(locations));
    } catch (error) {
      console.log(error);
      throw new Error('Failed to fetch elevator locations');
    }
  },
  getTechnicianNames: async () => {
    try {
      const technicianNames = await prisma.technicianNames.findMany();

      return technicianNames.flatMap(({ names }) => _orderBy(names));
    } catch (error) {
      console.log(error);
      throw new Error('Failed to fetch technician names');
    }
  },
  getTechnicianSkills: async () => {
    try {
      const technicianSkills = await prisma.technicianSkills.findMany();

      return technicianSkills.flatMap(({ skills }) => _orderBy(skills));
    } catch (error) {
      console.log(error);
      throw new Error('Failed to fetch technician skills');
    }
  },
};

export default Query;
