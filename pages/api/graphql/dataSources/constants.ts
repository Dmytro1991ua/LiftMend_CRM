import {
  ElevatorRecordsMetrics,
  RepairJobsMetrics,
  TechnicianRecordsMetrics,
} from '@/graphql/types/server/generated_types';

export const ELEVATOR_STATUS_MAP = new Map<string, keyof ElevatorRecordsMetrics>([
  ['Operational', 'operationalElevators'],
  ['Out of Service', 'outOfServiceElevators'],
  ['Under Maintenance', 'underMaintenanceElevators'],
  ['Paused', 'pausedElevators'],
]);

export const ELEVATOR_TYPE_MAP = new Map<string, keyof ElevatorRecordsMetrics>([
  ['Passenger Elevator', 'passengerElevators'],
  ['Freight Elevator', 'freightElevators'],
  ['Service Elevator', 'serviceElevators'],
  ['Dumbwaiter Lift', 'serviceElevators'],
  ['Home Lift', 'homeElevators'],
  ['Glass Elevator', 'passengerElevators'],
  ['Hydraulic Elevator', 'homeElevators'],
  ['Traction Elevator', 'homeElevators'],
  ['Inclined Elevator', 'specialtyElevators'],
  ['Scissor Lift', 'specialtyElevators'],
  ['Vacuum Elevator', 'homeElevators'],
  ['Pneumatic Elevator', 'homeElevators'],
  ['Rope-less Elevator', 'homeElevators'],
  ['Modular Elevator', 'homeElevators'],
  ['Miniature Elevator', 'homeElevators'],
  ['Car Lift', 'vehicleParkingElevators'],
  ['Observation Elevator', 'passengerElevators'],
  ['Industrial Elevator', 'freightElevators'],
  ['Panoramic Lift', 'passengerElevators'],
  ['Mast Lift', 'specialtyElevators'],
  ['Tower Lift', 'specialtyElevators'],
  ['Vertical Platform Lift', 'homeElevators'],
  ['Hospital Elevator', 'serviceElevators'],
  ['Cargo Lift', 'freightElevators'],
  ['Express Lift', 'passengerElevators'],
  ['Double-Decker Elevator', 'passengerElevators'],
  ['Machine Room-Less Elevator', 'homeElevators'],
  ['Sidewalk Elevator', 'specialtyElevators'],
  ['Circular Elevator', 'specialtyElevators'],
  ['Solar-Powered Lift', 'luxuryHighSpeedElevators'],
  ['Eco-Friendly Elevator', 'luxuryHighSpeedElevators'],
  ['Cold Storage Lift', 'freightElevators'],
  ['Warehouse Lift', 'freightElevators'],
  ['Ship Elevator', 'freightElevators'],
  ['Fire Escape Lift', 'serviceElevators'],
  ['Medical Lift', 'serviceElevators'],
  ['Marble Elevator', 'luxuryHighSpeedElevators'],
  ['Theater Lift', 'specialtyElevators'],
  ['Cargo Platform Lift', 'freightElevators'],
  ['Entertainment Elevator', 'luxuryHighSpeedElevators'],
  ['Stadium Lift', 'specialtyElevators'],
  ['Retail Lift', 'specialtyElevators'],
  ['Baggage Lift', 'freightElevators'],
  ['Ferry Lift', 'freightElevators'],
  ['Factory Lift', 'freightElevators'],
  ['Ultra High-Speed Elevator', 'luxuryHighSpeedElevators'],
  ['Subway Lift', 'specialtyElevators'],
  ['Car Parking Lift', 'vehicleParkingElevators'],
  ['Elevator Platform', 'homeElevators'],
  ['Auto-Elevator', 'vehicleParkingElevators'],
  ['Smart Lift', 'luxuryHighSpeedElevators'],
  ['Virtual Elevator', 'luxuryHighSpeedElevators'],
  ['Elevator Stretcher', 'serviceElevators'],
  ['Vertical Lift Platform', 'homeElevators'],
  ['Moving Platform', 'homeElevators'],
  ['Elevator Chairlift', 'specialtyElevators'],
  ['Spiral Lift', 'specialtyElevators'],
  ['Elevator With Glass Panels', 'passengerElevators'],
  ['Revolving Lift', 'specialtyElevators'],
  ['Battery Powered Lift', 'luxuryHighSpeedElevators'],
  ['Elevator With Storage Space', 'homeElevators'],
  ['Solar Lift', 'luxuryHighSpeedElevators'],
  ['Heavy Duty Lift', 'freightElevators'],
  ['Scenic Elevator', 'passengerElevators'],
  ['Tele-Elevator', 'luxuryHighSpeedElevators'],
  ['Floating Lift', 'specialtyElevators'],
]);

export const REPAIR_JOB_STATUS_MAP = new Map<string, keyof RepairJobsMetrics>([
  ['Completed', 'completedRepairJobs'],
  ['In Progress', 'ongoingRepairJobs'],
  ['Scheduled', 'scheduledRepairJobs'],
  ['Cancelled', 'cancelledRepairJobs'],
  ['On Hold', 'onHoldRepairJobs'],
]);

export const REPAIR_JOB_PRIORITY_MAP = new Map<string, keyof RepairJobsMetrics>([
  ['High', 'highPriorityRepairJobs'],
  ['Medium', 'mediumPriorityRepairJobs'],
  ['Low', 'lowPriorityRepairJobs'],
]);

export const REPAIR_JOB_TYPE_MAP = new Map<string, keyof RepairJobsMetrics>([
  ['Routine', 'routineJobs'],
  ['Emergency', 'emergencyJobs'],
  ['Inspection', 'inspectionJobs'],
  ['Installation', 'installationJobs'],
  ['Compliant', 'complianceJobs'],
  ['Modernization', 'modernizationJobs'],
  ['Upgrade', 'upgradeJobs'],
  ['Consultation', 'consultationJobs'],
  ['Mentainance', 'mentainanceJobs'],
  ['Repair', 'repairJobs'],
]);

export const TECHNICIAN_AVAILABILITY_STATUS_MAP = new Map<string, keyof TechnicianRecordsMetrics>([
  ['Available', 'availableTechnicians'],
  ['Busy', 'busyTechnicians'],
  ['On Leave', 'onLeaveTechnicians'],
  ['Inactive', 'inactiveTechnicians'],
  ['Reserved', 'reservedTechnicians'],
  ['Unavailable', 'unavailableTechnicians'],
]);

export const DEFAULT_SIGN_UP_MESSAGE = 'User signup failed';
export const DEFAULT_SIGN_IN_MESSAGE = 'Invalid email or password';
export const DEFAULT_RESET_PASSWORD_MESSAGE = 'User data is missing from the response.';
export const DEFAULT_USER_NOT_FOUND_MESSAGE = 'User not found';
export const DEFAULT_USER_NOT_AUTHENTICATED_MESSAGE = 'User is not authenticated';
export const DEFAULT_SUPABASE_NOT_INITIALIZED_MESSAGE = 'Supabase client is not initialized';
export const DEFAULT_IMAGE_PUBLIC_URL_FAILED_MESSAGE = 'Error fetching signed URL';
export const DEFAULT_RECENT_JOBS_COUNT = 5;
export const DEFAULT_SORTING_OPTION = 'desc';

export const TECHNICIAN_ASSIGNMENT_BLOCKING_STATUSES = ['Busy', 'Reserved'];
