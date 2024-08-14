import { useMemo } from 'react';

import { FormProvider } from 'react-hook-form';

import BaseCalendar from '@/shared/base-calendar';
import { getCalendarModalsConfig } from '@/shared/base-calendar/utils';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';
import SectionHeader from '@/shared/section-header';
import { SectionHeaderDescription, SectionHeaderTitle } from '@/types/enums';

import useDeleteRepairJobAndCalendarEvent from './hooks/useDeleteRepairJobAndCalendarEvent';
import useRepairJobTrackingFormState from './hooks/useRepairJobTrackingFormState';
import useRepairJobTrackingModals from './hooks/useRepairJobTrackingModals';

const RepairJobTracking = () => {
  const {
    selectedDateRange,
    isCreateEventModalOpen,
    isDeleteEventModalOpen,
    onCloseDeleteEventModalOpen,
    onCloseCreateEventModalOpen,
    onOpenDeleteEventModalOpen,
    onHandleDateClick,
  } = useRepairJobTrackingModals();

  const { onError, onSuccess } = useMutationResultToasts();

  const { formState, onReset } = useRepairJobTrackingFormState({ onCloseCreateEventModalOpen });

  const { onDeleteRepairJobAndCalendarEvent, isLoading } = useDeleteRepairJobAndCalendarEvent({
    onError,
    onSuccess,
  });

  const onDeleteCalendarEvent = async (calendarEventId?: string, repairJobId?: string) => {
    await onDeleteRepairJobAndCalendarEvent(calendarEventId, repairJobId);

    onCloseDeleteEventModalOpen();
  };

  const modalsConfig = useMemo(
    () => getCalendarModalsConfig({ isCreateEventModalOpen, selectedDateRange, onReset }),
    [isCreateEventModalOpen, selectedDateRange, onReset]
  );

  const calendarActions = {
    isDeleteEventModalOpen,
    onDeleteCalendarEvent,
    onOpenDeleteEventModalOpen,
    onCloseDeleteEventModalOpen,
    onHandleDateClick,
    isLoading,
  };

  return (
    <FormProvider {...formState}>
      <section>
        <SectionHeader
          subtitle={SectionHeaderDescription.RepairJobTracking}
          title={SectionHeaderTitle.RepairJobTracking}
        />
        <div className='content-wrapper md:h-[75vh] overflow-y-auto overflow-x-hidden'>
          <BaseCalendar calendarActions={calendarActions} />
          {modalsConfig.map(({ id, content }) => (
            <div key={id}>{content}</div>
          ))}
        </div>
      </section>
    </FormProvider>
  );
};

export default RepairJobTracking;
