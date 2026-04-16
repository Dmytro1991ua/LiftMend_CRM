import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FileUploadActionsOverlay from '@/shared/base-file-upload/file-upload-preview/file-upload-actions-overlay';

describe('FileUploadActionsOverlay', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render overlay content', () => {
    render(<FileUploadActionsOverlay onRemove={jest.fn()} />);

    expect(screen.getByText('Change Photo')).toBeInTheDocument();
    expect(screen.getByText('Remove')).toBeInTheDocument();
  });

  it('should call onRemove when remove button is clicked', async () => {
    const onRemove = jest.fn();

    render(<FileUploadActionsOverlay onRemove={onRemove} />);

    await userEvent.click(screen.getByText('Remove'));

    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
