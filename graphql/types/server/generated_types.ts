import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { User as UserModel } from '@prisma/client';
import { Context } from '@/pages/api/graphql/types';
export type Maybe<T> = T | undefined | null;
export type InputMaybe<T> = T | undefined | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  DateTime: { input: any; output: any };
};

export type CalendarEvent = {
  __typename?: 'CalendarEvent';
  allDay: Scalars['Boolean']['output'];
  description?: Maybe<Scalars['String']['output']>;
  end: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  repairJobId?: Maybe<Scalars['String']['output']>;
  start: Scalars['DateTime']['output'];
  title: Scalars['String']['output'];
};

export type Connection = {
  edges: Array<Edge>;
  pageInfo: PageInfo;
  total: Scalars['Int']['output'];
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
  elevatorLocation: Scalars['String']['input'];
  elevatorType: Scalars['String']['input'];
  endDate: Scalars['DateTime']['input'];
  jobDetails: Scalars['String']['input'];
  jobPriority: Scalars['String']['input'];
  jobType: Scalars['String']['input'];
  startDate: Scalars['DateTime']['input'];
  technicianName: Scalars['String']['input'];
};

export type CreateTechnicianRecordInput = {
  availabilityStatus?: InputMaybe<Scalars['String']['input']>;
  certifications?: InputMaybe<Array<Scalars['String']['input']>>;
  contactInformation: Scalars['String']['input'];
  employmentStatus?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  skills: Array<Scalars['String']['input']>;
};

export type DeleteCalendarAndRepairJobResponse = {
  __typename?: 'DeleteCalendarAndRepairJobResponse';
  deletedEventId?: Maybe<Scalars['ID']['output']>;
  deletedRepairJobId?: Maybe<Scalars['ID']['output']>;
};

export type DeleteElevatorRecordResponse = {
  __typename?: 'DeleteElevatorRecordResponse';
  id: Scalars['ID']['output'];
};

export type DeleteTechnicianRecordResponse = {
  __typename?: 'DeleteTechnicianRecordResponse';
  id: Scalars['ID']['output'];
};

export type Edge = {
  cursor: Scalars['String']['output'];
  node: Node;
};

export type ElevatorDetails = {
  __typename?: 'ElevatorDetails';
  elevatorLocations: Array<Scalars['String']['output']>;
  elevatorTypes: Array<Scalars['String']['output']>;
};

export type ElevatorRecord = Node & {
  __typename?: 'ElevatorRecord';
  buildingName: Scalars['String']['output'];
  capacity: Scalars['Int']['output'];
  elevatorLocation: Scalars['String']['output'];
  elevatorType: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastKnownStatus?: Maybe<Scalars['String']['output']>;
  lastMaintenanceDate: Scalars['DateTime']['output'];
  nextMaintenanceDate: Scalars['DateTime']['output'];
  status: Scalars['String']['output'];
};

export type ElevatorRecordConnection = Connection & {
  __typename?: 'ElevatorRecordConnection';
  edges: Array<ElevatorRecordEdge>;
  pageInfo: PageInfo;
  total: Scalars['Int']['output'];
};

export type ElevatorRecordEdge = Edge & {
  __typename?: 'ElevatorRecordEdge';
  cursor: Scalars['String']['output'];
  node: ElevatorRecord;
};

