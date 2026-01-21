import { MockedResponse } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { mockElevatorId } from '@/mocks/elevatorManagementMocks';
import { withApolloProvider } from '@/mocks/testMocks';
import CompleteElevatorInspectionCell, {
  COMPLETE_ELEVATOR_INSPECTION_MODAL_MESSAGE,
} from '@/modules/elevator-management/components/complete-elevator-inspection-cell/CompleteElevatorInspectionCell';
import { useCompleteElevatorInspection } from '@/modules/elevator-management/hooks';
import { useModal } from '@/shared/hooks';

jest.mock('@/modules/elevator-management/hooks', () => ({
  ...jest.requireActual('@/modules/elevator-management/hooks'),
  useCompleteElevatorInspection: jest.fn(),
}));

jest.mock('@/shared/hooks', () => ({
  ...jest.requireActual('@/shared/hooks'),
  useModal: jest.fn(),
}));

describe('CompleteElevatorInspectionCell', () => {
  const mockOnCloseModal = jest.fn();
  const mockOnOpenModal = jest.fn();
  const mockOnCompleteElevatorInspection = jest.fn();
  const baseModalMock = {
    isModalOpen: false,
    onCloseModal: mockOnCloseModal,
    onOpenModal: mockOnOpenModal,
  };

  beforeEach(() => {
    (useModal as jest.Mock).mockReturnValue({
      ...baseModalMock,
    });

    (useCompleteElevatorInspection as jest.Mock).mockReturnValue({
      isLoading: false,
      onCompleteElevatorInspection: mockOnCompleteElevatorInspection,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const CompleteElevatorInspectionCellComponent = (mocks: MockedResponse[] = []) =>
    withApolloProvider(<CompleteElevatorInspectionCell elevatorId={mockElevatorId} />, mocks);

  it('should render component without crashing', () => {
    render(CompleteElevatorInspectionCellComponent());

    expect(screen.getByTestId('complete-elevator-inspection-btn')).toBeInTheDocument();
    expect(screen.getByTestId('complete-inspection-icon')).toBeInTheDocument();
  });

  it('should call onOpenModal when button is clicked', async () => {
    render(CompleteElevatorInspectionCellComponent());

    const button = screen.getByTestId('complete-elevator-inspection-btn');

    await userEvent.click(button);

    expect(mockOnOpenModal).toHaveBeenCalled();
  });

  it('should render modal content when modal is open', () => {
    (useModal as jest.Mock).mockReturnValue({
      ...baseModalMock,
      isModalOpen: true,
    });

    render(CompleteElevatorInspectionCellComponent());

    expect(screen.getByText('Complete Inspection')).toBeInTheDocument();
    expect(screen.getByText(COMPLETE_ELEVATOR_INSPECTION_MODAL_MESSAGE)).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('should call onCompleteElevatorInspection on submit', async () => {
    (useModal as jest.Mock).mockReturnValue({
      ...baseModalMock,
      isModalOpen: true,
    });

    mockOnCompleteElevatorInspection.mockResolvedValue({});

    render(CompleteElevatorInspectionCellComponent());

    await userEvent.click(screen.getByText('Yes'));

    expect(mockOnCompleteElevatorInspection).toHaveBeenCalledWith(mockElevatorId);
  });

  it('should close modal on successful inspection completion', async () => {
    (useModal as jest.Mock).mockReturnValue({
      ...baseModalMock,
      isModalOpen: true,
    });

    mockOnCompleteElevatorInspection.mockResolvedValue({});

    render(CompleteElevatorInspectionCellComponent());

    await userEvent.click(screen.getByText('Yes'));

    expect(mockOnCloseModal).toHaveBeenCalled();
  });

  it('should NOT close modal if inspection completion returns errors', async () => {
    (useModal as jest.Mock).mockReturnValue({
      ...baseModalMock,
      isModalOpen: true,
    });

    mockOnCompleteElevatorInspection.mockResolvedValue({
      errors: [{ message: 'Something went wrong' }],
    });

    render(CompleteElevatorInspectionCellComponent());

    await userEvent.click(screen.getByText('Yes'));

    expect(mockOnCloseModal).not.toHaveBeenCalled();
  });

  it('should close modal when clicking No', async () => {
    (useModal as jest.Mock).mockReturnValue({
      ...baseModalMock,
      isModalOpen: true,
    });

    render(CompleteElevatorInspectionCellComponent());

    await userEvent.click(screen.getByText('No'));

    expect(mockOnCloseModal).toHaveBeenCalled();
  });

  it('should disable submit button when loading', () => {
    (useModal as jest.Mock).mockReturnValue({
      ...baseModalMock,
      isModalOpen: true,
    });

    (useCompleteElevatorInspection as jest.Mock).mockReturnValue({
      isLoading: true,
      onCompleteElevatorInspection: mockOnCompleteElevatorInspection,
    });

    render(CompleteElevatorInspectionCellComponent());

    const submitButton = screen.getByRole('button', { name: 'Yes' });

    expect(submitButton).toBeDisabled();
  });
});
