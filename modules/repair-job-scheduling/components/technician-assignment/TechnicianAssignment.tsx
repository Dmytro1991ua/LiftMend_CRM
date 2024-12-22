import { Fragment } from 'react';

import { useFormContext } from 'react-hook-form';

import { GetRepairJobFromDataQuery } from '@/graphql/types/client/generated_types';
import ControlledSingleSelect from '@/shared/base-select/components/controlled-single-select';
import { useFetchDropdownOptions } from '@/shared/hooks/useFetchDropdownOptions';
import { DropdownOptions } from '@/shared/hooks/useFetchDropdownOptions/config';
import { ItemConfig } from '@/shared/types';

import { RepairJobFromFields } from '../repair-job-tracking-from/validation';

const TechnicianAssignment = () => {
  const { clearErrors } = useFormContext<RepairJobFromFields>();

  const {
    dropdownOptions: { technicianNames },
  } = useFetchDropdownOptions<GetRepairJobFromDataQuery>(DropdownOptions.RepairJob);

  const TECHNICIAN_ASSIGNMENT_FORM_FIELDS_CONFIG: ItemConfig[] = [
    {
      id: 1,
      content: (
        <ControlledSingleSelect<RepairJobFromFields>
          captureMenuScroll={false}
          clearErrors={clearErrors}
          hasSearchInput={true}
          isMultiSelect={false}
          label='Technician Name'
          name='technicianAssignment.technicianName'
          options={technicianNames}
          placeholder='Select Technician Name'
          searchInputPlaceholder='Search for Technician name...'
        />
      ),
    },
  ];

  return (
    <section>
      {TECHNICIAN_ASSIGNMENT_FORM_FIELDS_CONFIG.map(({ id, content }) => (
        <Fragment key={id}>{content}</Fragment>
      ))}
    </section>
  );
};

export default TechnicianAssignment;
