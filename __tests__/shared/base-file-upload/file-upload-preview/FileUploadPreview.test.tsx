import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FileUploadPreview from '@/shared/base-file-upload/file-upload-preview';
import { FileUploadPreviewProps } from '@/shared/base-file-upload/file-upload-preview/types';

jest.mock('@/shared/base-file-upload/file-upload-preview/file-upload-placeholder', () => ({
  __esModule: true,
  default: () => <div data-testid='placeholder' />,
}));

jest.mock('@/shared/base-file-upload/file-upload-preview/file-upload-actions-overlay', () => ({
  __esModule: true,
  default: ({ onRemove }: FileUploadPreviewProps) => (
    <button data-testid='remove-btn' onClick={onRemove}>
      remove
    </button>
  ),
}));

describe('FileUploadPreview', () => {
  const mockOnRemove = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    previewImage: null,
    onRemove: mockOnRemove,
  };

  const FileUploadPreviewComponent = (props?: Partial<FileUploadPreviewProps>) => (
    <FileUploadPreview {...defaultProps} {...props} />
  );

  it('should render placeholder when no previewImage provided', () => {
    render(FileUploadPreviewComponent());

    expect(screen.getByTestId('placeholder')).toBeInTheDocument();
    expect(screen.queryByAltText('Preview')).not.toBeInTheDocument();
  });

  it('should render image and overlay when previewImage exists', () => {
    render(FileUploadPreviewComponent({ previewImage: 'test-image.png' }));

    const image = screen.getByAltText('Preview');

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test-image.png');

    expect(screen.getByTestId('remove-btn')).toBeInTheDocument();
  });

  it('should call onRemove when remove button is clicked', async () => {
    render(FileUploadPreviewComponent({ previewImage: 'test-image.png' }));

    await userEvent.click(screen.getByTestId('remove-btn'));

    expect(mockOnRemove).toHaveBeenCalled();
  });
});
