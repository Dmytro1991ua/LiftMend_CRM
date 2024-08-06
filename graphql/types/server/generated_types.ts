import { GraphQLResolveInfo } from 'graphql';
import { User as UserModel } from '@prisma/client';
export type Maybe<T> = T | undefined | null;
export type InputMaybe<T> = T | undefined | null;
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
  ElevatorLocation: ResolverTypeWrapper<ElevatorLocation>;
  ElevatorType: ResolverTypeWrapper<ElevatorType>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Query: ResolverTypeWrapper<{}>;
  RepairJobPriority: ResolverTypeWrapper<RepairJobPriority>;
  RepairJobScheduleData: ResolverTypeWrapper<RepairJobScheduleData>;
  RepairJobType: ResolverTypeWrapper<RepairJobType>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  TechnicianName: ResolverTypeWrapper<TechnicianName>;
  TechnicianSkill: ResolverTypeWrapper<TechnicianSkill>;
  User: ResolverTypeWrapper<UserModel>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  BuildingName: BuildingName;
  ElevatorLocation: ElevatorLocation;
  ElevatorType: ElevatorType;
  ID: Scalars['ID']['output'];
  Query: {};
  RepairJobPriority: RepairJobPriority;
  RepairJobScheduleData: RepairJobScheduleData;
  RepairJobType: RepairJobType;
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

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = ResolversObject<{
  getRepairJobScheduleData?: Resolver<ResolversTypes['RepairJobScheduleData'], ParentType, ContextType>;
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
  ElevatorLocation?: ElevatorLocationResolvers<ContextType>;
  ElevatorType?: ElevatorTypeResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RepairJobPriority?: RepairJobPriorityResolvers<ContextType>;
  RepairJobScheduleData?: RepairJobScheduleDataResolvers<ContextType>;
  RepairJobType?: RepairJobTypeResolvers<ContextType>;
  TechnicianName?: TechnicianNameResolvers<ContextType>;
  TechnicianSkill?: TechnicianSkillResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;
