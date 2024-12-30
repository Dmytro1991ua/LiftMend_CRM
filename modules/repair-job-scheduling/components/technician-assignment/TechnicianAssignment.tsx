import { Fragment } from 'react';

import { useFormContext } from 'react-hook-form';
import { Bars } from 'react-loader-spinner';

import { useFetchAvailableTechniciansForAssignment } from '@/modules/repair-job-tracking/components/reassign-technician-action-cell/reassign-technician-form/hooks';
import BaseAlert from '@/shared/base-alert/BaseAlert';
import ControlledSingleSelect from '@/shared/base-select/components/controlled-single-select';
import InfoTooltip from '@/shared/base-tooltip/info-tooltip/InfoTooltip';
import QueryResponse from '@/shared/query-response';
import { ItemConfig } from '@/shared/types';

import { TECHNICIAN_NAME_TOOLTIP_MESSAGE } from '../../constants';
import { RepairJobFromFields } from '../repair-job-tracking-from/validation';

const TechnicianAssignment = () => {
  const { clearErrors } = useFormContext<RepairJobFromFields>();

  const { availableTechnicians, loading, error } = useFetchAvailableTechniciansForAssignment();

  const TECHNICIAN_ASSIGNMENT_FORM_FIELDS_CONFIG: ItemConfig[] = [
    {
      id: 1,
      content: (
        <ControlledSingleSelect<RepairJobFromFields>
          captureMenuScroll={false}
          clearErrors={clearErrors}
          hasSearchInput={true}
          infoTooltip={
            <InfoTooltip
              className='w-[33rem]'
              iconColor='#2563eb'
              iconSize='14'
              id={'job-type-field-id'}
              message={TECHNICIAN_NAME_TOOLTIP_MESSAGE}
              place='right'
            />
          }
          isMultiSelect={false}
          label='Technician Name'
          name='technicianAssignment.technicianName'
          options={availableTechnicians}
          placeholder='Select Technician Name'
          searchInputPlaceholder='Search for Technician name...'
        />
      ),
    },
  ];

  return (
    <>
      <QueryResponse
        errorComponent={
          <BaseAlert description={error} title='Failed to fetch elevator details' variant='destructive' />
        }
        isErrorOccurred={!!error}
        loading={loading}
        loadingComponent={
          <Bars
            ariaLabel='bars-loading'
            color='#2563eb'
            height='80'
            visible={true}
            width='80'
            wrapperClass='justify-center'
          />
        }
      />
      {!loading && !error && (
        <section>
          {TECHNICIAN_ASSIGNMENT_FORM_FIELDS_CONFIG.map(({ id, content }) => (
            <Fragment key={id}>{content}</Fragment>
          ))}
        </section>
      )}
    </>
  );
};

export default TechnicianAssignment;
