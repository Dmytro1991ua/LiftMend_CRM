import { useMemo } from 'react';

import BaseCalendar from '@/shared/base-calendar';
import { getCalendarModalsConfig } from '@/shared/base-calendar/utils';
import SectionHeader from '@/shared/section-header';
import { SectionHeaderTitle } from '@/types/enums';

import useRepairJobTrackingModals from './hooks/useRepairJobTrackingModals';

const RepairJobTracking = () => {
  const {
    isCreateEventModalOpen,
    isDeleteEventModalOpen,
    onCloseDeleteEventModalOpen,
    onCloseCreateEventModalOpen,
    onOpenDeleteEventModalOpen,
    onHandleDateClick,
  } = useRepairJobTrackingModals();

  const modalsConfig = useMemo(
    () => getCalendarModalsConfig(isCreateEventModalOpen, onCloseCreateEventModalOpen),
    [isCreateEventModalOpen, onCloseCreateEventModalOpen]
  );

  const calendarActions = {
    isDeleteEventModalOpen,
    onOpenDeleteEventModalOpen,
    onCloseDeleteEventModalOpen,
    onHandleDateClick,
  };

  return (
    <section>
      <SectionHeader title={SectionHeaderTitle.RepairJobTracking} />
      <div className='content-wrapper md:h-[75vh] overflow-y-auto overflow-x-hidden'>
        <BaseCalendar calendarActions={calendarActions} />
        {modalsConfig.map(({ id, content }) => (
          <div key={id}>{content}</div>
        ))}
      </div>
    </section>
  );
};

export default RepairJobTracking;
