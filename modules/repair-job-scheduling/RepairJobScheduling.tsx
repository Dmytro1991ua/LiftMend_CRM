import { useMemo } from 'react';

import { FormProvider } from 'react-hook-form';

import BaseCalendar from '@/shared/base-calendar';
import { getCalendarModalsConfig } from '@/shared/base-calendar/config';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';
import SectionHeader from '@/shared/section-header';
import { SectionHeaderDescription, SectionHeaderTitle } from '@/types/enums';

import useDeleteRepairJobAndCalendarEvent from '../../shared/hooks/useDeleteRepairJobAndCalendarEvent';

import useRepairJobTrackingFormState from './hooks/useRepairJobTrackingFormState';
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

  const { onError, onSuccess } = useMutationResultToasts();

  const { formState, onReset } = useRepairJobTrackingFormState({ onCloseCreateEventModal });

  const { onDeleteRepairJobAndCalendarEvent, isLoading } = useDeleteRepairJobAndCalendarEvent({
    onError,
    onSuccess,
  });

  const onDeleteCalendarEvent = async (calendarEventId?: string, repairJobId?: string) => {
    await onDeleteRepairJobAndCalendarEvent(calendarEventId, repairJobId);

    onCloseDeleteEventModal();
  };

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
    isLoading,
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
