import { render, screen } from '@testing-library/react';

import PhotoEvidenceComparison, {
  PhotoEvidenceComparisonProps,
} from '@/shared/repair-job/photo-evidence-comparison/PhotoEvidenceComparison';

describe('PhotoEvidenceComparison', () => {
  const mockBeforeImageUrl = 'https://example.com/before.jpg';
  const mockAfterImageUrl = 'https://example.com/after.jpg';

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    beforePhotoUrl: mockBeforeImageUrl,
    afterPhotoUrl: mockAfterImageUrl,
  };

  const PhotoEvidenceComparisonComponent = (props?: Partial<PhotoEvidenceComparisonProps>) => (
    <PhotoEvidenceComparison {...defaultProps} {...props} />
  );

  it('should render both Before and After photo evidence cards', () => {
    render(PhotoEvidenceComparisonComponent());

    expect(screen.getByText('Before')).toBeInTheDocument();
    expect(screen.getByText('After')).toBeInTheDocument();
  });

  it('should render Before evidence photo', () => {
    render(PhotoEvidenceComparisonComponent({ afterPhotoUrl: null }));

    const beforeImage = screen.getByAltText('Before');

    expect(beforeImage).toBeInTheDocument();
    expect(beforeImage).toHaveAttribute('src', mockBeforeImageUrl);
  });

  it('should render After evidence photo when provided', () => {
    render(PhotoEvidenceComparisonComponent());

    const afterImage = screen.getByAltText('After');

    expect(afterImage).toBeInTheDocument();
    expect(afterImage).toHaveAttribute('src', mockAfterImageUrl);
  });

  it('should render fallback text when After evidence photo is missing', () => {
    render(PhotoEvidenceComparisonComponent({ afterPhotoUrl: null }));

    expect(screen.getByText('Repair job is not completed yet.')).toBeInTheDocument();
  });
});
