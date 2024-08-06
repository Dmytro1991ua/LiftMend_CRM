export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type BuildingName = {
  __typename?: 'BuildingName';
  id: Scalars['ID']['output'];
  names: Array<Scalars['String']['output']>;
};

export type ElevatorLocation = {
  __typename?: 'ElevatorLocation';
  id: Scalars['ID']['output'];
  locations: Array<Scalars['String']['output']>;
};

export type ElevatorType = {
  __typename?: 'ElevatorType';
  id: Scalars['ID']['output'];
  types: Array<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  getRepairJobScheduleData: RepairJobScheduleData;
};

export type RepairJobPriority = {
  __typename?: 'RepairJobPriority';
  id: Scalars['ID']['output'];
  priorities: Array<Scalars['String']['output']>;
};

export type RepairJobScheduleData = {
  __typename?: 'RepairJobScheduleData';
  buildingNames: Array<Scalars['String']['output']>;
  elevatorLocations: Array<Scalars['String']['output']>;
  elevatorTypes: Array<Scalars['String']['output']>;
  priorities: Array<Scalars['String']['output']>;
  repairJobTypes: Array<Scalars['String']['output']>;
  technicianNames: Array<Scalars['String']['output']>;
  technicianSkills: Array<Scalars['String']['output']>;
};

export type RepairJobType = {
  __typename?: 'RepairJobType';
  id: Scalars['ID']['output'];
  types: Array<Scalars['String']['output']>;
};

export type TechnicianName = {
  __typename?: 'TechnicianName';
  id: Scalars['ID']['output'];
  names: Array<Scalars['String']['output']>;
};

export type TechnicianSkill = {
  __typename?: 'TechnicianSkill';
  id: Scalars['ID']['output'];
  skills: Array<Scalars['String']['output']>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Maybe<Scalars['String']['output']>;
};

export type Get_Repair_Job_Schedule_DataQueryVariables = Exact<{ [key: string]: never }>;

export type Get_Repair_Job_Schedule_DataQuery = {
  __typename?: 'Query';
  getRepairJobScheduleData: {
    __typename?: 'RepairJobScheduleData';
    repairJobTypes: Array<string>;
    elevatorTypes: Array<string>;
    buildingNames: Array<string>;
    elevatorLocations: Array<string>;
    technicianNames: Array<string>;
    technicianSkills: Array<string>;
    priorities: Array<string>;
  };
};
