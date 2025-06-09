import { render, screen } from '@testing-library/react';

import BaseDetailsPage from '@/shared/base-details-page';
import { BaseDetailsPageProps } from '@/shared/base-details-page/BaseDetailsPage';
import { ActionButtonLabel, DetailsPageActionButtonConfig } from '@/shared/base-details-page/types';

describe('BaseDetailsPage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    error: undefined,
    errorMessage: '',
    loading: false,
    title: 'Test title',
    description: 'Test description',
    detailsPageSections: [
      {
        id: 1,
        title: 'Basic Information',
        fields: [
          {
            id: 2,
            label: 'Full Name',
            value: 'William Thomas',
          },
          {
            id: 3,
            label: 'Contact Information',
            value: 'william.thomas@example.com',
          },
        ],
      },
      {
        id: 2,
        title: 'Skills and Certifications',
        fields: [
          {
            id: 7,
            label: 'Technician Skill(s)',
            value: 'System Upgrades',
          },
          {
            id: 9,
            label: 'Technician Certificate(s):',
            value: 'Fire Safety and Prevention',
          },
        ],
      },
    ],
    modalConfig: [
      {
        id: 1,
        content: <p>Edit Modal</p>,
      },
      {
        id: 2,
        content: <p>Delete Modal</p>,
      },
    ],
    actionButtonsConfig: [
      {
        id: 1,
        label: ActionButtonLabel.EDIT,
      },
      {
        id: 2,
        label: ActionButtonLabel.DELETE,
      },
    ] as DetailsPageActionButtonConfig[],
    alertMessage: undefined,
  };

  const BaseDetailsPageComponent = (props?: Partial<BaseDetailsPageProps>) => (
    <BaseDetailsPage {...defaultProps} {...props} />
  );

  it('should render component without crashing', () => {
    render(BaseDetailsPageComponent());

    const detailsPageSectionCards = screen.getAllByTestId('base-card');

    expect(detailsPageSectionCards).toHaveLength(2);
    expect(screen.getByText('Basic Information')).toBeInTheDocument();
    expect(screen.getByText('Skills and Certifications')).toBeInTheDocument();
    expect(screen.getByTestId('go-back-button')).toBeInTheDocument();
    expect(screen.getByText('Test title')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('should render loader when loading is true', () => {
    render(BaseDetailsPageComponent({ loading: true }));

    const loaders = screen.getAllByTestId('audio-svg');

    // Loader within header and content sections
    expect(loaders).toHaveLength(2);
  });

  it('should render error alert message when error occurs', () => {
    const mockError = 'Something went wrong';
    const mockErrorMessage = 'Test error occurs';

    render(BaseDetailsPageComponent({ error: mockError, errorMessage: mockErrorMessage }));

    expect(screen.getByTestId('base-alert')).toBeInTheDocument();
    expect(screen.getByText(mockError)).toBeInTheDocument();
    expect(screen.getByText(mockErrorMessage)).toBeInTheDocument();
  });

  it('should render additional alert message when provided', () => {
    const mockAlertMessage = 'Test info alert message';

    render(BaseDetailsPageComponent({ alertMessage: <p>{mockAlertMessage}</p> }));

    expect(screen.getByText(mockAlertMessage)).toBeInTheDocument();
  });
});
