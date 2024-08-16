import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { User as UserModel } from '@prisma/client';
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

export type BuildingName = {
  __typename?: 'BuildingName';
  id: Scalars['ID']['output'];
  names: Array<Scalars['String']['output']>;
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
  deletedEventId?: Maybe<Scalars['ID']['output']>;
  deletedRepairJobId?: Maybe<Scalars['ID']['output']>;
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
};

export type MutationCreateRepairJobAndEventArgs = {
  calendarEventInput: CreateCalendarEventInput;
  repairJobInput: CreateRepairJobInput;
};

export type MutationDeleteRepairJobAndEventArgs = {
  calendarEventId: Scalars['ID']['input'];
  repairJobId: Scalars['ID']['input'];
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
  calendarEventId?: Maybe<Scalars['String']['output']>;
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

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  BuildingName: ResolverTypeWrapper<BuildingName>;
  CalendarEvent: ResolverTypeWrapper<CalendarEvent>;
  CreateCalendarEventInput: CreateCalendarEventInput;
  CreateRepairJobInput: CreateRepairJobInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  DeleteCalendarAndRepairJobResponse: ResolverTypeWrapper<DeleteCalendarAndRepairJobResponse>;
  ElevatorLocation: ResolverTypeWrapper<ElevatorLocation>;
  ElevatorType: ResolverTypeWrapper<ElevatorType>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  RepairJob: ResolverTypeWrapper<RepairJob>;
  RepairJobPriority: ResolverTypeWrapper<RepairJobPriority>;
  RepairJobScheduleData: ResolverTypeWrapper<RepairJobScheduleData>;
  RepairJobType: ResolverTypeWrapper<RepairJobType>;
  ScheduledEventAndRepairJobResponse: ResolverTypeWrapper<ScheduledEventAndRepairJobResponse>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  TechnicianName: ResolverTypeWrapper<TechnicianName>;
  TechnicianSkill: ResolverTypeWrapper<TechnicianSkill>;
  User: ResolverTypeWrapper<UserModel>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  BuildingName: BuildingName;
  CalendarEvent: CalendarEvent;
  CreateCalendarEventInput: CreateCalendarEventInput;
  CreateRepairJobInput: CreateRepairJobInput;
  DateTime: Scalars['DateTime']['output'];
  DeleteCalendarAndRepairJobResponse: DeleteCalendarAndRepairJobResponse;
  ElevatorLocation: ElevatorLocation;
  ElevatorType: ElevatorType;
  ID: Scalars['ID']['output'];
  Mutation: {};
  Query: {};
  RepairJob: RepairJob;
  RepairJobPriority: RepairJobPriority;
  RepairJobScheduleData: RepairJobScheduleData;
  RepairJobType: RepairJobType;
  ScheduledEventAndRepairJobResponse: ScheduledEventAndRepairJobResponse;
  String: Scalars['String']['output'];
  TechnicianName: TechnicianName;
  TechnicianSkill: TechnicianSkill;
  User: UserModel;
}>;

export type BuildingNameResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['BuildingName'] = ResolversParentTypes['BuildingName']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  names?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CalendarEventResolvers<
  ContextType = any,
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

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DeleteCalendarAndRepairJobResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['DeleteCalendarAndRepairJobResponse'] = ResolversParentTypes['DeleteCalendarAndRepairJobResponse']
> = ResolversObject<{
  deletedEventId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  deletedRepairJobId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ElevatorLocationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ElevatorLocation'] = ResolversParentTypes['ElevatorLocation']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  locations?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ElevatorTypeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ElevatorType'] = ResolversParentTypes['ElevatorType']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  types?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = ResolversObject<{
  createRepairJobAndEvent?: Resolver<
    ResolversTypes['ScheduledEventAndRepairJobResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateRepairJobAndEventArgs, 'calendarEventInput' | 'repairJobInput'>
  >;
  deleteRepairJobAndEvent?: Resolver<
    ResolversTypes['DeleteCalendarAndRepairJobResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteRepairJobAndEventArgs, 'calendarEventId' | 'repairJobId'>
  >;
}>;

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = ResolversObject<{
  getCalendarEvents?: Resolver<Array<ResolversTypes['CalendarEvent']>, ParentType, ContextType>;
  getRepairJobById?: Resolver<
    ResolversTypes['RepairJob'],
    ParentType,
    ContextType,
    RequireFields<QueryGetRepairJobByIdArgs, 'id'>
  >;
  getRepairJobScheduleData?: Resolver<ResolversTypes['RepairJobScheduleData'], ParentType, ContextType>;
  getRepairJobs?: Resolver<Array<ResolversTypes['RepairJob']>, ParentType, ContextType>;
}>;

export type RepairJobResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['RepairJob'] = ResolversParentTypes['RepairJob']
> = ResolversObject<{
  buildingName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  calendarEventId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  contactInformation?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  elevatorLocation?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  elevatorType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  endDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  jobDetails?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  jobPriority?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  jobType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  startDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  technicianName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  technicianSkills?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RepairJobPriorityResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['RepairJobPriority'] = ResolversParentTypes['RepairJobPriority']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  priorities?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RepairJobScheduleDataResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['RepairJobScheduleData'] = ResolversParentTypes['RepairJobScheduleData']
> = ResolversObject<{
  buildingNames?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  elevatorLocations?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  elevatorTypes?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  priorities?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  repairJobTypes?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  technicianNames?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  technicianSkills?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RepairJobTypeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['RepairJobType'] = ResolversParentTypes['RepairJobType']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  types?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ScheduledEventAndRepairJobResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ScheduledEventAndRepairJobResponse'] = ResolversParentTypes['ScheduledEventAndRepairJobResponse']
> = ResolversObject<{
  calendarEvent?: Resolver<ResolversTypes['CalendarEvent'], ParentType, ContextType>;
  repairJob?: Resolver<ResolversTypes['RepairJob'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TechnicianNameResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TechnicianName'] = ResolversParentTypes['TechnicianName']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  names?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TechnicianSkillResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TechnicianSkill'] = ResolversParentTypes['TechnicianSkill']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  skills?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']
> = ResolversObject<{
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  BuildingName?: BuildingNameResolvers<ContextType>;
  CalendarEvent?: CalendarEventResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  DeleteCalendarAndRepairJobResponse?: DeleteCalendarAndRepairJobResponseResolvers<ContextType>;
  ElevatorLocation?: ElevatorLocationResolvers<ContextType>;
  ElevatorType?: ElevatorTypeResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RepairJob?: RepairJobResolvers<ContextType>;
  RepairJobPriority?: RepairJobPriorityResolvers<ContextType>;
  RepairJobScheduleData?: RepairJobScheduleDataResolvers<ContextType>;
  RepairJobType?: RepairJobTypeResolvers<ContextType>;
  ScheduledEventAndRepairJobResponse?: ScheduledEventAndRepairJobResponseResolvers<ContextType>;
  TechnicianName?: TechnicianNameResolvers<ContextType>;
  TechnicianSkill?: TechnicianSkillResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;
