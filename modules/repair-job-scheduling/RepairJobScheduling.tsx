import { useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider } from 'react-hook-form';

import BaseCalendar from '@/shared/base-calendar';
import { getCalendarModalsConfig } from '@/shared/base-calendar/config';
import { useFormState } from '@/shared/hooks';
import useRepairJobDeletion from '@/shared/repair-job/hooks/useRepairJobDeletion';
import SectionHeader from '@/shared/section-header';
import { SectionHeaderDescription, SectionHeaderTitle } from '@/types/enums';

import {
  INITIAL_REPAIR_JOB_VALUES,
  RepairJobFromFields,
  repairJobFormSchema,
} from './components/repair-job-tracking-from/validation';
import useRepairJobTrackingModals from './hooks/useRepairJobTrackingModals';

const RepairJobScheduling = () => {
  const {
    selectedDateRange,
    isCreateEventModalOpen,
    isDeleteEventModalOpen,
    onCloseDeleteEventModal,
    onCloseCreateEventModal,
    onOpenDeleteEventModal,
    onHandleDateClick,
  } = useRepairJobTrackingModals();

  const { isDeleteRepairJobLoading, onDeleteCalendarEvent } = useRepairJobDeletion({
    onCloseModal: onCloseDeleteEventModal,
  });

  const { formState, onReset } = useFormState<RepairJobFromFields>({
    initialValues: INITIAL_REPAIR_JOB_VALUES,
    onCloseModal: onCloseCreateEventModal,
    resolver: zodResolver(repairJobFormSchema),
  });

  const modalsConfig = useMemo(
    () => getCalendarModalsConfig({ isCreateEventModalOpen, selectedDateRange, onReset }),
    [isCreateEventModalOpen, selectedDateRange, onReset]
  );

  const calendarActions = {
    isDeleteEventModalOpen,
    onDeleteCalendarEvent,
    onOpenDeleteEventModal,
    onCloseDeleteEventModal,
    onHandleDateClick,
    isDeleteRepairJobLoading,
  };

  return (
    <FormProvider {...formState}>
      <section>
        <SectionHeader
          subtitle={SectionHeaderDescription.RepairJobScheduling}
          title={SectionHeaderTitle.RepairJobScheduling}
        />
        <div className='content-wrapper h-[73vh] overflow-y-auto overflow-x-hidden'>
          <BaseCalendar calendarActions={calendarActions} />
          {modalsConfig.map(({ id, content }) => (
            <div key={id}>{content}</div>
          ))}
        </div>
      </section>
    </FormProvider>
  );
};

export default RepairJobScheduling;
