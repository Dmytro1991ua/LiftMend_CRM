import { render, screen } from '@testing-library/react';

import DetailsPageContent, {
  DetailsPageContentProps,
} from '@/shared/base-details-page/details-page-content/DetailsPageContent';

describe('DetailsPageContent', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    loading: false,
    error: undefined,
    detailsPageSections: [
      {
        id: 1,
        title: 'Elevator Details',
        fields: [
          {
            id: 2,
            label: 'Building Name',
            value: 'Silverhill Apartments',
          },
          {
            id: 3,
            label: 'Type',
            value: 'Glass Elevator',
          },
        ],
      },
      {
        id: 2,
        title: 'Maintenance Information',
        fields: [
          {
            id: 4,
            label: 'Status',
            value: 'Operational',
          },
        ],
      },
    ],
  };

  const DetailsPageContentComponent = (props?: Partial<DetailsPageContentProps>) => (
    <DetailsPageContent {...defaultProps} {...props} />
  );

  it('should render component without crashing', () => {
    render(DetailsPageContentComponent());

    const detailsPageSectionCards = screen.getAllByTestId('base-card');

    expect(detailsPageSectionCards).toHaveLength(2);
    expect(screen.getByText('Elevator Details')).toBeInTheDocument();
    expect(screen.getByText('Maintenance Information')).toBeInTheDocument();
  });

  it('should return null when loading is true', () => {
    const { container } = render(DetailsPageContentComponent({ loading: true }));

    expect(container).toBeEmptyDOMElement();
  });

  it('should return null when error is defined', () => {
    const { container } = render(DetailsPageContentComponent({ error: 'Something went wrong' }));

    expect(container).toBeEmptyDOMElement();
  });
});
