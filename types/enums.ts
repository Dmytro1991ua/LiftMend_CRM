export enum AppRoutes {
  Default = '/',
  Dashboard = '/dashboard',
  ElevatorManagement = '/elevator-management',
  ElevatorManagementDetails = '/elevator-management/[elevatorRecordId]',
  RepairJobScheduling = '/repair-job-scheduling',
  RepairJobTracking = '/repair-job-tracking',
  RepairJobDetails = '/repair-job-details/[repairJobId]',
  TechnicianManagement = '/technician-management',
  Profile = '/profile',
  SignIn = '/sign-in',
}

export enum SectionHeaderTitle {
  Dashboard = 'Dashboard',
  ElevatorManagement = 'Elevator Management',
  Profile = 'Profile',
  RepairJobScheduling = 'Repair Job Scheduling',
  RepairJobTracking = 'Repair Job Tracking',
  TechnicianManagement = 'Technician Management',
}

export enum SectionHeaderDescription {
  RepairJobScheduling = 'Schedule and manage repair jobs associated with specific elevators',
  RepairJobTracking = 'Track, Update, and Review Repair Job Progress',
  ElevatorManagement = 'View, Update, and Manage Elevator Information',
  TechnicianManagement = 'Manage technician profiles, including skills, certifications, and availability to ensure effective job assignments',
}
