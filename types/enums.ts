export enum AppRoutes {
  Default = '/',
  Dashboard = '/dashboard',
  ElevatorManagement = '/elevator-management',
  RepairJobScheduling = '/repair-job-scheduling',
  RepairJobTracking = '/repair-job-tracking',
  RepairJobDetails = '/repair-job-details/[repairJobId]',
  Profile = '/profile',
  SignIn = '/sign-in',
}

export enum SectionHeaderTitle {
  Dashboard = 'Dashboard',
  ElevatorManagement = 'Elevator Management',
  Profile = 'Profile',
  RepairJobScheduling = 'Repair Job Scheduling',
  RepairJobTracking = 'Repair Job Tracking',
}

export enum SectionHeaderDescription {
  RepairJobScheduling = 'Schedule and manage repair jobs associated with specific elevators',
  RepairJobTracking = 'Track, Update, and Review Repair Job Progress',
}
