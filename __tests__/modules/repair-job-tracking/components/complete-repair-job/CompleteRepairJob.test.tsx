import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { mockRepairJob } from '@/mocks/repairJobTrackingMocks';
import { withApolloAndFormProvider } from '@/mocks/testMocks';
import CompleteRepairJob, {
  CompleteRepairJobProps,
} from '@/modules/repair-job-tracking/components/complete-repair-job/CompleteRepairJob';
import { COMPLETE_BUTTON_TOOLTIP_MESSAGES } from '@/modules/repair-job-tracking/components/complete-repair-job/constant';
import { getCompleteButtonDisabledState } from '@/modules/repair-job-tracking/components/complete-repair-job/utils';
import { useModal } from '@/shared/hooks';
import { useUpdateRepairJob } from '@/shared/repair-job/hooks';

jest.mock('@/shared/hooks', () => ({
  ...jest.requireActual('@/shared/hooks'),
  useModal: jest.fn(),
}));

jest.mock('@/shared/repair-job/hooks', () => ({
  ...jest.requireActual('@/shared/repair-job/hooks'),
  useUpdateRepairJob: jest.fn(),
}));

jest.mock('@/modules/repair-job-tracking/components/complete-repair-job/utils', () => ({
  ...jest.requireActual('@/modules/repair-job-tracking/components/complete-repair-job/utils'),
  getCompleteButtonDisabledState: jest.fn(),
}));

describe('CompleteRepairJob', () => {
  const mockOnOpenModal = jest.fn();
  const mockOnCloseModal = jest.fn();
  const mockOnCompleteRepairJob = jest.fn();

  (useModal as jest.Mock).mockReturnValue({
    isModalOpen: false,
    onOpenModal: mockOnOpenModal,
    onCloseModal: mockOnCloseModal,
  });

  (useUpdateRepairJob as jest.Mock).mockReturnValue({
    onCompleteRepairJob: mockOnCompleteRepairJob,
    isLoading: false,
  });

  (getCompleteButtonDisabledState as jest.Mock).mockReturnValue({
    'On Hold': { isCompleteButtonDisabled: false, tooltipMessage: '' },
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const CompleteRepairJobComponent = (props?: Partial<CompleteRepairJobProps>) =>
    withApolloAndFormProvider(<CompleteRepairJob repairJob={{ ...mockRepairJob, checklist: [] }} {...props} />);

  it('should render icon variant by default', () => {
    render(CompleteRepairJobComponent());

    const icon = screen.getByTestId('complete-icon');

    expect(icon).toBeInTheDocument();
    expect(screen.queryByText('Complete')).not.toBeInTheDocument();
  });

  it('should render button variant with text', () => {
    render(CompleteRepairJobComponent({ variant: 'button' }));

    expect(screen.getByText('Complete')).toBeInTheDocument();
  });

  it('should disable button and show tooltip on hover', async () => {
    (getCompleteButtonDisabledState as jest.Mock).mockReturnValue({
      Scheduled: { isCompleteButtonDisabled: true, tooltipMessage: COMPLETE_BUTTON_TOOLTIP_MESSAGES.Scheduled },
    });

    render(CompleteRepairJobComponent());

    const button = screen.getByRole('button');

    expect(button).toBeDisabled();

    await userEvent.hover(button);

    const tooltipText = await screen.findByText(COMPLETE_BUTTON_TOOLTIP_MESSAGES.Scheduled);

    expect(tooltipText).toBeInTheDocument();
  });

  it('should open Complete Repair Job modal', async () => {
    render(CompleteRepairJobComponent({ repairJob: { ...mockRepairJob, checklist: [], status: 'In Progress' } }));

    const button = screen.getByRole('button');

    await userEvent.click(button);

    expect(mockOnOpenModal).toHaveBeenCalled();
  });

  it('should close Complete Repair Job on Cancel button click', async () => {
    (useModal as jest.Mock).mockReturnValue({
      isModalOpen: true,
      onCloseModal: mockOnCloseModal,
    });

    render(CompleteRepairJobComponent());

    const cancelButtonClick = screen.getByText('Cancel');

    await userEvent.click(cancelButtonClick);

    expect(mockOnCloseModal).toHaveBeenCalled();
  });

  it('should trigger onCompleteRepairJob handler on Complete button click and lose modal', async () => {
    (useModal as jest.Mock).mockReturnValue({
      isModalOpen: true,
      onCloseModal: mockOnCloseModal,
    });

    render(CompleteRepairJobComponent());

    const completeBtn = screen.getByText('Complete');

    await userEvent.click(completeBtn);

    await waitFor(() => {
      expect(mockOnCompleteRepairJob).toHaveBeenCalled();
    });
    expect(mockOnCloseModal).toHaveBeenCalled();
  });

  it('should not close modal if onCompleteRepairJob return errors', async () => {
    mockOnCompleteRepairJob.mockResolvedValue({ errors: ['some error'] });

    (useModal as jest.Mock).mockReturnValue({
      isModalOpen: true,
      onOpenModal: mockOnOpenModal,
      onCloseModal: mockOnCloseModal,
    });

    render(CompleteRepairJobComponent());

    const completeBtn = screen.getByText('Complete');

    await userEvent.click(completeBtn);

    await waitFor(() => {
      expect(mockOnCompleteRepairJob).toHaveBeenCalledWith({ ...mockRepairJob, checklist: [] });
    });
    expect(mockOnCloseModal).not.toHaveBeenCalled();
  });
});
