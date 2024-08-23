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
  DateTime: { input: any; output: any };
};

export type BuildingName = {
  __typename?: 'BuildingName';
  id: Scalars['ID']['output'];
  names: Array<Scalars['String']['output']>;
};

export type CalendarEvent = {
  __typename?: 'CalendarEvent';
  allDay: Scalars['Boolean']['output'];
  description: Maybe<Scalars['String']['output']>;
  end: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  repairJobId: Maybe<Scalars['String']['output']>;
  start: Scalars['DateTime']['output'];
  title: Scalars['String']['output'];
};

export type CreateCalendarEventInput = {
  allDay: Scalars['Boolean']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  end: Scalars['DateTime']['input'];
  start: Scalars['DateTime']['input'];
  title: Scalars['String']['input'];
};

export type CreateRepairJobInput = {
  buildingName: Scalars['String']['input'];
  contactInformation: Scalars['String']['input'];
  elevatorLocation: Scalars['String']['input'];
  elevatorType: Scalars['String']['input'];
  endDate: Scalars['DateTime']['input'];
  jobDetails: Scalars['String']['input'];
  jobPriority: Scalars['String']['input'];
  jobType: Scalars['String']['input'];
  startDate: Scalars['DateTime']['input'];
  technicianName: Scalars['String']['input'];
  technicianSkills: Array<Scalars['String']['input']>;
};

