export enum AppRoutes {
  Default = '/',
  Dashboard = '/dashboard',
  ElevatorManagement = '/elevator-management',
  RepairJobTracking = '/repair-job-tracking',
  RepairJobDetails = '/repair-job-details/[repairJobId]',
  Profile = '/profile',
  SignIn = '/sign-in',
}

export enum SectionHeaderTitle {
  Dashboard = 'Dashboard',
  ElevatorManagement = 'Elevator Management',
  Profile = 'Profile',
  RepairJobTracking = 'Repair Job Tracking',
}

export enum SectionHeaderDescription {
  RepairJobTracking = 'Schedule and manage repair jobs associated with specific elevators',
}
