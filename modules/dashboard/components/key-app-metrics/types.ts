export enum CommonCardStyles {
  CardClassName = 'cardClassName',
  CardHeaderClassName = 'cardHeaderClassName',
  cardTittleClassName = 'cardTittleClassName',
  cardContentClassName = 'cardContentClassName',
}

export enum KeyMetricCardTitle {
  AvailableTechnicians = 'Available Technicians',
  TotalElevators = 'Total Elevators',
  TotalRepairJobs = 'Total Repair Jobs',
  TotalTechnicians = 'Total Technicians',
  OngoingRepairJobs = 'Ongoing Repair Jobs',
  OverdueRepairJobs = 'Overdue Repair Jobs',
  CompletedTodayJobs = 'Completed Today',
}

export type KeyMetricsConfig = {
  id: number;
  icon: React.JSX.Element;
  title: KeyMetricCardTitle;
  metric: number | string;
  cardClassName: string;
  cardHeaderClassName: string;
  cardTittleClassName: string;
  cardContentClassName: string;
};
