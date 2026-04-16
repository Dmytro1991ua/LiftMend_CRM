import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SubmitHandler } from 'react-hook-form';

import { mockRepairJob } from '@/mocks/repairJobTrackingMocks';
import { withApolloAndFormProvider } from '@/mocks/testMocks';
import CompleteRepairJob, {
  CompleteRepairJobProps,
} from '@/modules/repair-job-tracking/components/complete-repair-job/CompleteRepairJob';
import { COMPLETE_BUTTON_TOOLTIP_MESSAGES } from '@/modules/repair-job-tracking/components/complete-repair-job/constant';
import { useCompleteRepairJob } from '@/modules/repair-job-tracking/components/complete-repair-job/hooks';
import { getCompleteButtonDisabledState } from '@/modules/repair-job-tracking/components/complete-repair-job/utils';
import { BaseEntityStatusTriggerProps } from '@/shared/base-entity-status-trigger/BaseEntityStatusTrigger';
import { ControlledSingleFileDropzoneProps } from '@/shared/base-file-upload/controlled-single-file-upload/ControlledSingleFileUpload';
import { FileUploadPreviewProps } from '@/shared/base-file-upload/file-upload-preview/types';

jest.mock('@/modules/repair-job-tracking/components/complete-repair-job/hooks', () => ({
  ...jest.requireActual('@/modules/repair-job-tracking/components/complete-repair-job/hooks'),
  useCompleteRepairJob: jest.fn(),
}));

jest.mock('@/modules/repair-job-tracking/components/complete-repair-job/utils', () => ({
  ...jest.requireActual('@/modules/repair-job-tracking/components/complete-repair-job/utils'),
  getCompleteButtonDisabledState: jest.fn(),
}));

jest.mock('@/shared/base-entity-status-trigger', () => ({
  __esModule: true,
  default: ({
    children,
    variant,
    onOpenModal,
    onConfirm,
    isButtonDisabled,
    tooltipMessage,
    isTooltipShown,
  }: BaseEntityStatusTriggerProps) => (
    <div>
      <div data-testid='variant'>{variant}</div>
      <button disabled={isButtonDisabled} onClick={onOpenModal}>
        open
      </button>
      <button disabled={isButtonDisabled} onClick={onConfirm}>
        confirm
      </button>
      {isTooltipShown && tooltipMessage && <div data-testid='tooltip'>{tooltipMessage}</div>}
      {children}
    </div>
  ),
}));

jest.mock('@/modules/repair-job-tracking/components/complete-repair-job/controlled-checklist', () => ({
  __esModule: true,
  default: function ControlledChecklistMock() {
    return <div data-testid='checklist' />;
  },
}));

jest.mock('@/shared/base-file-upload/controlled-single-file-upload', () => ({
  __esModule: true,
  default: ({ children }: ControlledSingleFileDropzoneProps<{ evidencePhoto: File | null }>) => <div>{children}</div>,
}));

jest.mock('@/shared/base-file-upload/file-upload-preview', () => ({
  __esModule: true,
  default: ({ previewImage, onRemove }: FileUploadPreviewProps) => (
    <div>
      <span data-testid='preview'>{previewImage || 'no-preview'}</span>
      <button onClick={onRemove}>remove</button>
    </div>
  ),
}));

describe('CompleteRepairJob', () => {
  const mockOnOpenModal = jest.fn();
  const mockOoHandleCloseModal = jest.fn();
  const mockOnHandleComplete = jest.fn();
  const mockFile = new File(['fake'], 'before-photo.png', {
    type: 'image/png',
  });
  const mockHandleSubmit = <T,>(fn: SubmitHandler<{ evidencePhoto: File | null }>) => {
    return () => fn({} as { evidencePhoto: File | null });
  };
  const mockForm = {
    watch: jest.fn(),
    handleSubmit: mockHandleSubmit,
    clearErrors: jest.fn(),
    resetField: jest.fn(),
    formState: { errors: {} },
  };

  beforeEach(() => {
    (getCompleteButtonDisabledState as jest.Mock).mockReturnValue({
      'On Hold': { isCompleteButtonDisabled: false, tooltipMessage: '' },
    });

    (useCompleteRepairJob as jest.Mock).mockReturnValue({
      formState: mockForm,
      isModalOpen: false,
      onOpenModal: mockOnOpenModal,
      onHandleCloseModal: mockOoHandleCloseModal,
      onHandleComplete: mockOnHandleComplete,
      isLoading: false,
    });

    global.URL.createObjectURL = jest.fn(() => 'mock-url');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const CompleteRepairJobComponent = (props?: Partial<CompleteRepairJobProps>) =>
    withApolloAndFormProvider(<CompleteRepairJob repairJob={{ ...mockRepairJob, checklist: [] }} {...props} />, [], {
      defaultValues: {
        evidencePhoto: mockFile,
        checklist: [],
      },
    });

  it('should render icon variant by default', () => {
    render(CompleteRepairJobComponent());

    expect(screen.getByTestId('variant')).toHaveTextContent('icon');
  });

  it('should render button variant if provided', () => {
    render(CompleteRepairJobComponent({ variant: 'button' }));

    expect(screen.getByTestId('variant')).toHaveTextContent('button');
  });

  it('should disable button and NOT show tooltip when disabled', async () => {
    (getCompleteButtonDisabledState as jest.Mock).mockReturnValue({
      Scheduled: {
        isCompleteButtonDisabled: true,
        tooltipMessage: COMPLETE_BUTTON_TOOLTIP_MESSAGES.Scheduled,
      },
    });

    render(CompleteRepairJobComponent());

    const button = screen.getByRole('button', { name: 'confirm' });

    expect(button).toBeDisabled();

    expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
  });

  it('should show tooltip when button is enabled', async () => {
    (getCompleteButtonDisabledState as jest.Mock).mockReturnValue({
      Scheduled: {
        isCompleteButtonDisabled: false,
        tooltipMessage: COMPLETE_BUTTON_TOOLTIP_MESSAGES.Scheduled,
      },
    });

    render(CompleteRepairJobComponent());

    const button = screen.getByRole('button', { name: 'confirm' });

    expect(button).toBeEnabled();

    expect(screen.getByTestId('tooltip')).toHaveTextContent(COMPLETE_BUTTON_TOOLTIP_MESSAGES.Scheduled);
  });

  it('should render and shows file upload preview when file exists', () => {
    mockForm.watch.mockReturnValue(mockFile);

    render(CompleteRepairJobComponent());

    expect(screen.getByTestId('preview')).toHaveTextContent('mock-url');
  });

  it('should open modal when trigger clicked', () => {
    render(CompleteRepairJobComponent());

    fireEvent.click(screen.getByText('open'));

    expect(mockOnOpenModal).toHaveBeenCalled();
  });

  it('should submit form and call onHandleComplete', async () => {
    render(CompleteRepairJobComponent());

    fireEvent.click(screen.getByText('confirm'));

    await waitFor(() => {
      expect(mockOnHandleComplete).toHaveBeenCalled();
    });
  });

  it('should reset file field when remove clicked', () => {
    mockForm.watch.mockReturnValue(new File(['img'], 'img.png'));

    render(CompleteRepairJobComponent());

    fireEvent.click(screen.getByText('remove'));

    expect(mockForm.resetField).toHaveBeenCalledWith('evidencePhoto');
  });
});
