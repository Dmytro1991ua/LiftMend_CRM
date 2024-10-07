import { useFormContext } from 'react-hook-form';

import { GetElevatorRecordFormDataQuery } from '@/graphql/types/client/generated_types';
import { FormFieldLabel } from '@/modules/elevator-management/types';
import ControlledSingleSelect from '@/shared/base-select/components/controlled-single-select';
import ControlledSingleDatePicker from '@/shared/date-picker/components/controlled-single-date-picker/ControlledSingleDatePicker';
import { useFetchDropdownOptions } from '@/shared/hooks/useFetchDropdownOptions';
import { DropdownOptions } from '@/shared/hooks/useFetchDropdownOptions/config';
import { FormFieldConfig } from '@/shared/types';

import { ElevatorRecordFormFields } from '../../validation';

const MaintenanceInformation = () => {
  const { clearErrors } = useFormContext<ElevatorRecordFormFields>();

  const {
    dropdownOptions: { elevatorStatuses },
  } = useFetchDropdownOptions<GetElevatorRecordFormDataQuery>(DropdownOptions.ElevatorManagement);

  const MAINTENANCE_INFO_FORM_FIELDS_CONFIG: FormFieldConfig[] = [
    {
      id: 1,
      content: (
        <ControlledSingleDatePicker
          className='mb-8'
          clearErrors={clearErrors}
          isDateRangeMode={false}
          label={FormFieldLabel.LastMaintenanceDate}
          name={'maintenanceInfo.lastMaintenanceDate'}
          numberOfMonths={1}
        />
      ),
      className: 'row-start-1 row-end-2 col-start-1 col-end-4',
    },
    {
      id: 2,
      content: (
        <ControlledSingleDatePicker
          clearErrors={clearErrors}
          isDateRangeMode={false}
          label={FormFieldLabel.NextMaintenanceDate}
          name={'maintenanceInfo.nextMaintenanceDate'}
          numberOfMonths={1}
        />
      ),
      className: 'row-start-1 row-end-2 col-start-4 col-end-7',
    },
    {
      id: 3,
      content: (
        <ControlledSingleSelect<ElevatorRecordFormFields>
          captureMenuScroll={false}
          clearErrors={clearErrors}
          isMultiSelect={false}
          label='Elevator Maintenance Status'
          name='maintenanceInfo.status'
          options={elevatorStatuses}
          placeholder='Select Elevator Maintenance Status'
        />
      ),
      className: 'row-start-2 row-end-3 col-start-1 col-end-7',
    },
  ];

  return (
    <section className='grid grid-cols-6 gap-2'>
      {MAINTENANCE_INFO_FORM_FIELDS_CONFIG.map(({ id, content, className }) => (
        <div key={id} className={className}>
          {content}
        </div>
      ))}
    </section>
  );
};

export default MaintenanceInformation;
