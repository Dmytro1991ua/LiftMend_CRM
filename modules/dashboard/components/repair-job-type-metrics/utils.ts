import { RepairJobsMetrics } from '@/graphql/types/client/generated_types';
import { ChartData } from '@/shared/base-charts/types';

export const getRepairJobTypeChartDataConfig = (jobMetrics: RepairJobsMetrics): ChartData[] => {
  return [
    { name: 'Repair', value: jobMetrics?.routineJobs },
    { name: 'Mentainance', value: jobMetrics?.mentainanceJobs },
    { name: 'Installation', value: jobMetrics?.installationJobs },
    { name: 'Inspection', value: jobMetrics?.inspectionJobs },
    { name: 'Upgrade', value: jobMetrics?.upgradeJobs },
    { name: 'Emergency', value: jobMetrics?.emergencyJobs },
    { name: 'Routine', value: jobMetrics?.routineJobs },
    { name: 'Consultation', value: jobMetrics?.consultationJobs },
    { name: 'Modernization', value: jobMetrics?.modernizationJobs },
    { name: 'Compliance', value: jobMetrics?.complianceJobs },
  ];
};
