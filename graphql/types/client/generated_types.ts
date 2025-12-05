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
  Upload: { input: any; output: any };
  Void: { input: any; output: any };
};

export type AppUser = {
  __typename?: 'AppUser';
  avatarUrl: Maybe<Scalars['String']['output']>;
  createdAt: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  lastSignInAt: Maybe<Scalars['String']['output']>;
  phone: Maybe<Scalars['String']['output']>;
  updatedAt: Maybe<Scalars['DateTime']['output']>;
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  id: Scalars['ID']['output'];
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
  technicianId: Scalars['ID']['input'];
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

export type CreateUserInput = {
  email: Scalars['String']['input'];
  emailRedirectTo?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type DashboardMetrics = {
  __typename?: 'DashboardMetrics';
  elevatorRecordsMetrics: ElevatorRecordsMetrics;
  repairJobsMetrics: RepairJobsMetrics;
  technicianRecordsMetrics: TechnicianRecordsMetrics;
};

export type DeleteCalendarAndRepairJobResponse = {
  __typename?: 'DeleteCalendarAndRepairJobResponse';
  deletedEventId: Maybe<Scalars['ID']['output']>;
  deletedRepairJobId: Maybe<Scalars['ID']['output']>;
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
  /** Computed health score of the elevator (0–100) */
  healthScore: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  lastKnownStatus: Maybe<Scalars['String']['output']>;
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
  elevatorStatuses: Maybe<Array<Scalars['String']['output']>>;
  elevatorTypes: Array<Scalars['String']['output']>;
};

export const ElevatorRecordSortField = {
  BuildingName: 'BUILDING_NAME',
  ElevatorLocation: 'ELEVATOR_LOCATION',
  ElevatorType: 'ELEVATOR_TYPE',
  LastMaintenanceDate: 'LAST_MAINTENANCE_DATE',
  NextMaintenanceDate: 'NEXT_MAINTENANCE_DATE',
  Status: 'STATUS',
} as const;

export type ElevatorRecordSortField = (typeof ElevatorRecordSortField)[keyof typeof ElevatorRecordSortField];
export type ElevatorRecordSortInput = {
  field?: InputMaybe<ElevatorRecordSortField>;
  order?: InputMaybe<OrderOption>;
};

export type ElevatorRecordsMetrics = {
  __typename?: 'ElevatorRecordsMetrics';
  freightElevators: Scalars['Int']['output'];
  homeElevators: Scalars['Int']['output'];
  luxuryHighSpeedElevators: Scalars['Int']['output'];
  operationalElevators: Scalars['Int']['output'];
  outOfServiceElevators: Scalars['Int']['output'];
  passengerElevators: Scalars['Int']['output'];
  pausedElevators: Scalars['Int']['output'];
  serviceElevators: Scalars['Int']['output'];
  specialtyElevators: Scalars['Int']['output'];
  totalElevatorRecords: Scalars['Int']['output'];
  underMaintenanceElevators: Scalars['Int']['output'];
  vehicleParkingElevators: Scalars['Int']['output'];
};

export type ForgotPasswordInput = {
  email: Scalars['String']['input'];
  redirectTo: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createRepairJobAndEvent: ScheduledEventAndRepairJobResponse;
  createTechnicianRecord: TechnicianRecord;
  deleteElevatorRecord: DeleteElevatorRecordResponse;
  deleteRepairJobAndEvent: DeleteCalendarAndRepairJobResponse;
  deleteTechnicianRecord: DeleteTechnicianRecordResponse;
  forgotPassword: Scalars['Boolean']['output'];
  reassignTechnician: RepairJob;
  removeAccount: RemoveAccountResponse;
  resetPassword: AuthResponse;
  signIn: AuthResponse;
  signInWithOAuth: Scalars['String']['output'];
  signOut: Scalars['Boolean']['output'];
  signUp: AuthResponse;
  updateElevatorRecord: ElevatorRecord;
  updateRepairJob: RepairJob;
  updateTechnicianRecord: TechnicianRecord;
  updateUserProfile: AppUser;
  uploadProfilePicture: UploadProfilePicturePayload;
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

export type MutationForgotPasswordArgs = {
  input: ForgotPasswordInput;
};

export type MutationReassignTechnicianArgs = {
  input: UpdateRepairJobInput;
};

export type MutationRemoveAccountArgs = {
  userId: Scalars['ID']['input'];
};

export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};

export type MutationSignInArgs = {
  input: SignInUserInput;
};

export type MutationSignInWithOAuthArgs = {
  input: SignInWithOAuthInput;
};

export type MutationSignUpArgs = {
  input: CreateUserInput;
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

export type MutationUpdateUserProfileArgs = {
  input: UserProfileInput;
};

export type MutationUploadProfilePictureArgs = {
  file: Scalars['Upload']['input'];
};

export type Node = {
  id: Scalars['ID']['output'];
};

export const OAuthProvider = {
  Apple: 'APPLE',
  Azure: 'AZURE',
  Bitbucket: 'BITBUCKET',
  Discord: 'DISCORD',
  Facebook: 'FACEBOOK',
  Figma: 'FIGMA',
  Fly: 'FLY',
  Github: 'GITHUB',
  Gitlab: 'GITLAB',
  Google: 'GOOGLE',
  Kakao: 'KAKAO',
  Keycloak: 'KEYCLOAK',
  Linkedin: 'LINKEDIN',
  LinkedinOidc: 'LINKEDIN_OIDC',
  Notion: 'NOTION',
  Slack: 'SLACK',
  SlackOidc: 'SLACK_OIDC',
  Spotify: 'SPOTIFY',
  Twitch: 'TWITCH',
  Twitter: 'TWITTER',
  Workos: 'WORKOS',
  Zoom: 'ZOOM',
} as const;

export type OAuthProvider = (typeof OAuthProvider)[keyof typeof OAuthProvider];
export const OrderOption = {
  Asc: 'ASC',
  Desc: 'DESC',
} as const;

export type OrderOption = (typeof OrderOption)[keyof typeof OrderOption];
export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor: Maybe<Scalars['String']['output']>;
};

export type PaginationOptions = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type Query = {
  __typename?: 'Query';
  getAvailableTechniciansForAssignment: Array<TechnicianRecord>;
  getCalendarEvents: Array<CalendarEvent>;
  getDashboardMetrics: DashboardMetrics;
  getElevatorDetailsByBuildingName: ElevatorDetails;
  getElevatorMaintenanceHistory: RepairJobConnection;
  getElevatorRecordById: ElevatorRecord;
  getElevatorRecordFormData: ElevatorRecordFormData;
  getElevatorRecords: ElevatorRecordConnection;
  getRecentRepairJobs: Array<RepairJob>;
  getRepairJobById: RepairJob;
  getRepairJobScheduleData: RepairJobScheduleData;
  getRepairJobs: RepairJobConnection;
  getTechnicianRecordById: TechnicianRecord;
  getTechnicianRecordFormData: TechnicianRecordFormData;
  getTechnicianRecords: TechnicianRecordConnection;
  getUser: AppUser;
};

export type QueryGetDashboardMetricsArgs = {
  endDate: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
};

export type QueryGetElevatorDetailsByBuildingNameArgs = {
  buildingName: Scalars['String']['input'];
};

export type QueryGetElevatorMaintenanceHistoryArgs = {
  elevatorId: Scalars['ID']['input'];
  paginationOptions?: InputMaybe<PaginationOptions>;
};

export type QueryGetElevatorRecordByIdArgs = {
  id: Scalars['ID']['input'];
};

export type QueryGetElevatorRecordsArgs = {
  filterOptions?: InputMaybe<ElevatorRecordFilterOptions>;
  paginationOptions?: InputMaybe<PaginationOptions>;
  sortOptions?: InputMaybe<ElevatorRecordSortInput>;
};

export type QueryGetRecentRepairJobsArgs = {
  jobsCount?: InputMaybe<Scalars['Int']['input']>;
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

export type QueryGetUserArgs = {
  id: Scalars['ID']['input'];
};

export type RemoveAccountResponse = {
  __typename?: 'RemoveAccountResponse';
  userId: Scalars['ID']['output'];
};

export type RepairJob = Node & {
  __typename?: 'RepairJob';
  actualEndDate: Maybe<Scalars['DateTime']['output']>;
  buildingName: Scalars['String']['output'];
  calendarEventId: Maybe<Scalars['String']['output']>;
  elevatorId: Maybe<Scalars['ID']['output']>;
  elevatorLocation: Scalars['String']['output'];
  elevatorType: Scalars['String']['output'];
  endDate: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isOverdue: Maybe<Scalars['Boolean']['output']>;
  jobDetails: Scalars['String']['output'];
  jobPriority: Scalars['String']['output'];
  jobType: Scalars['String']['output'];
  startDate: Scalars['DateTime']['output'];
  status: Scalars['String']['output'];
  technicianId: Maybe<Scalars['ID']['output']>;
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
  endDate?: InputMaybe<Scalars['String']['input']>;
  isOverdue?: InputMaybe<Array<Scalars['String']['input']>>;
  jobPriority?: InputMaybe<Array<Scalars['String']['input']>>;
  jobType?: InputMaybe<Array<Scalars['String']['input']>>;
  searchTerm?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
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
  statuses: Maybe<Array<Scalars['String']['output']>>;
  technicianNames: Array<Scalars['String']['output']>;
  technicianSkills: Array<Scalars['String']['output']>;
};

export const RepairJobSortField = {
  ActualEndDate: 'ACTUAL_END_DATE',
  BuildingName: 'BUILDING_NAME',
  ElevatorLocation: 'ELEVATOR_LOCATION',
  ElevatorType: 'ELEVATOR_TYPE',
  EndDate: 'END_DATE',
  IsOverdue: 'IS_OVERDUE',
  JobPriority: 'JOB_PRIORITY',
  JobType: 'JOB_TYPE',
  StartDate: 'START_DATE',
  Status: 'STATUS',
  TechnicianName: 'TECHNICIAN_NAME',
} as const;

export type RepairJobSortField = (typeof RepairJobSortField)[keyof typeof RepairJobSortField];
export type RepairJobSortInput = {
  field?: InputMaybe<RepairJobSortField>;
  order?: InputMaybe<OrderOption>;
};

export type RepairJobsMetrics = {
  __typename?: 'RepairJobsMetrics';
  cancelledRepairJobs: Scalars['Int']['output'];
  completedRepairJobs: Scalars['Int']['output'];
  completedRepairJobsToday: Scalars['Int']['output'];
  complianceJobs: Scalars['Int']['output'];
  consultationJobs: Scalars['Int']['output'];
  emergencyJobs: Scalars['Int']['output'];
  highPriorityRepairJobs: Scalars['Int']['output'];
  inProgressRepairJobs: Scalars['Int']['output'];
  inspectionJobs: Scalars['Int']['output'];
  installationJobs: Scalars['Int']['output'];
  lowPriorityRepairJobs: Scalars['Int']['output'];
  mediumPriorityRepairJobs: Scalars['Int']['output'];
  mentainanceJobs: Scalars['Int']['output'];
  modernizationJobs: Scalars['Int']['output'];
  onHoldRepairJobs: Scalars['Int']['output'];
  ongoingRepairJobs: Scalars['Int']['output'];
  overdueRepairJobs: Scalars['Int']['output'];
  repairJobs: Scalars['Int']['output'];
  routineJobs: Scalars['Int']['output'];
  scheduledRepairJobs: Scalars['Int']['output'];
  totalRepairJobs: Scalars['Int']['output'];
  upgradeJobs: Scalars['Int']['output'];
};

export type ResetPasswordInput = {
  password: Scalars['String']['input'];
};

export type ScheduledEventAndRepairJobResponse = {
  __typename?: 'ScheduledEventAndRepairJobResponse';
  calendarEvent: CalendarEvent;
  repairJob: RepairJob;
};

export type SignInUserInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SignInWithOAuthInput = {
  provider: OAuthProvider;
};

export type TechnicianPerformanceMetrics = {
  __typename?: 'TechnicianPerformanceMetrics';
  /** Currently ongoing jobs for a particular technician */
  activeRepairJobs: Maybe<Scalars['Int']['output']>;
  /** Average time per job (in days) */
  averageDurationDays: Scalars['Float']['output'];
  completedRepairJobs: Scalars['Int']['output'];
  /** % of completed jobs finished on or before expected endDate */
  onTimeCompletionRate: Maybe<Scalars['Int']['output']>;
  overdueRepairJobs: Scalars['Int']['output'];
  /** Computed technician performance score based on performance metrics (0–100) */
  performanceScore: Maybe<Scalars['Int']['output']>;
  /** All jobs assigned to this technician */
  totalRepairJobs: Scalars['Int']['output'];
};

export type TechnicianRecord = Node & {
  __typename?: 'TechnicianRecord';
  availabilityStatus: Maybe<Scalars['String']['output']>;
  certifications: Array<Scalars['String']['output']>;
  contactInformation: Scalars['String']['output'];
  employmentStatus: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastKnownAvailabilityStatus: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  performanceMetrics: Maybe<TechnicianPerformanceMetrics>;
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

export const TechnicianRecordSortField = {
  AvailabilityStatus: 'AVAILABILITY_STATUS',
  EmploymentStatus: 'EMPLOYMENT_STATUS',
  Name: 'NAME',
} as const;

export type TechnicianRecordSortField = (typeof TechnicianRecordSortField)[keyof typeof TechnicianRecordSortField];
export type TechnicianRecordSortInput = {
  field?: InputMaybe<TechnicianRecordSortField>;
  order?: InputMaybe<OrderOption>;
};

export type TechnicianRecordsMetrics = {
  __typename?: 'TechnicianRecordsMetrics';
  availableTechnicians: Scalars['Int']['output'];
  busyTechnicians: Scalars['Int']['output'];
  inactiveTechnicians: Scalars['Int']['output'];
  onLeaveTechnicians: Scalars['Int']['output'];
  reservedTechnicians: Scalars['Int']['output'];
  totalTechnicianRecords: Scalars['Int']['output'];
  unavailableTechnicians: Scalars['Int']['output'];
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
  technicianId?: InputMaybe<Scalars['ID']['input']>;
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

export type UploadProfilePicturePayload = {
  __typename?: 'UploadProfilePicturePayload';
  avatarUrl: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type UserProfileInput = {
  firstName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  lastName?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
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

export type ElevatorRecordFieldsFragment = {
  __typename?: 'ElevatorRecord';
  id: string;
  elevatorType: string;
  buildingName: string;
  elevatorLocation: string;
  lastMaintenanceDate: any;
  nextMaintenanceDate: any;
  capacity: number;
  status: string;
  lastKnownStatus: string | null;
  healthScore: number | null;
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
  startDate: any;
  endDate: any;
  calendarEventId: string | null;
  actualEndDate: any | null;
  isOverdue: boolean | null;
  elevatorId: string | null;
  technicianId: string | null;
};

export type TechnicianRecordFieldsFragment = {
  __typename?: 'TechnicianRecord';
  id: string;
  name: string;
  contactInformation: string;
  skills: Array<string>;
  certifications: Array<string>;
  availabilityStatus: string | null;
  employmentStatus: string | null;
  lastKnownAvailabilityStatus: string | null;
  performanceMetrics: {
    __typename?: 'TechnicianPerformanceMetrics';
    activeRepairJobs: number | null;
    onTimeCompletionRate: number | null;
    overdueRepairJobs: number;
    totalRepairJobs: number;
    completedRepairJobs: number;
    averageDurationDays: number;
    performanceScore: number | null;
  } | null;
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
      startDate: any;
      endDate: any;
      calendarEventId: string | null;
      actualEndDate: any | null;
      isOverdue: boolean | null;
      elevatorId: string | null;
      technicianId: string | null;
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

export type CreateTechnicianRecordMutationVariables = Exact<{
  input: CreateTechnicianRecordInput;
}>;

export type CreateTechnicianRecordMutation = {
  __typename?: 'Mutation';
  createTechnicianRecord: {
    __typename?: 'TechnicianRecord';
    id: string;
    name: string;
    contactInformation: string;
    skills: Array<string>;
    certifications: Array<string>;
    availabilityStatus: string | null;
    employmentStatus: string | null;
    lastKnownAvailabilityStatus: string | null;
    performanceMetrics: {
      __typename?: 'TechnicianPerformanceMetrics';
      activeRepairJobs: number | null;
      onTimeCompletionRate: number | null;
      overdueRepairJobs: number;
      totalRepairJobs: number;
      completedRepairJobs: number;
      averageDurationDays: number;
      performanceScore: number | null;
    } | null;
  };
};

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;

export type CreateUserMutation = { __typename?: 'Mutation'; signUp: { __typename?: 'AuthResponse'; id: string } };

export type DeleteAccountMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;

export type DeleteAccountMutation = {
  __typename?: 'Mutation';
  removeAccount: { __typename?: 'RemoveAccountResponse'; userId: string };
};

export type DeleteElevatorRecordMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type DeleteElevatorRecordMutation = {
  __typename?: 'Mutation';
  deleteElevatorRecord: { __typename?: 'DeleteElevatorRecordResponse'; id: string };
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

export type DeleteTechnicianRecordMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type DeleteTechnicianRecordMutation = {
  __typename?: 'Mutation';
  deleteTechnicianRecord: { __typename?: 'DeleteTechnicianRecordResponse'; id: string };
};

export type ForgotPasswordMutationVariables = Exact<{
  input: ForgotPasswordInput;
}>;

export type ForgotPasswordMutation = { __typename?: 'Mutation'; forgotPassword: boolean };

export type GetAvailableTechniciansForAssignmentQueryVariables = Exact<{ [key: string]: never }>;

export type GetAvailableTechniciansForAssignmentQuery = {
  __typename?: 'Query';
  getAvailableTechniciansForAssignment: Array<{ __typename?: 'TechnicianRecord'; id: string; name: string }>;
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

export type GetDashboardMetricsQueryVariables = Exact<{
  startDate: Scalars['String']['input'];
  endDate: Scalars['String']['input'];
}>;

export type GetDashboardMetricsQuery = {
  __typename?: 'Query';
  getDashboardMetrics: {
    __typename?: 'DashboardMetrics';
    repairJobsMetrics: {
      __typename?: 'RepairJobsMetrics';
      totalRepairJobs: number;
      overdueRepairJobs: number;
      ongoingRepairJobs: number;
      completedRepairJobsToday: number;
      scheduledRepairJobs: number;
      inProgressRepairJobs: number;
      cancelledRepairJobs: number;
      onHoldRepairJobs: number;
      completedRepairJobs: number;
      lowPriorityRepairJobs: number;
      mediumPriorityRepairJobs: number;
      highPriorityRepairJobs: number;
      repairJobs: number;
      mentainanceJobs: number;
      installationJobs: number;
      inspectionJobs: number;
      upgradeJobs: number;
      emergencyJobs: number;
      routineJobs: number;
      consultationJobs: number;
      modernizationJobs: number;
      complianceJobs: number;
    };
    elevatorRecordsMetrics: {
      __typename?: 'ElevatorRecordsMetrics';
      totalElevatorRecords: number;
      operationalElevators: number;
      underMaintenanceElevators: number;
      outOfServiceElevators: number;
      pausedElevators: number;
      passengerElevators: number;
      freightElevators: number;
      serviceElevators: number;
      homeElevators: number;
      luxuryHighSpeedElevators: number;
      vehicleParkingElevators: number;
      specialtyElevators: number;
    };
    technicianRecordsMetrics: {
      __typename?: 'TechnicianRecordsMetrics';
      totalTechnicianRecords: number;
      availableTechnicians: number;
      busyTechnicians: number;
      onLeaveTechnicians: number;
      inactiveTechnicians: number;
      unavailableTechnicians: number;
      reservedTechnicians: number;
    };
  };
};

export type GetElevatorDetailsByBuildingNameQueryVariables = Exact<{
  buildingName: Scalars['String']['input'];
}>;

export type GetElevatorDetailsByBuildingNameQuery = {
  __typename?: 'Query';
  getElevatorDetailsByBuildingName: {
    __typename?: 'ElevatorDetails';
    elevatorTypes: Array<string>;
    elevatorLocations: Array<string>;
  };
};

export type GetElevatorMaintenanceHistoryQueryVariables = Exact<{
  elevatorId: Scalars['ID']['input'];
  paginationOptions?: InputMaybe<PaginationOptions>;
}>;

export type GetElevatorMaintenanceHistoryQuery = {
  __typename?: 'Query';
  getElevatorMaintenanceHistory: {
    __typename?: 'RepairJobConnection';
    total: number;
    edges: Array<{
      __typename?: 'RepairJobEdge';
      cursor: string;
      node: {
        __typename?: 'RepairJob';
        status: string;
        id: string;
        jobType: string;
        jobDetails: string;
        jobPriority: string;
        elevatorType: string;
        buildingName: string;
        elevatorLocation: string;
        technicianName: string;
        startDate: any;
        endDate: any;
        calendarEventId: string | null;
        actualEndDate: any | null;
        isOverdue: boolean | null;
        elevatorId: string | null;
        technicianId: string | null;
      };
    }>;
    pageInfo: {
      __typename?: 'PageInfo';
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string | null;
      endCursor: string | null;
    };
  };
};

export type GetElevatorRecordByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type GetElevatorRecordByIdQuery = {
  __typename?: 'Query';
  getElevatorRecordById: {
    __typename?: 'ElevatorRecord';
    id: string;
    elevatorType: string;
    buildingName: string;
    elevatorLocation: string;
    lastMaintenanceDate: any;
    nextMaintenanceDate: any;
    capacity: number;
    status: string;
    lastKnownStatus: string | null;
    healthScore: number | null;
  };
};

export type GetElevatorRecordFormDataQueryVariables = Exact<{ [key: string]: never }>;

export type GetElevatorRecordFormDataQuery = {
  __typename?: 'Query';
  getElevatorRecordFormData: {
    __typename?: 'ElevatorRecordFormData';
    elevatorTypes: Array<string>;
    buildingNames: Array<string>;
    elevatorLocations: Array<string>;
    elevatorStatuses: Array<string> | null;
  };
};

export type GetElevatorRecordsQueryVariables = Exact<{
  paginationOptions?: InputMaybe<PaginationOptions>;
  filterOptions?: InputMaybe<ElevatorRecordFilterOptions>;
  sortOptions?: InputMaybe<ElevatorRecordSortInput>;
}>;

export type GetElevatorRecordsQuery = {
  __typename?: 'Query';
  getElevatorRecords: {
    __typename?: 'ElevatorRecordConnection';
    total: number;
    edges: Array<{
      __typename?: 'ElevatorRecordEdge';
      cursor: string;
      node: {
        __typename?: 'ElevatorRecord';
        id: string;
        elevatorType: string;
        buildingName: string;
        elevatorLocation: string;
        lastMaintenanceDate: any;
        nextMaintenanceDate: any;
        capacity: number;
        status: string;
        lastKnownStatus: string | null;
        healthScore: number | null;
      };
    }>;
    pageInfo: {
      __typename?: 'PageInfo';
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string | null;
      endCursor: string | null;
    };
  };
};

export type GetRecentRepairJobsQueryVariables = Exact<{
  jobsCount?: InputMaybe<Scalars['Int']['input']>;
}>;

export type GetRecentRepairJobsQuery = {
  __typename?: 'Query';
  getRecentRepairJobs: Array<{
    __typename?: 'RepairJob';
    status: string;
    id: string;
    jobType: string;
    jobDetails: string;
    jobPriority: string;
    elevatorType: string;
    buildingName: string;
    elevatorLocation: string;
    technicianName: string;
    startDate: any;
    endDate: any;
    calendarEventId: string | null;
    actualEndDate: any | null;
    isOverdue: boolean | null;
    elevatorId: string | null;
    technicianId: string | null;
  }>;
};

export type GetRepairJobByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type GetRepairJobByIdQuery = {
  __typename?: 'Query';
  getRepairJobById: {
    __typename?: 'RepairJob';
    status: string;
    id: string;
    jobType: string;
    jobDetails: string;
    jobPriority: string;
    elevatorType: string;
    buildingName: string;
    elevatorLocation: string;
    technicianName: string;
    startDate: any;
    endDate: any;
    calendarEventId: string | null;
    actualEndDate: any | null;
    isOverdue: boolean | null;
    elevatorId: string | null;
    technicianId: string | null;
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
    statuses: Array<string> | null;
  };
};

export type GetRepairJobsQueryVariables = Exact<{
  paginationOptions?: InputMaybe<PaginationOptions>;
  sortOptions?: InputMaybe<RepairJobSortInput>;
  filterOptions?: InputMaybe<RepairJobFilterOptions>;
}>;

export type GetRepairJobsQuery = {
  __typename?: 'Query';
  getRepairJobs: {
    __typename?: 'RepairJobConnection';
    total: number;
    edges: Array<{
      __typename?: 'RepairJobEdge';
      cursor: string;
      node: {
        __typename?: 'RepairJob';
        status: string;
        id: string;
        jobType: string;
        jobDetails: string;
        jobPriority: string;
        elevatorType: string;
        buildingName: string;
        elevatorLocation: string;
        technicianName: string;
        startDate: any;
        endDate: any;
        calendarEventId: string | null;
        actualEndDate: any | null;
        isOverdue: boolean | null;
        elevatorId: string | null;
        technicianId: string | null;
      };
    }>;
    pageInfo: {
      __typename?: 'PageInfo';
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string | null;
      endCursor: string | null;
    };
  };
};

export type GetTechnicianRecordByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type GetTechnicianRecordByIdQuery = {
  __typename?: 'Query';
  getTechnicianRecordById: {
    __typename?: 'TechnicianRecord';
    id: string;
    name: string;
    contactInformation: string;
    skills: Array<string>;
    certifications: Array<string>;
    availabilityStatus: string | null;
    employmentStatus: string | null;
    lastKnownAvailabilityStatus: string | null;
    performanceMetrics: {
      __typename?: 'TechnicianPerformanceMetrics';
      activeRepairJobs: number | null;
      onTimeCompletionRate: number | null;
      overdueRepairJobs: number;
      totalRepairJobs: number;
      completedRepairJobs: number;
      averageDurationDays: number;
      performanceScore: number | null;
    } | null;
  };
};

export type GetTechnicianRecordFormDataQueryVariables = Exact<{ [key: string]: never }>;

export type GetTechnicianRecordFormDataQuery = {
  __typename?: 'Query';
  getTechnicianRecordFormData: {
    __typename?: 'TechnicianRecordFormData';
    availabilityStatuses: Array<string>;
    certifications: Array<string>;
    employmentStatuses: Array<string>;
    skills: Array<string>;
  };
};

export type GetTechnicianRecordsQueryVariables = Exact<{
  paginationOptions?: InputMaybe<PaginationOptions>;
  filterOptions?: InputMaybe<TechnicianRecordFilterOptions>;
  sortOptions?: InputMaybe<TechnicianRecordSortInput>;
}>;

export type GetTechnicianRecordsQuery = {
  __typename?: 'Query';
  getTechnicianRecords: {
    __typename?: 'TechnicianRecordConnection';
    total: number;
    edges: Array<{
      __typename?: 'TechnicianRecordEdges';
      cursor: string;
      node: {
        __typename?: 'TechnicianRecord';
        id: string;
        name: string;
        contactInformation: string;
        skills: Array<string>;
        certifications: Array<string>;
        availabilityStatus: string | null;
        employmentStatus: string | null;
        lastKnownAvailabilityStatus: string | null;
        performanceMetrics: {
          __typename?: 'TechnicianPerformanceMetrics';
          activeRepairJobs: number | null;
          onTimeCompletionRate: number | null;
          overdueRepairJobs: number;
          totalRepairJobs: number;
          completedRepairJobs: number;
          averageDurationDays: number;
          performanceScore: number | null;
        } | null;
      };
    }>;
    pageInfo: {
      __typename?: 'PageInfo';
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string | null;
      endCursor: string | null;
    };
  };
};

export type GetUserQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type GetUserQuery = {
  __typename?: 'Query';
  getUser: {
    __typename?: 'AppUser';
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    createdAt: any | null;
    updatedAt: any | null;
    lastSignInAt: string | null;
    avatarUrl: string | null;
  };
};

export type LoginUserMutationVariables = Exact<{
  input: SignInUserInput;
}>;

export type LoginUserMutation = { __typename?: 'Mutation'; signIn: { __typename?: 'AuthResponse'; id: string } };

export type ReassignTechnicianMutationVariables = Exact<{
  input: UpdateRepairJobInput;
}>;

export type ReassignTechnicianMutation = {
  __typename?: 'Mutation';
  reassignTechnician: {
    __typename?: 'RepairJob';
    id: string;
    jobType: string;
    jobDetails: string;
    jobPriority: string;
    elevatorType: string;
    buildingName: string;
    elevatorLocation: string;
    technicianName: string;
    startDate: any;
    endDate: any;
    calendarEventId: string | null;
    actualEndDate: any | null;
    isOverdue: boolean | null;
    elevatorId: string | null;
    technicianId: string | null;
  };
};

export type ResetPasswordMutationVariables = Exact<{
  input: ResetPasswordInput;
}>;

export type ResetPasswordMutation = {
  __typename?: 'Mutation';
  resetPassword: { __typename?: 'AuthResponse'; id: string };
};

export type SignInWithOAuthMutationVariables = Exact<{
  input: SignInWithOAuthInput;
}>;

export type SignInWithOAuthMutation = { __typename?: 'Mutation'; signInWithOAuth: string };

export type SignOutUserMutationVariables = Exact<{ [key: string]: never }>;

export type SignOutUserMutation = { __typename?: 'Mutation'; signOut: boolean };

export type UpdateElevatorRecordMutationVariables = Exact<{
  input: UpdateElevatorRecordInput;
}>;

export type UpdateElevatorRecordMutation = {
  __typename?: 'Mutation';
  updateElevatorRecord: {
    __typename?: 'ElevatorRecord';
    id: string;
    elevatorType: string;
    buildingName: string;
    elevatorLocation: string;
    lastMaintenanceDate: any;
    nextMaintenanceDate: any;
    capacity: number;
    status: string;
    lastKnownStatus: string | null;
    healthScore: number | null;
  };
};

export type UpdateProfileMutationVariables = Exact<{
  input: UserProfileInput;
}>;

export type UpdateProfileMutation = {
  __typename?: 'Mutation';
  updateUserProfile: { __typename?: 'AppUser'; id: string; firstName: string; lastName: string; phone: string | null };
};

export type UpdateRepairJobMutationVariables = Exact<{
  input: UpdateRepairJobInput;
}>;

export type UpdateRepairJobMutation = {
  __typename?: 'Mutation';
  updateRepairJob: {
    __typename?: 'RepairJob';
    id: string;
    status: string;
    jobType: string;
    jobDetails: string;
    jobPriority: string;
    elevatorType: string;
    buildingName: string;
    elevatorLocation: string;
    technicianName: string;
    startDate: any;
    endDate: any;
    calendarEventId: string | null;
    actualEndDate: any | null;
    isOverdue: boolean | null;
    elevatorId: string | null;
    technicianId: string | null;
  };
};

export type UpdateTechnicianRecordMutationVariables = Exact<{
  input: UpdateTechnicianRecordInput;
}>;

export type UpdateTechnicianRecordMutation = {
  __typename?: 'Mutation';
  updateTechnicianRecord: {
    __typename?: 'TechnicianRecord';
    id: string;
    name: string;
    contactInformation: string;
    skills: Array<string>;
    certifications: Array<string>;
    availabilityStatus: string | null;
    employmentStatus: string | null;
    lastKnownAvailabilityStatus: string | null;
    performanceMetrics: {
      __typename?: 'TechnicianPerformanceMetrics';
      activeRepairJobs: number | null;
      onTimeCompletionRate: number | null;
      overdueRepairJobs: number;
      totalRepairJobs: number;
      completedRepairJobs: number;
      averageDurationDays: number;
      performanceScore: number | null;
    } | null;
  };
};

export type UploadProfilePictureMutationVariables = Exact<{
  file: Scalars['Upload']['input'];
}>;

export type UploadProfilePictureMutation = {
  __typename?: 'Mutation';
  uploadProfilePicture: { __typename?: 'UploadProfilePicturePayload'; id: string; avatarUrl: string };
};
