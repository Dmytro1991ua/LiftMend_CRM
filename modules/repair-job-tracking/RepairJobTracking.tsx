import { useCallback, useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';

import BaseCalendar from '@/shared/base-calendar';
import { getCalendarModalsConfig } from '@/shared/base-calendar/utils';
import SectionHeader from '@/shared/section-header';
import { SectionHeaderTitle } from '@/types/enums';

import { RepairJobFromFields, repairJobFormSchema } from './components/repair-job-tracking-from/validation';
import useRepairJobTrackingModals from './hooks/useRepairJobTrackingModals';

const RepairJobTracking = () => {
  const formState = useForm<RepairJobFromFields>({
    shouldUnregister: false,
    mode: 'onSubmit',
    shouldFocusError: true,
    defaultValues: {
      jobTitle: '',
      jobDescription: '',
      priority: undefined,
    },
    resolver: zodResolver(repairJobFormSchema),
  });

  const { reset, clearErrors } = formState;

  const {
    selectedDateRange,
    isCreateEventModalOpen,
    isDeleteEventModalOpen,
    onCloseDeleteEventModalOpen,
    onCloseCreateEventModalOpen,
    onOpenDeleteEventModalOpen,
    onHandleDateClick,
  } = useRepairJobTrackingModals();

  const onReset = useCallback((): void => {
    reset({ jobTitle: '', jobDescription: '', priority: undefined });
    clearErrors();
    onCloseCreateEventModalOpen();
  }, [reset, clearErrors, onCloseCreateEventModalOpen]);

  const modalsConfig = useMemo(
    () => getCalendarModalsConfig({ isCreateEventModalOpen, selectedDateRange, onReset }),
    [isCreateEventModalOpen, selectedDateRange, onReset]
  );

  const calendarActions = {
    isDeleteEventModalOpen,
    onOpenDeleteEventModalOpen,
    onCloseDeleteEventModalOpen,
    onHandleDateClick,
  };

  return (
    <FormProvider {...formState}>
      <section>
        <SectionHeader title={SectionHeaderTitle.RepairJobTracking} />
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
