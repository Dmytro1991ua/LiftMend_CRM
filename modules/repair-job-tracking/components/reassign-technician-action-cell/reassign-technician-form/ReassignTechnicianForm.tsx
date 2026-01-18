import React, { useMemo } from 'react';

import { useFormContext } from 'react-hook-form';

import BaseAlert from '@/shared/base-alert/BaseAlert';
import ControlledSingleSelect from '@/shared/base-select/components/controlled-single-select';
import InfoTooltip from '@/shared/base-tooltip/info-tooltip/InfoTooltip';
import { useFetchAvailableTechniciansForAssignment } from '@/shared/hooks';
import { RepairJob } from '@/shared/types';

import { TECHNICIAN_NAME_FIELD_TOOLTIP_MESSAGE } from '../constants';
import { getReassignTechnicianWarningMessage } from '../utils';

import { TechnicianReassignmentFormFields } from './validation';

export type ReassignTechnicianFormProps = {
  repairJob: RepairJob;
};

const ReassignTechnicianForm = ({ repairJob }: ReassignTechnicianFormProps) => {
  const { clearErrors } = useFormContext<TechnicianReassignmentFormFields>();

  const { availableTechnicians } = useFetchAvailableTechniciansForAssignment();

  const warningMessage = useMemo(() => getReassignTechnicianWarningMessage(repairJob), [repairJob]);

  return (
    <>
      <BaseAlert className='mb-6' data-testid='warning-alert' description={warningMessage} variant='warning' />
      <ControlledSingleSelect<TechnicianReassignmentFormFields>
        isStoringValueAsObject
        captureMenuScroll={false}
        className='mb-4'
        clearErrors={clearErrors}
        infoTooltip={
          <InfoTooltip
            className='w-[33rem] !shadow-none'
            iconColor='#2563eb'
            iconSize='14'
            id={'job-type-field-id'}
            message={TECHNICIAN_NAME_FIELD_TOOLTIP_MESSAGE}
            place='right'
          />
        }
        isMultiSelect={false}
        label='Technician Name'
        name='selectedTechnician'
        options={availableTechnicians}
        placeholder='Select Technician name'
      />
    </>
  );
};

export default ReassignTechnicianForm;
