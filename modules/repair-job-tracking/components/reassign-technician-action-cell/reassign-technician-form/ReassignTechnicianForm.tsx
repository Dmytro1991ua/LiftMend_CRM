import React, { useMemo } from 'react';

import { useFormContext } from 'react-hook-form';

import BaseAlert from '@/shared/base-alert/BaseAlert';
import ControlledSingleSelect from '@/shared/base-select/components/controlled-single-select';
import InfoTooltip from '@/shared/base-tooltip/info-tooltip/InfoTooltip';
import { RepairJob } from '@/shared/types';

import { TECHNICIAN_NAME_FIELD_TOOLTIP_MESSAGE } from '../constants';
import { getReassignTechnicianWarningMessage } from '../utils';

import { useFetchAvailableTechniciansForAssignment } from './hooks';
import { TechnicianReassignmentFormFields } from './validation';

type ReassignTechnicianFormProps = {
  repairJob: RepairJob;
};

const ReassignTechnicianForm = ({ repairJob }: ReassignTechnicianFormProps) => {
  const { clearErrors } = useFormContext<TechnicianReassignmentFormFields>();

  const { availableTechnicians } = useFetchAvailableTechniciansForAssignment();

  const warningMessage = useMemo(() => getReassignTechnicianWarningMessage(repairJob), [repairJob]);

  return (
    <>
      <BaseAlert className='mb-6' description={warningMessage} variant='warning' />
      <ControlledSingleSelect<TechnicianReassignmentFormFields>
        captureMenuScroll={false}
        className='mb-4'
        clearErrors={clearErrors}
        infoTooltip={
          <InfoTooltip
            className='w-[33rem]'
            iconColor='#2563eb'
            iconSize='14'
            id={'job-type-field-id'}
            message={TECHNICIAN_NAME_FIELD_TOOLTIP_MESSAGE}
            place='right'
          />
        }
        isMultiSelect={false}
        label='Technician Name'
        name='technicianName'
        options={availableTechnicians}
        placeholder='Select Technician name'
      />
    </>
  );
};

export default ReassignTechnicianForm;