export type DeleteCalendarAndRepairJobResponse = {
  __typename?: 'DeleteCalendarAndRepairJobResponse';
  deletedEventId: Maybe<Scalars['ID']['output']>;
  deletedRepairJobId: Maybe<Scalars['ID']['output']>;
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

export type Mutation = {
  __typename?: 'Mutation';
  createRepairJobAndEvent: ScheduledEventAndRepairJobResponse;
  deleteRepairJobAndEvent: DeleteCalendarAndRepairJobResponse;
  updateRepairJob: RepairJob;
};

export type MutationCreateRepairJobAndEventArgs = {
  calendarEventInput: CreateCalendarEventInput;
  repairJobInput: CreateRepairJobInput;
};

export type MutationDeleteRepairJobAndEventArgs = {
  calendarEventId: Scalars['ID']['input'];
  repairJobId: Scalars['ID']['input'];
};

export type MutationUpdateRepairJobArgs = {
  input: UpdateRepairJobInput;
};

export type Query = {
  __typename?: 'Query';
  getCalendarEvents: Array<CalendarEvent>;
  getRepairJobById: RepairJob;
  getRepairJobScheduleData: RepairJobScheduleData;
  getRepairJobs: Array<RepairJob>;
};

export type QueryGetRepairJobByIdArgs = {
  id: Scalars['ID']['input'];
};

export type RepairJob = {
  __typename?: 'RepairJob';
  buildingName: Scalars['String']['output'];
  calendarEventId: Maybe<Scalars['String']['output']>;
  contactInformation: Scalars['String']['output'];
  elevatorLocation: Scalars['String']['output'];
  elevatorType: Scalars['String']['output'];
  endDate: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  jobDetails: Scalars['String']['output'];
  jobPriority: Scalars['String']['output'];
  jobType: Scalars['String']['output'];
  startDate: Scalars['DateTime']['output'];
  technicianName: Scalars['String']['output'];
  technicianSkills: Array<Scalars['String']['output']>;
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

export type ScheduledEventAndRepairJobResponse = {
  __typename?: 'ScheduledEventAndRepairJobResponse';
  calendarEvent: CalendarEvent;
  repairJob: RepairJob;
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

export type UpdateRepairJobInput = {
  buildingName?: InputMaybe<Scalars['String']['input']>;
  contactInformation?: InputMaybe<Scalars['String']['input']>;
  elevatorLocation?: InputMaybe<Scalars['String']['input']>;
  elevatorType?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  id: Scalars['ID']['input'];
  jobDetails?: InputMaybe<Scalars['String']['input']>;
  jobPriority?: InputMaybe<Scalars['String']['input']>;
  jobType?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  technicianName?: InputMaybe<Scalars['String']['input']>;
  technicianSkills?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Maybe<Scalars['String']['output']>;
};

export type CalendarEventFieldsFragment = {
  __typename?: 'CalendarEvent';
  id: string;
  title: string;
  start: any;
  end: any;
  description: string | null;
  allDay: boolean;
  repairJobId: string | null;
};

export type RepairJobFieldsFragment = {
  __typename?: 'RepairJob';
  id: string;
  jobType: string;
  jobDetails: string;
  jobPriority: string;
  elevatorType: string;
  buildingName: string;
  elevatorLocation: string;
  technicianName: string;
  technicianSkills: Array<string>;
  contactInformation: string;
  startDate: any;
  endDate: any;
  calendarEventId: string | null;
};

export type CreateRepairJobAndCalendarEventMutationVariables = Exact<{
  repairJobInput: CreateRepairJobInput;
  calendarEventInput: CreateCalendarEventInput;
}>;

export type CreateRepairJobAndCalendarEventMutation = {
  __typename?: 'Mutation';
  createRepairJobAndEvent: {
    __typename?: 'ScheduledEventAndRepairJobResponse';
    repairJob: {
      __typename?: 'RepairJob';
      id: string;
      jobType: string;
      jobDetails: string;
      jobPriority: string;
      elevatorType: string;
      buildingName: string;
      elevatorLocation: string;
      technicianName: string;
      technicianSkills: Array<string>;
      contactInformation: string;
      startDate: any;
      endDate: any;
      calendarEventId: string | null;
    };
    calendarEvent: {
      __typename?: 'CalendarEvent';
      id: string;
      title: string;
      start: any;
      end: any;
      description: string | null;
      allDay: boolean;
      repairJobId: string | null;
    };
  };
};

export type DeleteRepairJobAndEventMutationVariables = Exact<{
  calendarEventId: Scalars['ID']['input'];
  repairJobId: Scalars['ID']['input'];
}>;

export type DeleteRepairJobAndEventMutation = {
  __typename?: 'Mutation';
  deleteRepairJobAndEvent: {
    __typename?: 'DeleteCalendarAndRepairJobResponse';
    deletedEventId: string | null;
    deletedRepairJobId: string | null;
  };
};

export type GetCalendarEventsQueryVariables = Exact<{ [key: string]: never }>;

export type GetCalendarEventsQuery = {
  __typename?: 'Query';
  getCalendarEvents: Array<{
    __typename?: 'CalendarEvent';
    allDay: boolean;
    end: any;
    id: string;
    start: any;
    title: string;
    description: string | null;
    repairJobId: string | null;
  }>;
};

export type GetRepairJobByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type GetRepairJobByIdQuery = {
  __typename?: 'Query';
  getRepairJobById: {
    __typename?: 'RepairJob';
    id: string;
    jobType: string;
    jobDetails: string;
    jobPriority: string;
    elevatorType: string;
    buildingName: string;
    elevatorLocation: string;
    technicianName: string;
    technicianSkills: Array<string>;
    contactInformation: string;
    startDate: any;
    endDate: any;
  };
};

export type GetRepairJobFromDataQueryVariables = Exact<{ [key: string]: never }>;

export type GetRepairJobFromDataQuery = {
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

export type UpdateRepairJobMutationVariables = Exact<{
  input: UpdateRepairJobInput;
}>;

export type UpdateRepairJobMutation = {
  __typename?: 'Mutation';
  updateRepairJob: {
    __typename?: 'RepairJob';
    id: string;
    jobType: string;
    jobDetails: string;
    jobPriority: string;
    elevatorType: string;
    buildingName: string;
    elevatorLocation: string;
    technicianName: string;
    technicianSkills: Array<string>;
    contactInformation: string;
    startDate: any;
    endDate: any;
    calendarEventId: string | null;
  };
};