export type ElevatorRecordFilterOptions = {
  buildingName?: InputMaybe<Array<Scalars['String']['input']>>;
  elevatorLocation?: InputMaybe<Array<Scalars['String']['input']>>;
  elevatorType?: InputMaybe<Array<Scalars['String']['input']>>;
  searchTerm?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type ElevatorRecordFormData = {
  __typename?: 'ElevatorRecordFormData';
  buildingNames: Array<Scalars['String']['output']>;
  elevatorLocations: Array<Scalars['String']['output']>;
  elevatorStatuses?: Maybe<Array<Scalars['String']['output']>>;
  elevatorTypes: Array<Scalars['String']['output']>;
};

export enum ElevatorRecordSortField {
  BuildingName = 'BUILDING_NAME',
  ElevatorLocation = 'ELEVATOR_LOCATION',
  ElevatorType = 'ELEVATOR_TYPE',
  LastMaintenanceDate = 'LAST_MAINTENANCE_DATE',
  NextMaintenanceDate = 'NEXT_MAINTENANCE_DATE',
  Status = 'STATUS',
}

export type ElevatorRecordSortInput = {
  field?: InputMaybe<ElevatorRecordSortField>;
  order?: InputMaybe<OrderOption>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createRepairJobAndEvent: ScheduledEventAndRepairJobResponse;
  createTechnicianRecord: TechnicianRecord;
  deleteElevatorRecord: DeleteElevatorRecordResponse;
  deleteRepairJobAndEvent: DeleteCalendarAndRepairJobResponse;
  deleteTechnicianRecord: DeleteTechnicianRecordResponse;
  reassignTechnician: RepairJob;
  updateElevatorRecord: ElevatorRecord;
  updateRepairJob: RepairJob;
  updateTechnicianRecord: TechnicianRecord;
};

export type MutationCreateRepairJobAndEventArgs = {
  calendarEventInput: CreateCalendarEventInput;
  repairJobInput: CreateRepairJobInput;
};

export type MutationCreateTechnicianRecordArgs = {
  input: CreateTechnicianRecordInput;
};

export type MutationDeleteElevatorRecordArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteRepairJobAndEventArgs = {
  calendarEventId: Scalars['ID']['input'];
  repairJobId: Scalars['ID']['input'];
};

export type MutationDeleteTechnicianRecordArgs = {
  id: Scalars['ID']['input'];
};

export type MutationReassignTechnicianArgs = {
  input: UpdateRepairJobInput;
};

export type MutationUpdateElevatorRecordArgs = {
  input: UpdateElevatorRecordInput;
};

export type MutationUpdateRepairJobArgs = {
  input: UpdateRepairJobInput;
};

export type MutationUpdateTechnicianRecordArgs = {
  input: UpdateTechnicianRecordInput;
};

export type Node = {
  id: Scalars['ID']['output'];
};

export enum OrderOption {
  Asc = 'ASC',
  Desc = 'DESC',
}

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PaginationOptions = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type Query = {
  __typename?: 'Query';
  getAvailableTechniciansForAssignment: Array<TechnicianRecord>;
  getCalendarEvents: Array<CalendarEvent>;
  getElevatorDetailsByBuildingName: ElevatorDetails;
  getElevatorRecordById: ElevatorRecord;
  getElevatorRecordFormData: ElevatorRecordFormData;
  getElevatorRecords: ElevatorRecordConnection;
  getRepairJobById: RepairJob;
  getRepairJobScheduleData: RepairJobScheduleData;
  getRepairJobs: RepairJobConnection;
  getTechnicianRecordById: TechnicianRecord;
  getTechnicianRecordFormData: TechnicianRecordFormData;
  getTechnicianRecords: TechnicianRecordConnection;
};

export type QueryGetElevatorDetailsByBuildingNameArgs = {
  buildingName: Scalars['String']['input'];
};

export type QueryGetElevatorRecordByIdArgs = {
  id: Scalars['ID']['input'];
};

export type QueryGetElevatorRecordsArgs = {
  filterOptions?: InputMaybe<ElevatorRecordFilterOptions>;
  paginationOptions?: InputMaybe<PaginationOptions>;
  sortOptions?: InputMaybe<ElevatorRecordSortInput>;
};

export type QueryGetRepairJobByIdArgs = {
  id: Scalars['ID']['input'];
};

export type QueryGetRepairJobsArgs = {
  filterOptions?: InputMaybe<RepairJobFilterOptions>;
  paginationOptions?: InputMaybe<PaginationOptions>;
  sortOptions?: InputMaybe<RepairJobSortInput>;
};

export type QueryGetTechnicianRecordByIdArgs = {
  id: Scalars['ID']['input'];
};

export type QueryGetTechnicianRecordsArgs = {
  filterOptions?: InputMaybe<TechnicianRecordFilterOptions>;
  paginationOptions?: InputMaybe<PaginationOptions>;
  sortOptions?: InputMaybe<TechnicianRecordSortInput>;
};

export type RepairJob = Node & {
  __typename?: 'RepairJob';
  actualEndDate?: Maybe<Scalars['DateTime']['output']>;
  buildingName: Scalars['String']['output'];
  calendarEventId?: Maybe<Scalars['String']['output']>;
  elevatorLocation: Scalars['String']['output'];
  elevatorType: Scalars['String']['output'];
  endDate: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  jobDetails: Scalars['String']['output'];
  jobPriority: Scalars['String']['output'];
  jobType: Scalars['String']['output'];
  startDate: Scalars['DateTime']['output'];
  status: Scalars['String']['output'];
  technicianName: Scalars['String']['output'];
};

export type RepairJobConnection = Connection & {
  __typename?: 'RepairJobConnection';
  edges: Array<RepairJobEdge>;
  pageInfo: PageInfo;
  total: Scalars['Int']['output'];
};

export type RepairJobEdge = Edge & {
  __typename?: 'RepairJobEdge';
  cursor: Scalars['String']['output'];
  node: RepairJob;
};

export type RepairJobFilterOptions = {
  buildingName?: InputMaybe<Array<Scalars['String']['input']>>;
  elevatorLocation?: InputMaybe<Array<Scalars['String']['input']>>;
  elevatorType?: InputMaybe<Array<Scalars['String']['input']>>;
  jobPriority?: InputMaybe<Array<Scalars['String']['input']>>;
  jobType?: InputMaybe<Array<Scalars['String']['input']>>;
  searchTerm?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Array<Scalars['String']['input']>>;
  technicianName?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type RepairJobScheduleData = {
  __typename?: 'RepairJobScheduleData';
  buildingNames: Array<Scalars['String']['output']>;
  elevatorLocations: Array<Scalars['String']['output']>;
  elevatorTypes: Array<Scalars['String']['output']>;
  priorities: Array<Scalars['String']['output']>;
  repairJobTypes: Array<Scalars['String']['output']>;
  statuses?: Maybe<Array<Scalars['String']['output']>>;
  technicianNames: Array<Scalars['String']['output']>;
  technicianSkills: Array<Scalars['String']['output']>;
};

export enum RepairJobSortField {
  BuildingName = 'BUILDING_NAME',
  ElevatorLocation = 'ELEVATOR_LOCATION',
  ElevatorType = 'ELEVATOR_TYPE',
  EndDate = 'END_DATE',
  JobPriority = 'JOB_PRIORITY',
  JobType = 'JOB_TYPE',
  StartDate = 'START_DATE',
  Status = 'STATUS',
  TechnicianName = 'TECHNICIAN_NAME',
}

export type RepairJobSortInput = {
  field?: InputMaybe<RepairJobSortField>;
  order?: InputMaybe<OrderOption>;
};

export type ScheduledEventAndRepairJobResponse = {
  __typename?: 'ScheduledEventAndRepairJobResponse';
  calendarEvent: CalendarEvent;
  repairJob: RepairJob;
};

export type TechnicianRecord = Node & {
  __typename?: 'TechnicianRecord';
  availabilityStatus?: Maybe<Scalars['String']['output']>;
  certifications: Array<Scalars['String']['output']>;
  contactInformation: Scalars['String']['output'];
  employmentStatus?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastKnownAvailabilityStatus?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  skills: Array<Scalars['String']['output']>;
};

export type TechnicianRecordConnection = Connection & {
  __typename?: 'TechnicianRecordConnection';
  edges: Array<TechnicianRecordEdges>;
  pageInfo: PageInfo;
  total: Scalars['Int']['output'];
};

export type TechnicianRecordEdges = Edge & {
  __typename?: 'TechnicianRecordEdges';
  cursor: Scalars['String']['output'];
  node: TechnicianRecord;
};

export type TechnicianRecordFilterOptions = {
  availabilityStatus?: InputMaybe<Array<Scalars['String']['input']>>;
  certifications?: InputMaybe<Array<Scalars['String']['input']>>;
  employmentStatus?: InputMaybe<Array<Scalars['String']['input']>>;
  searchTerm?: InputMaybe<Scalars['String']['input']>;
  skills?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type TechnicianRecordFormData = {
  __typename?: 'TechnicianRecordFormData';
  availabilityStatuses: Array<Scalars['String']['output']>;
  certifications: Array<Scalars['String']['output']>;
  employmentStatuses: Array<Scalars['String']['output']>;
  skills: Array<Scalars['String']['output']>;
};

export enum TechnicianRecordSortField {
  AvailabilityStatus = 'AVAILABILITY_STATUS',
  EmploymentStatus = 'EMPLOYMENT_STATUS',
  Name = 'NAME',
}

export type TechnicianRecordSortInput = {
  field?: InputMaybe<TechnicianRecordSortField>;
  order?: InputMaybe<OrderOption>;
};

export type UpdateElevatorRecordInput = {
  buildingName?: InputMaybe<Scalars['String']['input']>;
  capacity?: InputMaybe<Scalars['Int']['input']>;
  elevatorLocation?: InputMaybe<Scalars['String']['input']>;
  elevatorType?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  lastKnownStatus?: InputMaybe<Scalars['String']['input']>;
  lastMaintenanceDate?: InputMaybe<Scalars['DateTime']['input']>;
  nextMaintenanceDate?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateRepairJobInput = {
  buildingName?: InputMaybe<Scalars['String']['input']>;
  elevatorLocation?: InputMaybe<Scalars['String']['input']>;
  elevatorType?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  id: Scalars['ID']['input'];
  jobDetails?: InputMaybe<Scalars['String']['input']>;
  jobPriority?: InputMaybe<Scalars['String']['input']>;
  jobType?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  technicianName?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTechnicianRecordInput = {
  availabilityStatus?: InputMaybe<Scalars['String']['input']>;
  certifications?: InputMaybe<Array<Scalars['String']['input']>>;
  contactInformation?: InputMaybe<Scalars['String']['input']>;
  employmentStatus?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  lastKnownAvailabilityStatus?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  skills?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping of interface types */
export type ResolversInterfaceTypes<RefType extends Record<string, unknown>> = ResolversObject<{
  Connection: ElevatorRecordConnection | RepairJobConnection | TechnicianRecordConnection;
  Edge: ElevatorRecordEdge | RepairJobEdge | TechnicianRecordEdges;
  Node: ElevatorRecord | RepairJob | TechnicianRecord;
}>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CalendarEvent: ResolverTypeWrapper<CalendarEvent>;
  Connection: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Connection']>;
  CreateCalendarEventInput: CreateCalendarEventInput;
  CreateRepairJobInput: CreateRepairJobInput;
  CreateTechnicianRecordInput: CreateTechnicianRecordInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  DeleteCalendarAndRepairJobResponse: ResolverTypeWrapper<DeleteCalendarAndRepairJobResponse>;
  DeleteElevatorRecordResponse: ResolverTypeWrapper<DeleteElevatorRecordResponse>;
  DeleteTechnicianRecordResponse: ResolverTypeWrapper<DeleteTechnicianRecordResponse>;
  Edge: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Edge']>;
  ElevatorDetails: ResolverTypeWrapper<ElevatorDetails>;
  ElevatorRecord: ResolverTypeWrapper<ElevatorRecord>;
  ElevatorRecordConnection: ResolverTypeWrapper<ElevatorRecordConnection>;
  ElevatorRecordEdge: ResolverTypeWrapper<ElevatorRecordEdge>;
  ElevatorRecordFilterOptions: ElevatorRecordFilterOptions;
  ElevatorRecordFormData: ResolverTypeWrapper<ElevatorRecordFormData>;
  ElevatorRecordSortField: ElevatorRecordSortField;
  ElevatorRecordSortInput: ElevatorRecordSortInput;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Node: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Node']>;
  OrderOption: OrderOption;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  PaginationOptions: PaginationOptions;
  Query: ResolverTypeWrapper<{}>;
  RepairJob: ResolverTypeWrapper<RepairJob>;
  RepairJobConnection: ResolverTypeWrapper<RepairJobConnection>;
  RepairJobEdge: ResolverTypeWrapper<RepairJobEdge>;
  RepairJobFilterOptions: RepairJobFilterOptions;
  RepairJobScheduleData: ResolverTypeWrapper<RepairJobScheduleData>;
  RepairJobSortField: RepairJobSortField;
  RepairJobSortInput: RepairJobSortInput;
  ScheduledEventAndRepairJobResponse: ResolverTypeWrapper<ScheduledEventAndRepairJobResponse>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  TechnicianRecord: ResolverTypeWrapper<TechnicianRecord>;
  TechnicianRecordConnection: ResolverTypeWrapper<TechnicianRecordConnection>;
  TechnicianRecordEdges: ResolverTypeWrapper<TechnicianRecordEdges>;
  TechnicianRecordFilterOptions: TechnicianRecordFilterOptions;
  TechnicianRecordFormData: ResolverTypeWrapper<TechnicianRecordFormData>;
  TechnicianRecordSortField: TechnicianRecordSortField;
  TechnicianRecordSortInput: TechnicianRecordSortInput;
  UpdateElevatorRecordInput: UpdateElevatorRecordInput;
  UpdateRepairJobInput: UpdateRepairJobInput;
  UpdateTechnicianRecordInput: UpdateTechnicianRecordInput;
  User: ResolverTypeWrapper<UserModel>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  CalendarEvent: CalendarEvent;
  Connection: ResolversInterfaceTypes<ResolversParentTypes>['Connection'];
  CreateCalendarEventInput: CreateCalendarEventInput;
  CreateRepairJobInput: CreateRepairJobInput;
  CreateTechnicianRecordInput: CreateTechnicianRecordInput;
  DateTime: Scalars['DateTime']['output'];
  DeleteCalendarAndRepairJobResponse: DeleteCalendarAndRepairJobResponse;
  DeleteElevatorRecordResponse: DeleteElevatorRecordResponse;
  DeleteTechnicianRecordResponse: DeleteTechnicianRecordResponse;
  Edge: ResolversInterfaceTypes<ResolversParentTypes>['Edge'];
  ElevatorDetails: ElevatorDetails;
  ElevatorRecord: ElevatorRecord;
  ElevatorRecordConnection: ElevatorRecordConnection;
  ElevatorRecordEdge: ElevatorRecordEdge;
  ElevatorRecordFilterOptions: ElevatorRecordFilterOptions;
  ElevatorRecordFormData: ElevatorRecordFormData;
  ElevatorRecordSortInput: ElevatorRecordSortInput;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: {};
  Node: ResolversInterfaceTypes<ResolversParentTypes>['Node'];
  PageInfo: PageInfo;
  PaginationOptions: PaginationOptions;
  Query: {};
  RepairJob: RepairJob;
  RepairJobConnection: RepairJobConnection;
  RepairJobEdge: RepairJobEdge;
  RepairJobFilterOptions: RepairJobFilterOptions;
  RepairJobScheduleData: RepairJobScheduleData;
  RepairJobSortInput: RepairJobSortInput;
  ScheduledEventAndRepairJobResponse: ScheduledEventAndRepairJobResponse;
  String: Scalars['String']['output'];
  TechnicianRecord: TechnicianRecord;
  TechnicianRecordConnection: TechnicianRecordConnection;
  TechnicianRecordEdges: TechnicianRecordEdges;
  TechnicianRecordFilterOptions: TechnicianRecordFilterOptions;
  TechnicianRecordFormData: TechnicianRecordFormData;
  TechnicianRecordSortInput: TechnicianRecordSortInput;
  UpdateElevatorRecordInput: UpdateElevatorRecordInput;
  UpdateRepairJobInput: UpdateRepairJobInput;
  UpdateTechnicianRecordInput: UpdateTechnicianRecordInput;
  User: UserModel;
}>;

export type CalendarEventResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['CalendarEvent'] = ResolversParentTypes['CalendarEvent']
> = ResolversObject<{
  allDay?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  end?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  repairJobId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  start?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ConnectionResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Connection'] = ResolversParentTypes['Connection']
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    'ElevatorRecordConnection' | 'RepairJobConnection' | 'TechnicianRecordConnection',
    ParentType,
    ContextType
  >;
  edges?: Resolver<Array<ResolversTypes['Edge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DeleteCalendarAndRepairJobResponseResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['DeleteCalendarAndRepairJobResponse'] = ResolversParentTypes['DeleteCalendarAndRepairJobResponse']
> = ResolversObject<{
  deletedEventId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  deletedRepairJobId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DeleteElevatorRecordResponseResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['DeleteElevatorRecordResponse'] = ResolversParentTypes['DeleteElevatorRecordResponse']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DeleteTechnicianRecordResponseResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['DeleteTechnicianRecordResponse'] = ResolversParentTypes['DeleteTechnicianRecordResponse']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EdgeResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Edge'] = ResolversParentTypes['Edge']
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    'ElevatorRecordEdge' | 'RepairJobEdge' | 'TechnicianRecordEdges',
    ParentType,
    ContextType
  >;
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Node'], ParentType, ContextType>;
}>;

export type ElevatorDetailsResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['ElevatorDetails'] = ResolversParentTypes['ElevatorDetails']
> = ResolversObject<{
  elevatorLocations?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  elevatorTypes?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ElevatorRecordResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['ElevatorRecord'] = ResolversParentTypes['ElevatorRecord']
> = ResolversObject<{
  buildingName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  capacity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  elevatorLocation?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  elevatorType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastKnownStatus?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lastMaintenanceDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  nextMaintenanceDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ElevatorRecordConnectionResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['ElevatorRecordConnection'] = ResolversParentTypes['ElevatorRecordConnection']
> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['ElevatorRecordEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ElevatorRecordEdgeResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['ElevatorRecordEdge'] = ResolversParentTypes['ElevatorRecordEdge']
> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['ElevatorRecord'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ElevatorRecordFormDataResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['ElevatorRecordFormData'] = ResolversParentTypes['ElevatorRecordFormData']
> = ResolversObject<{
  buildingNames?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  elevatorLocations?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  elevatorStatuses?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  elevatorTypes?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = ResolversObject<{
  createRepairJobAndEvent?: Resolver<
    ResolversTypes['ScheduledEventAndRepairJobResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateRepairJobAndEventArgs, 'calendarEventInput' | 'repairJobInput'>
  >;
  createTechnicianRecord?: Resolver<
    ResolversTypes['TechnicianRecord'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateTechnicianRecordArgs, 'input'>
  >;
  deleteElevatorRecord?: Resolver<
    ResolversTypes['DeleteElevatorRecordResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteElevatorRecordArgs, 'id'>
  >;
  deleteRepairJobAndEvent?: Resolver<
    ResolversTypes['DeleteCalendarAndRepairJobResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteRepairJobAndEventArgs, 'calendarEventId' | 'repairJobId'>
  >;
  deleteTechnicianRecord?: Resolver<
    ResolversTypes['DeleteTechnicianRecordResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteTechnicianRecordArgs, 'id'>
  >;
  reassignTechnician?: Resolver<
    ResolversTypes['RepairJob'],
    ParentType,
    ContextType,
    RequireFields<MutationReassignTechnicianArgs, 'input'>
  >;
  updateElevatorRecord?: Resolver<
    ResolversTypes['ElevatorRecord'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateElevatorRecordArgs, 'input'>
  >;
  updateRepairJob?: Resolver<
    ResolversTypes['RepairJob'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateRepairJobArgs, 'input'>
  >;
  updateTechnicianRecord?: Resolver<
    ResolversTypes['TechnicianRecord'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateTechnicianRecordArgs, 'input'>
  >;
}>;

export type NodeResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']
> = ResolversObject<{
  __resolveType: TypeResolveFn<'ElevatorRecord' | 'RepairJob' | 'TechnicianRecord', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
}>;

export type PageInfoResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']
> = ResolversObject<{
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = ResolversObject<{
  getAvailableTechniciansForAssignment?: Resolver<Array<ResolversTypes['TechnicianRecord']>, ParentType, ContextType>;
  getCalendarEvents?: Resolver<Array<ResolversTypes['CalendarEvent']>, ParentType, ContextType>;
  getElevatorDetailsByBuildingName?: Resolver<
    ResolversTypes['ElevatorDetails'],
    ParentType,
    ContextType,
    RequireFields<QueryGetElevatorDetailsByBuildingNameArgs, 'buildingName'>
  >;
  getElevatorRecordById?: Resolver<
    ResolversTypes['ElevatorRecord'],
    ParentType,
    ContextType,
    RequireFields<QueryGetElevatorRecordByIdArgs, 'id'>
  >;
  getElevatorRecordFormData?: Resolver<ResolversTypes['ElevatorRecordFormData'], ParentType, ContextType>;
  getElevatorRecords?: Resolver<
    ResolversTypes['ElevatorRecordConnection'],
    ParentType,
    ContextType,
    Partial<QueryGetElevatorRecordsArgs>
  >;
  getRepairJobById?: Resolver<
    ResolversTypes['RepairJob'],
    ParentType,
    ContextType,
    RequireFields<QueryGetRepairJobByIdArgs, 'id'>
  >;
  getRepairJobScheduleData?: Resolver<ResolversTypes['RepairJobScheduleData'], ParentType, ContextType>;
  getRepairJobs?: Resolver<
    ResolversTypes['RepairJobConnection'],
    ParentType,
    ContextType,
    Partial<QueryGetRepairJobsArgs>
  >;
  getTechnicianRecordById?: Resolver<
    ResolversTypes['TechnicianRecord'],
    ParentType,
    ContextType,
    RequireFields<QueryGetTechnicianRecordByIdArgs, 'id'>
  >;
  getTechnicianRecordFormData?: Resolver<ResolversTypes['TechnicianRecordFormData'], ParentType, ContextType>;
  getTechnicianRecords?: Resolver<
    ResolversTypes['TechnicianRecordConnection'],
    ParentType,
    ContextType,
    Partial<QueryGetTechnicianRecordsArgs>
  >;
}>;

export type RepairJobResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['RepairJob'] = ResolversParentTypes['RepairJob']
> = ResolversObject<{
  actualEndDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  buildingName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  calendarEventId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  elevatorLocation?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  elevatorType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  endDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  jobDetails?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  jobPriority?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  jobType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  startDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  technicianName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RepairJobConnectionResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['RepairJobConnection'] = ResolversParentTypes['RepairJobConnection']
> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['RepairJobEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RepairJobEdgeResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['RepairJobEdge'] = ResolversParentTypes['RepairJobEdge']
> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['RepairJob'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RepairJobScheduleDataResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['RepairJobScheduleData'] = ResolversParentTypes['RepairJobScheduleData']
> = ResolversObject<{
  buildingNames?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  elevatorLocations?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  elevatorTypes?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  priorities?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  repairJobTypes?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  statuses?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  technicianNames?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  technicianSkills?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ScheduledEventAndRepairJobResponseResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['ScheduledEventAndRepairJobResponse'] = ResolversParentTypes['ScheduledEventAndRepairJobResponse']
> = ResolversObject<{
  calendarEvent?: Resolver<ResolversTypes['CalendarEvent'], ParentType, ContextType>;
  repairJob?: Resolver<ResolversTypes['RepairJob'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TechnicianRecordResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['TechnicianRecord'] = ResolversParentTypes['TechnicianRecord']
> = ResolversObject<{
  availabilityStatus?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  certifications?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  contactInformation?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  employmentStatus?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastKnownAvailabilityStatus?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  skills?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TechnicianRecordConnectionResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['TechnicianRecordConnection'] = ResolversParentTypes['TechnicianRecordConnection']
> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['TechnicianRecordEdges']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TechnicianRecordEdgesResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['TechnicianRecordEdges'] = ResolversParentTypes['TechnicianRecordEdges']
> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['TechnicianRecord'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TechnicianRecordFormDataResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['TechnicianRecordFormData'] = ResolversParentTypes['TechnicianRecordFormData']
> = ResolversObject<{
  availabilityStatuses?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  certifications?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  employmentStatuses?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  skills?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']
> = ResolversObject<{
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  CalendarEvent?: CalendarEventResolvers<ContextType>;
  Connection?: ConnectionResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  DeleteCalendarAndRepairJobResponse?: DeleteCalendarAndRepairJobResponseResolvers<ContextType>;
  DeleteElevatorRecordResponse?: DeleteElevatorRecordResponseResolvers<ContextType>;
  DeleteTechnicianRecordResponse?: DeleteTechnicianRecordResponseResolvers<ContextType>;
  Edge?: EdgeResolvers<ContextType>;
  ElevatorDetails?: ElevatorDetailsResolvers<ContextType>;
  ElevatorRecord?: ElevatorRecordResolvers<ContextType>;
  ElevatorRecordConnection?: ElevatorRecordConnectionResolvers<ContextType>;
  ElevatorRecordEdge?: ElevatorRecordEdgeResolvers<ContextType>;
  ElevatorRecordFormData?: ElevatorRecordFormDataResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RepairJob?: RepairJobResolvers<ContextType>;
  RepairJobConnection?: RepairJobConnectionResolvers<ContextType>;
  RepairJobEdge?: RepairJobEdgeResolvers<ContextType>;
  RepairJobScheduleData?: RepairJobScheduleDataResolvers<ContextType>;
  ScheduledEventAndRepairJobResponse?: ScheduledEventAndRepairJobResponseResolvers<ContextType>;
  TechnicianRecord?: TechnicianRecordResolvers<ContextType>;
  TechnicianRecordConnection?: TechnicianRecordConnectionResolvers<ContextType>;
  TechnicianRecordEdges?: TechnicianRecordEdgesResolvers<ContextType>;
  TechnicianRecordFormData?: TechnicianRecordFormDataResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;
