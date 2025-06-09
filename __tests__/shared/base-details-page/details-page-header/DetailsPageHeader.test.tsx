import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';

import { withRouterProvider } from '@/mocks/testMocks';
import DetailsPageHeader from '@/shared/base-details-page/details-page-header';
import { DetailsPageHeaderProps } from '@/shared/base-details-page/details-page-header/DetailsPageHeader';
import { ActionButtonLabel } from '@/shared/base-details-page/types';
import { ButtonVariant } from '@/shared/types';
import { AppRoutes } from '@/types/enums';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('DetailsPageHeader', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockRouterBack = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    loading: false,
    description: 'Test Header description',
    title: 'Test Header title',
    actionButtonsConfig: [
      {
        id: 1,
        icon: <p>Edit Icon</p>,
        label: ActionButtonLabel.EDIT,
        variant: 'default' as ButtonVariant,
        onClick: mockOnEdit,
      },
      {
        id: 2,
        icon: <p>Delete Icon</p>,
        label: ActionButtonLabel.DELETE,
        variant: 'destructive' as ButtonVariant,
        isDisabled: true,
        onClick: mockOnDelete,
      },
    ],
  };

  const DetailsPageHeaderComponent = (props?: Partial<DetailsPageHeaderProps>, route?: AppRoutes) =>
    withRouterProvider(<DetailsPageHeader {...defaultProps} {...props} />, route as AppRoutes);

  it('should render component without crashing', () => {
    render(DetailsPageHeaderComponent());

    expect(screen.getByTestId('go-back-button')).toBeInTheDocument();
    expect(screen.getByText('Test Header title')).toBeInTheDocument();
    expect(screen.getByText('Test Header description')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('should render loader spinner when loading is true', () => {
    render(DetailsPageHeaderComponent({ loading: true }));

    expect(screen.getByTestId('audio-svg')).toBeInTheDocument();
  });

  it('should redirect to a previous page when go back button is clicked', async () => {
    (useRouter as jest.Mock).mockReturnValue({
      back: mockRouterBack,
    });

    render(DetailsPageHeaderComponent());

    const goBackButton = screen.getByTestId('go-back-button');

    await userEvent.click(goBackButton);

    expect(mockRouterBack).toHaveBeenCalled;
  });

  it('should open modal on Edit button click when isDisabled is false', async () => {
    render(DetailsPageHeaderComponent());

    const editButton = screen.getByText('Edit');

    await userEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalled();
  });

  it('should disable Edit button when isDisabled is true', async () => {
    render(
      DetailsPageHeaderComponent({
        actionButtonsConfig: [
          {
            id: 1,
            icon: <p>Edit Icon</p>,
            label: ActionButtonLabel.EDIT,
            variant: 'default' as ButtonVariant,
            isDisabled: true,
            onClick: mockOnEdit,
          },
        ],
      })
    );

    const editButton = screen.getByRole('button', { name: /Edit/ });

    expect(editButton).toBeDisabled();
  });

  it('should open modal on Delete button click', async () => {
    render(
      DetailsPageHeaderComponent({
        actionButtonsConfig: [
          {
            id: 2,
            icon: <p>Delete Icon</p>,
            label: ActionButtonLabel.DELETE,
            variant: 'destructive' as ButtonVariant,
            onClick: mockOnDelete,
          },
        ],
      })
    );

    const deleteButton = screen.getByRole('button', { name: /Delete/ });

    await userEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalled();
  });

  it('should disable Delete button when isDisabled is true', async () => {
    render(DetailsPageHeaderComponent());

    const deleteButton = screen.getByRole('button', { name: /Delete/ });

    expect(deleteButton).toBeDisabled();
  });
});
