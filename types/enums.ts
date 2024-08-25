export enum AppRoutes {
  Default = '/',
  Dashboard = '/dashboard',
  ElevatorManagement = '/elevator-management',
  RepairJobScheduling = '/repair-job-scheduling',
  RepairJobDetails = '/repair-job-details/[repairJobId]',
  Profile = '/profile',
  SignIn = '/sign-in',
}

export enum SectionHeaderTitle {
  Dashboard = 'Dashboard',
  ElevatorManagement = 'Elevator Management',
  Profile = 'Profile',
  RepairJobScheduling = 'Repair Job Scheduling',
}

export enum SectionHeaderDescription {
  RepairJobScheduling = 'Schedule and manage repair jobs associated with specific elevators',
}
